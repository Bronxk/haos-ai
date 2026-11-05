"""Exercise the approved-change apply path end to end against a live runtime.

Covers the guarantees the review board asked for: the server assigns the
automation id, a body cannot retarget it, an update needs a live target, an
invalid body is refused, and one approval cannot be replayed.
"""

from __future__ import annotations

import asyncio
import inspect
import os
import sys
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from typing import Any
from unittest.mock import patch

from homeassistant import bootstrap, loader
from homeassistant.core import HomeAssistant

sys.path.insert(0, "/workspace")

from custom_components.haos_ai.automation_store import (  # noqa: E402
    async_get_automation,
    async_read_automations,
)
from custom_components.haos_ai.const import DOMAIN  # noqa: E402
from custom_components.haos_ai.runtime import HaosAIRuntime  # noqa: E402
from custom_components.haos_ai.storage import (  # noqa: E402
    content_hash,
    suggestion_revision,
)
from custom_components.haos_ai.websocket_api import ws_change_apply  # noqa: E402

VALID = {
    "alias": "Hall light",
    "triggers": [
        {"trigger": "state", "entity_id": "binary_sensor.front_door", "to": "on"}
    ],
    "conditions": [],
    "actions": [{"action": "light.turn_on", "target": {"entity_id": "light.hall"}}],
    "mode": "single",
}


class FakeStore:
    """Hold one suggestion and record the ledger, as the real store does."""

    def __init__(self, suggestion: dict[str, Any]) -> None:
        self.data = {
            "preferences": {
                "change_permissions": {
                    "create_automations": True,
                    "update_automations": True,
                    "remove_entities": True,
                    "remove_devices": True,
                }
            },
            "applied_changes": [],
        }
        self.suggestion = suggestion
        self.save_count = 0

    def get_suggestion(self, suggestion_id: str) -> dict[str, Any] | None:
        return self.suggestion if suggestion_id == self.suggestion["id"] else None

    def update_suggestion(
        self, suggestion_id: str, status: str
    ) -> dict[str, Any] | None:
        item = self.get_suggestion(suggestion_id)
        if item is not None:
            item["status"] = status
        return item

    def record_applied_change(self, change: Any) -> dict[str, Any]:
        serialized = change.to_dict()
        self.data["applied_changes"].append(serialized)
        return serialized

    async def async_save(self) -> None:
        self.save_count += 1


class FakeConnection:
    """Capture one decorated WebSocket command result."""

    def __init__(self) -> None:
        self.user = SimpleNamespace(is_admin=True)
        self.result: tuple[int, Any] | None = None
        self.error: tuple[int, str, str] | None = None
        self.completed = asyncio.Event()

    def reset(self) -> None:
        self.result = None
        self.error = None
        self.completed.clear()

    def send_result(self, msg_id: int, result: Any) -> None:
        self.result = (msg_id, result)
        self.completed.set()

    def send_error(self, msg_id: int, code: str, message: str) -> None:
        self.error = (msg_id, code, message)
        self.completed.set()


def suggestion(identifier: str, *, target_id: str | None = None) -> dict[str, Any]:
    return {
        "id": identifier,
        "status": "new",
        "title": "Hall light when the door opens",
        "kind": "automation",
        "operation": None,
        "automation": {
            "config": dict(VALID),
            "yaml": "",
            "validation": {"valid": True, "errors": {}},
            "explanation": "",
            "target_id": target_id,
        },
    }


