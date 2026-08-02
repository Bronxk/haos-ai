"""Verify the HAOS AI conversation entity against the installed HA runtime."""

import inspect
import sys
from types import SimpleNamespace

from homeassistant.components import conversation
from homeassistant.const import MATCH_ALL

sys.path.insert(0, "/workspace")

from custom_components.haos_ai.conversation import (
    HaosAIConversationEntity,  # noqa: E402
)

entry = SimpleNamespace(entry_id="haos-ai-smoke")
entity = HaosAIConversationEntity(entry)

assert isinstance(entity, conversation.ConversationEntity)
assert entity.supported_languages == MATCH_ALL
assert "chat_log" in inspect.signature(entity._async_handle_message).parameters
assert len(inspect.signature(conversation.async_set_agent).parameters) == 3
assert len(inspect.signature(conversation.async_unset_agent).parameters) == 2
print("Conversation entity smoke test OK")
