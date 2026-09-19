"""Read-only Home Assistant Assist conversation agent for HAOS AI."""

from __future__ import annotations

import hashlib
import logging
import uuid
from typing import Literal, override

from homeassistant.components import conversation
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import MATCH_ALL
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .advisor import BudgetExceededError
from .const import DOMAIN
from .runtime import HaosAIRuntime

_LOGGER = logging.getLogger(__name__)

# The advisor exposes the same setup internals as the admin-only panel:
# inventory, entity detail, integration health, and raw automation config.
# Assist therefore has to apply the same administrator requirement.
NOT_AUTHORIZED = (
    "HAOS AI is an administrator tool. Sign in as a Home Assistant "
    "administrator to ask it about this setup."
)


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

    async def _async_is_admin(self, user_id: str | None) -> bool:
        """Return whether this request comes from a Home Assistant admin.

        An unattributed request — a voice satellite or a service call made
        without a user context — cannot be proven to be an administrator, so
        it is refused rather than trusted.
        """
        if not user_id:
            return False
        user = await self.hass.auth.async_get_user(user_id)
        return bool(user and user.is_admin)

    @staticmethod
    def _thread_id(
        user_input: conversation.ConversationInput,
        chat_log: conversation.ChatLog,
    ) -> str:
        """Derive a thread id that cannot address another caller's thread.

        The conversation id is caller-supplied. Namespacing it per user and
        hashing it keeps Assist history stable across turns while making it
        impossible to aim a request at a panel thread or another user's.
        """
        conversation_id = str(
            getattr(chat_log, "conversation_id", None)
            or user_input.conversation_id
            or uuid.uuid4().hex
        )
        scope = hashlib.sha256(conversation_id.encode("utf-8")).hexdigest()[:24]
        return f"assist:{user_input.context.user_id}:{scope}"

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
        if not await self._async_is_admin(user_input.context.user_id):
            _LOGGER.warning(
                "Rejected a HAOS AI Assist request from a non-administrator"
            )
            return self._result(user_input, chat_log, NOT_AUTHORIZED)
        if runtime.operation_lock.locked():
            return self._result(
                user_input,
                chat_log,
                "HAOS AI is busy with another request. Try again in a moment.",
            )

        thread_id = self._thread_id(user_input, chat_log)

        async def progress(event: dict[str, object]) -> None:
            self.hass.bus.async_fire(f"{DOMAIN}_progress", event)

        try:
            async with runtime.operation_lock:
                result = await runtime.advisor.async_chat(
                    thread_id,
                    user_input.text,
                    progress,
                )
        except BudgetExceededError as err:
            return self._result(user_input, chat_log, str(err))
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
