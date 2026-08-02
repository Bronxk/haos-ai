"""Read-only Home Assistant Assist conversation agent for HAOS AI."""

from __future__ import annotations

import uuid
from typing import Literal, override

from homeassistant.components import conversation
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import MATCH_ALL
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN
from .runtime import HaosAIRuntime


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the HAOS AI read-only conversation entity."""
    async_add_entities([HaosAIConversationEntity(entry)])


class HaosAIConversationEntity(
    conversation.ConversationEntity,
    conversation.AbstractConversationAgent,
):
    """Expose the setup-aware advisor to Home Assistant Assist."""

    _attr_name = "HAOS AI advisor"
    _attr_icon = "mdi:creation-outline"
    _attr_has_entity_name = True

    def __init__(self, entry: ConfigEntry) -> None:
        """Initialize the read-only conversation agent."""
        self.entry = entry
        self._attr_unique_id = entry.entry_id

    @property
    @override
    def supported_languages(self) -> list[str] | Literal["*"]:
        """Return supported languages; the configured model handles locale."""
        return MATCH_ALL

    @override
    async def async_added_to_hass(self) -> None:
        """Register this entity as a selectable Assist agent."""
        await super().async_added_to_hass()
        conversation.async_set_agent(self.hass, self.entry, self)

    @override
    async def async_will_remove_from_hass(self) -> None:
        """Unregister the Assist agent."""
        conversation.async_unset_agent(self.hass, self.entry)
        await super().async_will_remove_from_hass()

    @override
    async def _async_handle_message(
        self,
        user_input: conversation.ConversationInput,
        chat_log: conversation.ChatLog,
    ) -> conversation.ConversationResult:
        """Answer through the same bounded, read-only advisor used by the panel."""
        runtime: HaosAIRuntime | None = self.hass.data.get(DOMAIN)
        if runtime is None:
            return self._result(
                user_input,
                chat_log,
                "HAOS AI is not configured yet.",
            )
        if runtime.operation_lock.locked():
            return self._result(
                user_input,
                chat_log,
                "HAOS AI is busy with another request. Try again in a moment.",
            )

        thread_id = str(
            getattr(chat_log, "conversation_id", None)
            or user_input.conversation_id
            or f"assist-{uuid.uuid4().hex}"
        )[:80]

        async def progress(event: dict[str, object]) -> None:
            self.hass.bus.async_fire(f"{DOMAIN}_progress", event)

        async with runtime.operation_lock:
            result = await runtime.advisor.async_chat(
                thread_id,
                user_input.text,
                progress,
            )
        return self._result(
            user_input,
            chat_log,
            str(result["message"]["content"]),
        )

    @staticmethod
    def _result(
        user_input: conversation.ConversationInput,
        chat_log: conversation.ChatLog,
        content: str,
    ) -> conversation.ConversationResult:
        chat_log.async_add_assistant_content_without_tools(
            conversation.AssistantContent(
                agent_id=user_input.agent_id,
                content=content,
            )
        )
        return conversation.async_get_result_from_chat_log(user_input, chat_log)