async def invoke(
    hass: HomeAssistant,
    connection: FakeConnection,
    suggestion_id: str,
    *,
    operation: str | None = None,
    config: dict[str, Any] | None = None,
    expected_revision: str | None = None,
    expected_config_hash: str | None = None,
) -> None:
    connection.reset()
    msg: dict[str, Any] = {
        "id": 1,
        "type": "haos_ai/change/apply",
        "suggestion_id": suggestion_id,
        "confirm": True,
    }
    item = hass.data[DOMAIN].store.get_suggestion(suggestion_id)
    msg["expected_revision"] = (
        suggestion_revision(item) if expected_revision is None else expected_revision
    )
    if item.get("automation", {}).get("target_id"):
        current = await async_get_automation(hass, item["automation"]["target_id"])
        msg["expected_config_hash"] = (
            content_hash(current)
            if expected_config_hash is None
            else expected_config_hash
        )
    if operation is not None:
        msg["operation"] = operation
    if config is not None:
        msg["config"] = config
    result = ws_change_apply(hass, connection, msg)
    if inspect.isawaitable(result):
        await result
    await asyncio.wait_for(connection.completed.wait(), timeout=5)


def install(hass: HomeAssistant, item: dict[str, Any]) -> FakeStore:
    store = FakeStore(item)
    hass.data[DOMAIN] = HaosAIRuntime(
        entry=SimpleNamespace(data={}, options={}), advisor=None, store=store
    )
    return store


