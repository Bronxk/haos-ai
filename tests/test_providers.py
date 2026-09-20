"""Provider message conversion tests."""

import asyncio
from typing import Any

from custom_components.haos_ai.providers import create_provider
from custom_components.haos_ai.providers.anthropic import AnthropicClient
from custom_components.haos_ai.providers.base import (
    ProviderClient,
    ProviderError,
    ProviderResponse,
    ToolCall,
    ToolSpec,
    normalize_base_url,
)
from custom_components.haos_ai.providers.openai import OpenAIClient
from custom_components.haos_ai.providers.openai_compatible import (
    OpenAICompatibleClient,
)

MESSAGES = [
    {"role": "system", "content": "Be precise."},
    {"role": "user", "content": "Inspect the home."},
    {
        "role": "assistant",
        "content": "",
        "reasoning_content": "I need current Home Assistant context.",
        "tool_calls": [
            {"id": "one", "name": "get_home_summary", "arguments": {}},
            {"id": "two", "name": "get_apps", "arguments": {}},
        ],
    },
    {
        "role": "tool",
        "tool_call_id": "one",
        "name": "get_home_summary",
        "content": {"data": {"entities": 10}},
    },
    {
        "role": "tool",
        "tool_call_id": "two",
        "name": "get_apps",
        "content": {"data": {"apps": []}},
    },
]


def test_openai_responses_input_has_function_outputs() -> None:
    converted = OpenAIClient._input(MESSAGES)
    assert any(item.get("type") == "function_call" for item in converted)
    assert sum(item.get("type") == "function_call_output" for item in converted) == 2


def test_anthropic_merges_parallel_tool_results() -> None:
    system, converted = AnthropicClient._serialize(MESSAGES)
    assert system == "Be precise."
    assert converted[-1]["role"] == "user"
    assert len(converted[-1]["content"]) == 2
    assert all(block["type"] == "tool_result" for block in converted[-1]["content"])


def test_openai_compatible_preserves_tool_call_ids() -> None:
    converted = OpenAICompatibleClient._serialize_messages(MESSAGES)
    assert converted[-1]["tool_call_id"] == "two"
    assert converted[2]["tool_calls"][0]["id"] == "one"
    assert converted[2]["reasoning_content"] == (
        "I need current Home Assistant context."
    )


class OpenAICompatibleResponseClient(OpenAICompatibleClient):
    """OpenAI-compatible client with a deterministic provider response."""

    def __init__(self) -> None:
        super().__init__(
            None,
            "test-key",
            "https://api.example.test",
            "test-model",
        )

    async def _post_json(
        self,
        path: str,
        payload: dict[str, Any],
        headers: dict[str, str],
        timeout: float,
    ) -> dict[str, Any]:
        return {
            "choices": [
                {
                    "message": {
                        "content": "",
                        "reasoning_content": "I should inspect the home summary.",
                        "tool_calls": [
                            {
                                "id": "reasoning-call",
                                "function": {
                                    "name": "get_home_summary",
                                    "arguments": "{}",
                                },
                            }
                        ],
                    }
                }
            ],
            "usage": {"prompt_tokens": 12, "completion_tokens": 8},
        }


def test_openai_compatible_retains_provider_reasoning_content() -> None:
    client = OpenAICompatibleResponseClient()
    response = asyncio.run(client.complete(MESSAGES[:2], [], timeout=1))

    assert response.raw_assistant is not None
    assert response.raw_assistant["reasoning_content"] == (
        "I should inspect the home summary."
    )
    next_turn = OpenAICompatibleClient._serialize_messages(
        [response.raw_assistant]
    )
    assert next_turn[0]["reasoning_content"] == (
        "I should inspect the home summary."
    )


class PayloadClient(OpenAICompatibleClient):
    """Capture the request payload for provider compatibility assertions."""

    def __init__(self, *, include_tool_choice: bool) -> None:
        super().__init__(
            None,
            "test-key",
            "https://api.example.test",
            "test-model",
            include_tool_choice=include_tool_choice,
        )
        self.payload: dict[str, Any] = {}

    async def _post_json(
        self,
        path: str,
        payload: dict[str, Any],
        headers: dict[str, str],
        timeout: float,
    ) -> dict[str, Any]:
        self.payload = payload
        return {"choices": [{"message": {"content": "final"}}]}


def test_deepseek_omits_unsupported_tool_choice() -> None:
    client = PayloadClient(include_tool_choice=False)
    tools = [ToolSpec("inspect", "Inspect context", {"type": "object"})]

    asyncio.run(client.complete(MESSAGES[:2], tools, timeout=1))

    assert client.payload["tools"]
    assert "tool_choice" not in client.payload


def test_provider_factory_only_omits_tool_choice_for_deepseek() -> None:
    deepseek = create_provider(
        "deepseek",
        None,  # type: ignore[arg-type]
        "test-key",
        "https://api.deepseek.com",
        "deepseek-v4-flash",
    )
    compatible = create_provider(
        "openai_compatible",
        None,  # type: ignore[arg-type]
        "test-key",
        "https://api.example.test",
        "test-model",
    )

    assert isinstance(deepseek, OpenAICompatibleClient)
    assert deepseek.include_tool_choice is False
    assert isinstance(compatible, OpenAICompatibleClient)
    assert compatible.include_tool_choice is True


