"""Prove chat deletion and unload respect an in-flight runtime operation."""

from __future__ import annotations

import asyncio
import inspect
import sys
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from typing import Any
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant

sys.path.insert(0, "/workspace")

from custom_components import haos_ai  # noqa: E402
from custom_components.haos_ai.const import DOMAIN  # noqa: E402
from custom_components.haos_ai.models import ChatMessage  # noqa: E402
from custom_components.haos_ai.runtime import HaosAIRuntime  # noqa: E402
from custom_components.haos_ai.storage import AdvisorStore, default_data  # noqa: E402
from custom_components.haos_ai.websocket_api import (  # noqa: E402
    ws_chat,
    ws_chat_thread_delete,
)


class Connection:
    """Capture a decorated HA command's eventual result."""

    user = SimpleNamespace(is_admin=True)

    def __init__(self) -> None:
        self.completed = asyncio.Event()
        self.result: Any = None
        self.error: Any = None

    def send_result(self, _identifier: int, result: Any) -> None:
        self.result = result
        self.completed.set()

    def send_error(self, _identifier: int, *error: Any) -> None:
        self.error = error
        self.completed.set()

    def send_event(self, *args: Any) -> None:
        """Accept chat progress events."""


async def invoke(
    handler: Any, hass: HomeAssistant, connection: Connection, message: dict[str, Any]
) -> None:
    result = handler(hass, connection, {"id": 1, **message})
    if inspect.isawaitable(result):
        await result
    await asyncio.wait_for(connection.completed.wait(), 5)


async def main() -> None:
    with TemporaryDirectory() as config_dir:
        hass = HomeAssistant(config_dir)
        store = AdvisorStore.__new__(AdvisorStore)
        store.data = default_data()
        store.async_save = AsyncMock()
        started = asyncio.Event()
        finish = asyncio.Event()

        class Advisor:
            async def async_chat(self, thread_id: str, text: str, progress: Any) -> Any:
                store.add_message(thread_id, ChatMessage(role="user", content=text))
                started.set()
                await finish.wait()
                store.add_message(
                    thread_id, ChatMessage(role="assistant", content="reply")
                )
                return {"message": {"content": "reply"}}

        runtime = HaosAIRuntime(entry=SimpleNamespace(), advisor=Advisor(), store=store)
        hass.data[DOMAIN] = runtime
        chat = Connection()
        pending = asyncio.create_task(
            invoke(
                ws_chat,
                hass,
                chat,
                {
                    "type": "haos_ai/chat",
                    "thread_id": "delete-me",
                    "text": "hello",
                    "confirm_context": True,
                },
            )
        )
        await asyncio.wait_for(started.wait(), 5)
        deletion = Connection()
        deleting = asyncio.create_task(
            invoke(
                ws_chat_thread_delete,
                hass,
                deletion,
                {
                    "type": "haos_ai/chat/thread/delete",
                    "thread_id": "delete-me",
                },
            )
        )
        await asyncio.sleep(0)
        assert not deletion.completed.is_set(), "Delete returned before pending reply"
        finish.set()
        await asyncio.gather(pending, deleting)
        assert deletion.result == {"deleted": True}, deletion.error
        assert store.get_thread("delete-me") == []
        assert "delete-me" not in store.data["chat_threads"]

        # Timeout must leave runtime, scheduling and conversation platform intact.
        unload = AsyncMock(return_value=True)
        hass.config_entries = SimpleNamespace(async_unload_platforms=unload)
        runtime.unsubscribe_schedule = AsyncMock()
        await runtime.operation_lock.acquire()
        with patch.object(haos_ai, "UNLOAD_WAIT_SECONDS", 0.01):
            assert await haos_ai.async_unload_entry(hass, runtime.entry) is False
        assert hass.data[DOMAIN] is runtime
        assert runtime.closing is False
        unload.assert_not_awaited()
        runtime.unsubscribe_schedule.assert_not_called()
        runtime.operation_lock.release()

        # After completion, platforms unload under the runtime lock.
        async def safe_unload(*args: Any) -> bool:
            assert runtime.closing and runtime.operation_lock.locked()
            return True

        runtime.unsubscribe_schedule = lambda: None
        unload.side_effect = safe_unload
        assert await haos_ai.async_unload_entry(hass, runtime.entry) is True
        assert DOMAIN not in hass.data
        await hass.async_stop(force=True)
    print("Backend lifecycle smoke test OK")


asyncio.run(main())
