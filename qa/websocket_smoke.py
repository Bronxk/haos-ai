"""Exercise an admin WebSocket command in Home Assistant."""

import asyncio
import sys
from types import SimpleNamespace
from typing import Any

from homeassistant.core import HomeAssistant

sys.path.insert(0, "/workspace")

from custom_components.haos_ai.const import DOMAIN  # noqa: E402
from custom_components.haos_ai.runtime import HaosAIRuntime  # noqa: E402
from custom_components.haos_ai.websocket_api import (  # noqa: E402
    _validated_options,
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


class FakeConnection:
    """Capture the WebSocket command result."""

    def __init__(self) -> None:
        self.user = SimpleNamespace(is_admin=True)
        self.result: Any = None
        self.completed = asyncio.Event()

    def send_result(self, msg_id: int, result: Any) -> None:
        """Record a successful result."""
        self.result = (msg_id, result)
        self.completed.set()


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
        advisor=None,
        store=FakeStore(),
    )
    connection = FakeConnection()

    ws_overview(hass, connection, {"id": 1, "type": "haos_ai/overview"})
    await asyncio.wait_for(connection.completed.wait(), timeout=2)

    assert connection.result[0] == 1
    assert connection.result[1]["provider"] == "openai"
    assert connection.result[1]["version"] == "1.0.3"
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
    await hass.async_stop(force=True)
    print("WebSocket smoke test OK")


asyncio.run(main())
