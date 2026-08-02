"""Anthropic Messages API adapter."""

from __future__ import annotations

import json
from typing import Any

from .base import (
    ProviderClient,
    ProviderResponse,
    ProviderResponseError,
    ToolCall,
    ToolSpec,
)


class AnthropicClient(ProviderClient):
    """Official Anthropic Messages API adapter."""

    def _headers(self) -> dict[str, str]:
        return {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }

    @staticmethod
    def _serialize(messages: list[dict[str, Any]]) -> tuple[str, list[dict[str, Any]]]:
        system_parts: list[str] = []
        output: list[dict[str, Any]] = []

        def append_message(role: str, content: Any) -> None:
            """Merge adjacent blocks because Anthropic alternates roles."""
            if output and output[-1]["role"] == role:
                previous = output[-1]["content"]
                if not isinstance(previous, list):
                    previous = [{"type": "text", "text": str(previous)}]
                if not isinstance(content, list):
                    content = [{"type": "text", "text": str(content)}]
                output[-1]["content"] = [*previous, *content]
            else:
                output.append({"role": role, "content": content})

        for message in messages:
            role = message["role"]
            if role == "system":
                system_parts.append(str(message.get("content", "")))
                continue
            if role == "tool":
                append_message(
                    "user",
                    [
                        {
                            "type": "tool_result",
                            "tool_use_id": message["tool_call_id"],
                            "content": json.dumps(message["content"]),
                        }
                    ],
                )
                continue
            if role == "assistant" and message.get("tool_calls"):
                content: list[dict[str, Any]] = []
                if message.get("content"):
                    content.append({"type": "text", "text": message["content"]})
                content.extend(
                    {
                        "type": "tool_use",
                        "id": call["id"],
                        "name": call["name"],
                        "input": call["arguments"],
                    }
                    for call in message["tool_calls"]
                )
                append_message("assistant", content)
                continue
            append_message(role, message.get("content", ""))
        return "\n\n".join(system_parts), output

    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[ToolSpec],
        *,
        timeout: float,
    ) -> ProviderResponse:
        system, serialized = self._serialize(messages)
        payload: dict[str, Any] = {
            "model": self.model,
            "max_tokens": 4096,
            "messages": serialized,
        }
        if system:
            payload["system"] = system
        if tools:
            payload["tools"] = [
                {
                    "name": tool.name,
                    "description": tool.description,
                    "input_schema": tool.parameters,
                }
                for tool in tools
            ]
            payload["tool_choice"] = {"type": "auto"}
        data = await self._post_json("/v1/messages", payload, self._headers(), timeout)

        content_parts: list[str] = []
        calls: list[ToolCall] = []
        raw_calls: list[dict[str, Any]] = []
        for block in data.get("content") or []:
            if block.get("type") == "text":
                content_parts.append(str(block.get("text", "")))
            elif block.get("type") == "tool_use":
                try:
                    call = ToolCall(
                        id=str(block["id"]),
                        name=str(block["name"]),
                        arguments=dict(block.get("input") or {}),
                    )
                except (KeyError, TypeError) as err:
                    raise ProviderResponseError("Invalid Anthropic tool call") from err
                calls.append(call)
                raw_calls.append(
                    {"id": call.id, "name": call.name, "arguments": call.arguments}
                )
        usage = data.get("usage") or {}
        return ProviderResponse(
            content="".join(content_parts),
            tool_calls=calls,
            usage={
                "input_tokens": int(usage.get("input_tokens", 0)),
                "output_tokens": int(usage.get("output_tokens", 0)),
            },
            raw_assistant={
                "role": "assistant",
                "content": "".join(content_parts),
                "tool_calls": raw_calls,
            },
        )

    async def validate(self) -> None:
        await self._post_json(
            "/v1/messages",
            {
                "model": self.model,
                "max_tokens": 8,
                "messages": [{"role": "user", "content": "Reply with OK."}],
            },
            self._headers(),
            15,
        )