async def run(config_dir: str) -> None:
    os.makedirs(config_dir, exist_ok=True)
    # The apply path reloads the automation platform, which re-reads the real
    # configuration, so the harness needs the same file layout Home Assistant
    # expects: an included automations file that starts empty.
    with open(
        os.path.join(config_dir, "configuration.yaml"), "w", encoding="utf-8"
    ) as handle:
        handle.write("automation: !include automations.yaml\n")
    with open(
        os.path.join(config_dir, "automations.yaml"), "w", encoding="utf-8"
    ) as handle:
        handle.write("[]\n")

    hass = HomeAssistant(config_dir)
    loader.async_setup(hass)
    assert (
        await bootstrap.async_from_config_dict({"automation": [], "config": {}}, hass)
        is hass
    )

    # 1. A create is written under a server-assigned id, and a model-supplied
    #    id in the body cannot retarget it.
    item = suggestion("create-1")
    store = install(hass, item)
    connection = FakeConnection()
    body = {**VALID, "id": "model-supplied-id"}
    await invoke(
        hass, connection, "create-1", operation="create_automation", config=body
    )
    assert connection.error is None, connection.error
    assert connection.result is not None
    payload = connection.result[1]
    assert payload["applied"] is True
    assert payload["operation"] == "create_automation"
    automation_id = payload["automation_id"]
    assert automation_id and automation_id != "model-supplied-id"
    stored = await async_read_automations(hass)
    assert len(stored) == 1, stored
    assert stored[0]["id"] == automation_id
    assert item["status"] == "saved"
    ledger = store.data["applied_changes"]
    assert ledger and ledger[0]["config_hash"], ledger

    # 2. Replaying the same approval must not create a second automation.
    await invoke(
        hass, connection, "create-1", operation="create_automation", config=VALID
    )
    assert connection.error is not None
    assert connection.error[1] == "already_applied", connection.error
    assert len(await async_read_automations(hass)) == 1

    # 2b. The applied marker is persisted on the suggestion and links the ledger.
    assert item["applied_at"], item
    assert item["applied_change_id"] == ledger[0]["id"], item
    assert payload["applied_change"]["id"] == item["applied_change_id"]

    # 2c. Dismiss -> restore must not make an applied suggestion approvable.
    store.update_suggestion("create-1", "dismissed")
    store.update_suggestion("create-1", "new")
    ledger_len = len(store.data["applied_changes"])
    await invoke(
        hass, connection, "create-1", operation="create_automation", config=VALID
    )
    assert connection.error is not None
    assert connection.error[1] == "already_applied", connection.error
    assert len(await async_read_automations(hass)) == 1
    assert len(store.data["applied_changes"]) == ledger_len
    assert item["applied_at"] and item["applied_change_id"]

    # 3. An update needs a target that still exists.
    missing = suggestion("update-missing", target_id="does-not-exist")
    install(hass, missing)
    await invoke(
        hass, connection, "update-missing", operation="update_automation", config=VALID
    )
    assert connection.error is not None
    assert connection.error[1] == "operation_failed", connection.error

    # 4. A body that does not validate is refused.
    broken = suggestion("create-broken")
    install(hass, broken)
    await invoke(
        hass,
        connection,
        "create-broken",
        operation="create_automation",
        config={"alias": "Broken", "triggers": [], "actions": "not-a-list"},
    )
    assert connection.error is not None
    assert "validate" in connection.error[2].lower(), connection.error
    assert len(await async_read_automations(hass)) == 1

    # 5. The operation is derived from the suggestion, not chosen by the caller.
    mismatch = suggestion("update-1", target_id=automation_id)
    install(hass, mismatch)
    await invoke(
        hass, connection, "update-1", operation="create_automation", config=VALID
    )
    assert connection.error is not None
    assert connection.error[1] == "operation_mismatch", connection.error

    # 6. The matching operation succeeds and replaces the stored automation.
    updated = {**VALID, "alias": "Hall light v2"}
    await invoke(
        hass, connection, "update-1", operation="update_automation", config=updated
    )
    assert connection.error is None, connection.error
    assert connection.result is not None
    assert connection.result[1]["replaced"] is True
    stored = await async_read_automations(hass)
    assert len(stored) == 1, stored
    assert stored[0]["alias"] == "Hall light v2"

    # 8. A merely bookmarked ("saved") suggestion can still be approved.
    before = len(await async_read_automations(hass))
    marked = suggestion("bookmarked-1")
    marked["status"] = "saved"
    mark_store = install(hass, marked)
    await invoke(
        hass, connection, "bookmarked-1", operation="create_automation", config=VALID
    )
    assert connection.error is None, connection.error
    assert connection.result is not None
    assert len(await async_read_automations(hass)) == before + 1
    assert marked["applied_at"], marked
    assert marked["applied_change_id"] == mark_store.data["applied_changes"][0]["id"]

    # 9. Legacy data: a suggestion without markers but with a ledger entry is
    # refused (ledger fallback in the apply path).
    before = len(await async_read_automations(hass))
    legacy = suggestion("legacy-1")
    legacy_store = install(hass, legacy)
    legacy_store.data["applied_changes"] = [
        {
            "id": "old-change",
            "suggestion_id": "legacy-1",
            "applied_at": "2026-01-01T00:00:00+00:00",
        }
    ]
    await invoke(
        hass, connection, "legacy-1", operation="create_automation", config=VALID
    )
    assert connection.error is not None
    assert connection.error[1] == "already_applied", connection.error
    assert len(await async_read_automations(hass)) == before
    assert len(legacy_store.data["applied_changes"]) == 1

    # 10. A reload failure after the file write still records ledger + marker,
    # so a retry cannot create a second automation.
    before = len(await async_read_automations(hass))
    flaky = suggestion("reload-fail-1")
    flaky_store = install(hass, flaky)
    with patch.object(
        type(hass.services), "async_call", side_effect=RuntimeError("reload boom")
    ):
        await invoke(
            hass,
            connection,
            "reload-fail-1",
            operation="create_automation",
            config=VALID,
        )
    assert connection.error is None, connection.error
    assert connection.result is not None
    assert connection.result[1]["reload_failed"] is True, connection.result
    assert len(await async_read_automations(hass)) == before + 1
    assert flaky["applied_at"] and flaky["applied_change_id"], flaky
    assert len(flaky_store.data["applied_changes"]) == 1
    await invoke(
        hass, connection, "reload-fail-1", operation="create_automation", config=VALID
    )
    assert connection.error is not None
    assert connection.error[1] == "already_applied", connection.error
    assert len(await async_read_automations(hass)) == before + 1

    # A reviewed suggestion cannot be approved after recurrence changes its body.
    changed = suggestion("stale", target_id=automation_id)
    install(hass, changed)
    reviewed = suggestion_revision(changed)
    changed["automation"]["target_id"] = "other-target"
    await invoke(hass, connection, "stale", config=VALID, expected_revision=reviewed)
    assert connection.error[1] == "stale_suggestion", connection.error
    await invoke(hass, connection, "stale", config=VALID, expected_revision="")
    assert connection.error[1] == "stale_suggestion", connection.error

    # Recurrence while waiting for a scan's lock invalidates the queued approval.
    changed = suggestion("queued-stale", target_id=automation_id)
    install(hass, changed)
    runtime = hass.data[DOMAIN]
    await runtime.operation_lock.acquire()
    queued = asyncio.create_task(invoke(hass, connection, "queued-stale", config=VALID))
    await asyncio.sleep(0)
    changed["rationale"] = "New scan evidence arrived"
    runtime.operation_lock.release()
    await queued
    assert connection.error[1] == "stale_suggestion", connection.error

    # Exercise HA's actual native POST with its actual registered view lock.
    from aiohttp.test_utils import make_mocked_request
    from homeassistant.components.http import KEY_HASS

    from custom_components.haos_ai import automation_store

    editor = await automation_store._async_native_editor(hass)

    async def native_save(identifier: str, alias: str) -> None:
        request = make_mocked_request(
            "POST", "/api/config/automation/config/" + identifier, app={KEY_HASS: hass}
        )

        async def body() -> dict[str, Any]:
            return {**VALID, "alias": alias}

        request.json = body
        response = await editor.post.__wrapped__(editor, request, identifier)
        assert response.status == 200, response.text

    ai_read = asyncio.Event()
    release_ai = asyncio.Event()
    original_executor = hass.async_add_executor_job

    async def gated_executor(self: Any, target: Any, *args: Any) -> Any:
        value = await original_executor(target, *args)
        if target is automation_store._read:
            ai_read.set()
            await release_ai.wait()
        return value

    with patch.object(type(hass), "async_add_executor_job", gated_executor):
        ai = asyncio.create_task(
            automation_store.async_save_automation(hass, "ai-concurrent", VALID)
        )
        await asyncio.wait_for(ai_read.wait(), 5)
        native = asyncio.create_task(native_save("native-concurrent", "Native editor"))
        await asyncio.sleep(0)
        assert not native.done(), "Native POST ignored the shared mutation lock"
        release_ai.set()
        await asyncio.gather(ai, native)
    rows = await async_read_automations(hass)
    assert {"ai-concurrent", "native-concurrent"} <= {row["id"] for row in rows}

    # Native edits made after the reviewed diff must block an AI update.
    reviewed_config = await async_get_automation(hass, automation_id)
    stale_hash = content_hash(reviewed_config)
    await native_save(automation_id, "Native changed after review")
    item = suggestion("native-stale", target_id=automation_id)
    install(hass, item)
    await invoke(
        hass, connection, "native-stale", config=VALID, expected_config_hash=stale_hash
    )
    assert connection.error[1] == "operation_failed", connection.error
    assert "changed" in connection.error[2], connection.error
    assert (await async_get_automation(hass, automation_id))[
        "alias"
    ] == "Native changed after review"
    await invoke(
        hass, connection, "native-stale", config=VALID, expected_config_hash=""
    )
    assert connection.error[1] == "operation_failed", connection.error

    # 7. Update targets are limited to what automations.yaml can rewrite: an
    #    automation loaded from a package or other file is not a valid target.
    from custom_components.haos_ai.context import ContextEngine

    file_ids = {str(row["id"]) for row in await async_read_automations(hass)}
    assert file_ids
    engine = ContextEngine(hass)
    with patch.object(
        ContextEngine,
        "automation_ids",
        return_value=file_ids | {"package_only_automation"},
    ):
        editable = await engine.async_editable_automation_ids()
    assert editable == file_ids, editable
    assert "package_only_automation" not in editable

    await hass.async_stop(force=True)
    print("Automation apply smoke test OK")


async def main() -> None:
    with TemporaryDirectory(prefix="haos-ai-apply-") as config_dir:
        await run(config_dir)


asyncio.run(main())
