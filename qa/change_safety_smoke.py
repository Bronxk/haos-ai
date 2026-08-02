"""Prove registry changes remain admin-only, explicit, and fail closed."""

from __future__ import annotations

import asyncio
import inspect
import sys
from types import SimpleNamespace
from typing import Any

from homeassistant.config_entries import ConfigEntries
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

sys.path.insert(0, "/workspace")

from custom_components.haos_ai.const import DOMAIN  # noqa: E402
from custom_components.haos_ai.runtime import HaosAIRuntime  # noqa: E402
from custom_components.haos_ai.websocket_api import ws_change_apply  # noqa: E402


class FakeStore:
    """Hold one synthetic operation and record persistence calls."""

    def __init__(self, entity_id: str) -> None:
        self.data = {
            "preferences": {
                "change_permissions": {
                    "create_automations": False,
                    "update_automations": False,
                    "remove_entities": False,
                    "remove_devices": False,
                }
            }
        }
        self.suggestion = {
            "id": "synthetic-removal",
            "status": "new",
            "operation": {
                "type": "remove_entity",
                "target_id": entity_id,
                "label": "Synthetic orphan",
            },
        }
        self.save_count = 0

    def get_suggestion(self, suggestion_id: str) -> dict[str, Any] | None:
        """Return the operation only for its exact identifier."""
        return self.suggestion if suggestion_id == self.suggestion["id"] else None

    def update_suggestion(
        self, suggestion_id: str, status: str
    ) -> dict[str, Any] | None:
        """Update the synthetic suggestion status."""
        item = self.get_suggestion(suggestion_id)
        if item is not None:
            item["status"] = status
        return item

    async def async_save(self) -> None:
        """Record that the successful operation was persisted."""
        self.save_count += 1


class FakeConnection:
    """Capture one decorated WebSocket command result."""

    def __init__(self, *, admin: bool) -> None:
        self.user = SimpleNamespace(is_admin=admin)
        self.result: tuple[int, Any] | None = None
        self.error: tuple[int, str, str] | None = None
        self.completed = asyncio.Event()

    def reset(self, *, admin: bool | None = None) -> None:
        """Prepare the connection for another command."""
        if admin is not None:
            self.user.is_admin = admin
        self.result = None
        self.error = None
        self.completed.clear()

    def send_result(self, msg_id: int, result: Any) -> None:
        """Capture a successful result."""
        self.result = (msg_id, result)
        self.completed.set()

    def send_error(self, msg_id: int, code: str, message: str) -> None:
        """Capture a rejected command."""
        self.error = (msg_id, code, message)
        self.completed.set()


async def invoke(
    hass: HomeAssistant,
    connection: FakeConnection,
    *,
    confirm: bool,
) -> None:
    """Invoke the fully decorated handler and await its response."""
    result = ws_change_apply(
        hass,
        connection,
        {
            "id": 1,
            "type": "haos_ai/change/apply",
            "suggestion_id": "synthetic-removal",
            "confirm": confirm,
        },
    )
    if inspect.isawaitable(result):
        await result
    await asyncio.wait_for(connection.completed.wait(), timeout=2)


async def main() -> None:
    """Exercise every fail-closed gate before one synthetic removal."""
    hass = HomeAssistant("/tmp/haos-ai-change-safety")
    hass.config_entries = ConfigEntries(hass, {})
    await hass.config_entries.async_initialize()
    dr.async_setup(hass)
    await dr.async_load(hass)
    await er.async_load(hass)
    registry = er.async_get(hass)
    entry = registry.async_get_or_create(
        "sensor",
        "haos_ai_test",
        "synthetic-orphan",
        suggested_object_id="haos_ai_synthetic_orphan",
    )
    entity_id = entry.entity_id
    store = FakeStore(entity_id)
    hass.data[DOMAIN] = HaosAIRuntime(
        entry=SimpleNamespace(data={}, options={}),
        advisor=None,
        store=store,
    )
    connection = FakeConnection(admin=False)

    try:
        await invoke(hass, connection, confirm=True)
    except Unauthorized:
        pass
    else:
        raise AssertionError("Non-admin change command was not rejected")
    assert registry.async_get(entity_id) is not None

    connection.reset(admin=True)
    await invoke(hass, connection, confirm=False)
    assert connection.error is not None
    assert connection.error[1] == "approval_required"
    assert registry.async_get(entity_id) is not None

    connection.reset()
    await invoke(hass, connection, confirm=True)
    assert connection.error is not None
    assert connection.error[1] == "permission_disabled"
    assert registry.async_get(entity_id) is not None

    store.data["preferences"]["change_permissions"]["remove_entities"] = True
    hass.states.async_set(entity_id, "unavailable")
    connection.reset()
    await invoke(hass, connection, confirm=True)
    assert connection.error is not None
    assert registry.async_get(entity_id) is not None

    hass.states.async_remove(entity_id)
    connection.reset()
    await invoke(hass, connection, confirm=True)
    assert connection.result == (1, {"applied": True, "operation": "remove_entity"})
    assert registry.async_get(entity_id) is None
    assert store.suggestion["status"] == "saved"
    assert store.save_count == 1

    await hass.async_stop(force=True)
    print("Change safety smoke test OK")


asyncio.run(main())
