"""Exercise an admin WebSocket command in Home Assistant."""

import asyncio
import sys
from types import SimpleNamespace
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

sys.path.insert(0, "/workspace")

from custom_components.haos_ai.const import (  # noqa: E402
    DOMAIN,
    INTEGRATION_VERSION,
)
from custom_components.haos_ai.runtime import HaosAIRuntime  # noqa: E402
from custom_components.haos_ai.storage import AdvisorStore  # noqa: E402
from custom_components.haos_ai.websocket_api import (  # noqa: E402
    _runtime,
    _validated_options,
    ws_chat_thread,
    ws_chat_thread_delete,
    ws_chat_thread_rename,
    ws_config_update,
    ws_options_update,
    ws_overview,
)


class FakeStore:
    """Minimal store needed by the overview command."""

    data = {
        "preferences": {},
        "scan_runs": [],
    }

    @staticmethod
    def list_suggestions() -> list[dict[str, Any]]:
        """Return an empty suggestion inbox."""
        return []

    @staticmethod
    def list_threads() -> list[dict[str, Any]]:
        """Return no local chat threads."""
        return []

    @staticmethod
    def list_applied_changes() -> list[dict[str, Any]]:
        """Return an empty applied-change ledger."""
        return []


class FakeAdvisor:
    """Minimal advisor surface used by the overview command."""

    uses_scan_profile = False

    @staticmethod
    def budget_status() -> dict[str, Any]:
        """Return an uncapped token budget."""
        return {
            "total_tokens": 0,
            "budget": 0,
            "remaining": None,
            "ratio": 0.0,
            "exceeded": False,
            "warning": False,
        }


class FakeConnection:
    """Capture the WebSocket command result."""

    def __init__(self) -> None:
        self.user = SimpleNamespace(is_admin=True)
        self.result: Any = None
        self.error: Any = None
        self.completed = asyncio.Event()

    def send_result(self, msg_id: int, result: Any) -> None:
        """Record a successful result."""
        self.result = (msg_id, result)
        self.completed.set()


    def send_error(self, msg_id: int, code: str, message: str) -> None:
        """Record an error response."""
        self.error = (msg_id, code, message)
        self.completed.set()


async def call(hass: Any, handler: Any, msg: dict[str, Any]) -> FakeConnection:
    """Run one decorated handler and wait for its response."""
    conn = FakeConnection()
    handler(hass, conn, msg)
    await asyncio.wait_for(conn.completed.wait(), timeout=2)
    return conn


async def main() -> None:
    """Invoke the fully decorated handler and wait for its async response."""
    hass = HomeAssistant("/tmp/haos-ai-websocket")
    hass.data[DOMAIN] = HaosAIRuntime(
        entry=SimpleNamespace(
            data={
                "provider": "openai",
                "model": "test-model",
                "base_url": "https://api.openai.com/v1",
            },
            options={},
        ),
        advisor=FakeAdvisor(),
        store=FakeStore(),
    )
    connection = FakeConnection()

    ws_overview(hass, connection, {"id": 1, "type": "haos_ai/overview"})
    await asyncio.wait_for(connection.completed.wait(), timeout=2)

    assert connection.result[0] == 1
    assert connection.result[1]["provider"] == "openai"
    assert connection.result[1]["version"] == INTEGRATION_VERSION
    assert connection.result[1]["goal_presets"]
    options = _validated_options(
        {
            "history_days": 14,
            "schedule": "weekly",
            "schedule_time": "04:30",
            "schedule_weekday": 6,
        }
    )
    assert options["schedule_time"] == "04:30:00"
    assert options["schedule_weekday"] == 6

    # Assist threads are private: hidden from the list, rejected by the panel.
    store = AdvisorStore.__new__(AdvisorStore)
    store.data = {
        "chat_threads": {
            "assist:abc:1": [{"role": "user", "content": "secret", "created_at": "t"}],
            "panel1": [{"role": "user", "content": "hi", "created_at": "t"}],
        },
        "chat_thread_meta": {},
    }
    assert [t["id"] for t in store.list_threads()] == ["panel1"]
    hass.data[DOMAIN] = HaosAIRuntime(
        entry=SimpleNamespace(data={}, options={}),
        advisor=FakeAdvisor(),
        store=store,
    )
    for handler, extra in (
        (ws_chat_thread, {}),
        (ws_chat_thread_delete, {}),
        (ws_chat_thread_rename, {"title": "x"}),
    ):
        conn = await call(
            hass, handler, {"id": 5, "thread_id": "assist:abc:1", **extra}
        )
        assert conn.error and conn.error[1] == "not_found", conn.error
    assert "assist:abc:1" in store.data["chat_threads"]

    # Updates are refused while an advisor operation holds the lock.
    runtime = hass.data[DOMAIN]
    async with runtime.operation_lock:
        for handler, extra in (
            (ws_options_update, {"options": {}}),
            (ws_config_update, {"connection": {}, "options": {}}),
        ):
            conn = await call(hass, handler, {"id": 6, **extra})
            assert conn.error and conn.error[1] == "advisor_busy", conn.error

    # A missing runtime raises a message-bearing HA error, not a RuntimeError.
    hass.data.pop(DOMAIN)
    try:
        _runtime(hass)
    except HomeAssistantError as err:
        assert "not loaded" in str(err)
    else:
        raise AssertionError("expected HomeAssistantError")
    await hass.async_stop(force=True)
    print("WebSocket smoke test OK")


asyncio.run(main())
