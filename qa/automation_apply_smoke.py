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
from types import SimpleNamespace
from typing import Any

from homeassistant import bootstrap, loader
from homeassistant.core import HomeAssistant

sys.path.insert(0, "/workspace")

from custom_components.haos_ai.automation_store import (  # noqa: E402
    async_read_automations,
)
from custom_components.haos_ai.const import DOMAIN  # noqa: E402
from custom_components.haos_ai.runtime import HaosAIRuntime  # noqa: E402
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


def suggestion(
    identifier: str, *, target_id: str | None = None
) -> dict[str, Any]:
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
) -> None:
    connection.reset()
    msg: dict[str, Any] = {
        "id": 1,
        "type": "haos_ai/change/apply",
        "suggestion_id": suggestion_id,
        "confirm": True,
    }
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


async def main() -> None:
    config_dir = "/tmp/haos-ai-apply"
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
    assert await bootstrap.async_from_config_dict({"automation": []}, hass) is hass

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

    await hass.async_stop(force=True)
    print("Automation apply smoke test OK")


asyncio.run(main())
