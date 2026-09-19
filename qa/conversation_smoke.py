"""Verify the HAOS AI conversation entity against the installed HA runtime."""

import asyncio
import inspect
import sys
from types import SimpleNamespace

from homeassistant.components import conversation
from homeassistant.const import MATCH_ALL

sys.path.insert(0, "/workspace")

from custom_components.haos_ai.const import DOMAIN  # noqa: E402
from custom_components.haos_ai.conversation import (  # noqa: E402
    NOT_AUTHORIZED,
    HaosAIConversationEntity,
)

entry = SimpleNamespace(entry_id="haos-ai-smoke")
entity = HaosAIConversationEntity(entry)

assert isinstance(entity, conversation.ConversationEntity)
assert entity.supported_languages == MATCH_ALL
assert "chat_log" in inspect.signature(entity._async_handle_message).parameters
assert len(inspect.signature(conversation.async_set_agent).parameters) == 3
assert len(inspect.signature(conversation.async_unset_agent).parameters) == 2


class FakeAuth:
    """Resolve a small fixed set of Home Assistant users."""

    USERS = {
        "admin-user": SimpleNamespace(is_admin=True),
        "regular-user": SimpleNamespace(is_admin=False),
    }

    async def async_get_user(self, user_id):
        return self.USERS.get(user_id)


class RecordingAdvisor:
    """Record whether the advisor was reached, and on which thread."""

    def __init__(self) -> None:
        self.calls: list[str] = []

    async def async_chat(self, thread_id, text, progress):
        self.calls.append(thread_id)
        return {"message": {"content": "advisor answered"}}


class FakeChatLog:
    """Capture the content the entity would speak back."""

    conversation_id = "shared-conversation"

    def __init__(self) -> None:
        self.content = None

    def async_add_assistant_content_without_tools(self, content) -> None:
        self.content = content


def _input(user_id):
    return SimpleNamespace(
        text="What is wrong with my setup?",
        conversation_id="shared-conversation",
        agent_id="conversation.haos_ai",
        context=SimpleNamespace(user_id=user_id),
        language="en",
    )


def _run(user_id, advisor):
    """Drive one message and return the text the agent speaks back."""
    log = FakeChatLog()
    entity.hass = SimpleNamespace(
        data={DOMAIN: SimpleNamespace(advisor=advisor, operation_lock=asyncio.Lock())},
        auth=FakeAuth(),
        bus=SimpleNamespace(async_fire=lambda *args, **kwargs: None),
    )
    original = conversation.async_get_result_from_chat_log
    conversation.async_get_result_from_chat_log = lambda user_input, chat_log: chat_log
    try:
        asyncio.run(entity._async_handle_message(_input(user_id), log))
    finally:
        conversation.async_get_result_from_chat_log = original
    return log.content.content


advisor = RecordingAdvisor()

# A non-admin must never reach the advisor or its read-only context tools.
assert _run("regular-user", advisor) == NOT_AUTHORIZED

# An unattributed request (voice satellite, contextless service call) cannot be
# proven to come from an administrator, so it is refused the same way.
assert _run(None, advisor) == NOT_AUTHORIZED
assert _run("deleted-user", advisor) == NOT_AUTHORIZED
assert advisor.calls == [], "an unauthorized request reached the advisor"

# An admin is served, on a namespaced thread that cannot address a panel thread.
assert _run("admin-user", advisor) == "advisor answered"
assert len(advisor.calls) == 1
admin_thread = advisor.calls[0]
assert admin_thread.startswith("assist:admin-user:"), admin_thread
assert admin_thread != "shared-conversation"
assert len(admin_thread) <= 80

# The same conversation id under a different account resolves to a different
# thread, so Assist history cannot leak between users.
other_thread = HaosAIConversationEntity._thread_id(
    _input("other-admin"), FakeChatLog()
)
assert other_thread != admin_thread
assert other_thread.startswith("assist:other-admin:")

# The thread id stays stable across turns of the same conversation.
assert (
    HaosAIConversationEntity._thread_id(_input("admin-user"), FakeChatLog())
    == admin_thread
)

print("Conversation entity smoke test OK")