class LoopClient(ProviderClient):
    """Deterministic provider used to exercise the bounded tool loop."""

    def __init__(self, calls_per_turn: int = 1) -> None:
        self.calls_per_turn = calls_per_turn
        self.tool_availability: list[bool] = []

    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[ToolSpec],
        *,
        timeout: float,
    ) -> ProviderResponse:
        self.tool_availability.append(bool(tools))
        if not tools:
            return ProviderResponse(content="final", usage={"output_tokens": 1})
        calls = [
            ToolCall(id=f"call-{index}", name="inspect", arguments={})
            for index in range(self.calls_per_turn)
        ]
        return ProviderResponse(
            tool_calls=calls,
            usage={"output_tokens": 1},
        )

    async def validate(self) -> None:
        """No-op validation for the deterministic provider."""


class TextualToolClient(LoopClient):
    """Provider that emits a tool request as ordinary text."""

    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[ToolSpec],
        *,
        timeout: float,
    ) -> ProviderResponse:
        self.tool_availability.append(bool(tools))
        if tools:
            return ProviderResponse(
                content="<｜｜DSML｜｜tool_calls><invoke name='invented_tool'>"
            )
        return ProviderResponse(content='{"recommendations":[]}')


def test_tool_loop_forces_final_response_at_exact_limit() -> None:
    client = LoopClient()
    executed: list[str] = []

    async def execute(name: str, arguments: dict[str, Any]) -> dict[str, Any]:
        executed.append(name)
        return {"ok": True}

    response = asyncio.run(
        client.run_tool_loop(
            [{"role": "user", "content": "inspect"}],
            [ToolSpec("inspect", "Inspect context", {"type": "object"})],
            execute,
            max_tool_calls=2,
            timeout=1,
        )
    )

    assert response.content == "final"
    assert response.usage == {"output_tokens": 3}
    assert executed == ["inspect", "inspect"]
    assert client.tool_availability == [True, True, False]


def test_tool_loop_finalizes_instead_of_executing_over_budget_batch() -> None:
    client = LoopClient(calls_per_turn=2)
    executed: list[str] = []

    async def execute(name: str, arguments: dict[str, Any]) -> dict[str, Any]:
        executed.append(name)
        return {"ok": True}

    response = asyncio.run(
        client.run_tool_loop(
            [{"role": "user", "content": "inspect"}],
            [ToolSpec("inspect", "Inspect context", {"type": "object"})],
            execute,
            max_tool_calls=1,
            timeout=1,
        )
    )

    assert response.content == "final"
    assert executed == []
    assert client.tool_availability == [True, False]


def test_tool_loop_finalizes_textual_dsml_tool_request() -> None:
    client = TextualToolClient()

    async def execute(name: str, arguments: dict[str, Any]) -> dict[str, Any]:
        raise AssertionError("Textual tool markup must not be executed")

    response = asyncio.run(
        client.run_tool_loop(
            [{"role": "user", "content": "inspect"}],
            [ToolSpec("inspect", "Inspect context", {"type": "object"})],
            execute,
            max_tool_calls=12,
            timeout=1,
        )
    )

    assert response.content == '{"recommendations":[]}'
    assert client.tool_availability == [True, False]


def test_provider_base_url_normalization() -> None:
    assert normalize_base_url(" https://api.example.test/v1/ ") == (
        "https://api.example.test/v1"
    )
    assert normalize_base_url("http://192.168.1.20:11434/v1") == (
        "http://192.168.1.20:11434/v1"
    )
    assert normalize_base_url("http://ollama:11434/v1") == (
        "http://ollama:11434/v1"
    )


def test_provider_base_url_rejects_unsafe_or_complete_routes() -> None:
    invalid = (
        "http://api.example.test/v1",
        "https://user:secret@example.test/v1",
        "https://api.example.test/v1?token=secret",
        "https://api.example.test/v1/chat/completions",
        "ftp://api.example.test/v1",
    )
    for value in invalid:
        try:
            normalize_base_url(value)
        except ValueError:
            continue
        raise AssertionError(f"Expected invalid provider URL: {value}")


class ErrorResponse:
    """Minimal async response containing secret-bearing provider text."""

    status = 500

    async def __aenter__(self) -> ErrorResponse:
        return self

    async def __aexit__(self, *args: Any) -> None:
        return None

    async def text(self) -> str:
        return "upstream echoed api_key=provider-error-canary"


class ErrorSession:
    """Return the deterministic HTTP error response."""

    def post(self, *args: Any, **kwargs: Any) -> ErrorResponse:
        return ErrorResponse()


def test_provider_http_errors_do_not_echo_response_bodies() -> None:
    client = OpenAICompatibleClient(
        ErrorSession(),  # type: ignore[arg-type]
        "test-key",
        "https://api.example.test",
        "test-model",
    )

    try:
        asyncio.run(client._post_json("/v1/test", {}, {}, 1))
    except ProviderError as err:
        assert str(err) == "Provider returned HTTP 500"
        assert "provider-error-canary" not in str(err)
    else:
        raise AssertionError("Expected provider HTTP failure")
