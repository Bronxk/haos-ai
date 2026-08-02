"""OpenAI-compatible Chat Completions adapter."""

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


class OpenAICompatibleClient(ProviderClient):
    """Adapter for DeepSeek and OpenAI-compatible APIs."""

    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    @staticmethod
    def _serialize_messages(messages: list[dict[str, Any]]) -> list[dict[str, Any]]:
        serialized: list[dict[str, Any]] = []
        for message in messages:
            role = message["role"]
            if role == "tool":
                serialized.append(
                    {
                        "role": "tool",
                        "tool_call_id": message["tool_call_id"],
                        "content": json.dumps(
                            message["content"], separators=(",", ":")
                        ),
                    }
                )
                continue
            item: dict[str, Any] = {
                "role": role,
                "content": message.get("content") or "",
            }
            if calls := message.get("tool_calls"):
                item["tool_calls"] = [
                    {
                        "id": call["id"],
                        "type": "function",
                        "function": {
                            "name": call["name"],
                            "arguments": json.dumps(call["arguments"]),
                        },
                    }
                    for call in calls
                ]
            serialized.append(item)
        return serialized

    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[ToolSpec],
        *,
        timeout: float,
    ) -> ProviderResponse:
        payload: dict[str, Any] = {
            "model": self.model,
            "messages": self._serialize_messages(messages),
            "temperature": 0.2,
        }
        if tools:
            payload["tools"] = [
                {
                    "type": "function",
                    "function": {
                        "name": tool.name,
                        "description": tool.description,
                        "parameters": tool.parameters,
                    },
                }
                for tool in tools
            ]
            payload["tool_choice"] = "auto"
        data = await self._post_json(
            "/chat/completions", payload, self._headers(), timeout
        )
        try:
            message = data["choices"][0]["message"]
        except (KeyError, IndexError, TypeError) as err:
            raise ProviderResponseError("Missing chat completion message") from err

        calls: list[ToolCall] = []
        raw_calls: list[dict[str, Any]] = []
        for raw_call in message.get("tool_calls") or []:
            try:
                arguments = json.loads(raw_call["function"]["arguments"] or "{}")
                call = ToolCall(
                    id=str(raw_call["id"]),
                    name=str(raw_call["function"]["name"]),
                    arguments=arguments,
                )
            except (KeyError, TypeError, json.JSONDecodeError) as err:
                raise ProviderResponseError("Invalid provider tool call") from err
            calls.append(call)
            raw_calls.append(
                {"id": call.id, "name": call.name, "arguments": call.arguments}
            )

        usage = data.get("usage") or {}
        return ProviderResponse(
            content=str(message.get("content") or ""),
            tool_calls=calls,
            usage={
                "input_tokens": int(usage.get("prompt_tokens", 0)),
                "output_tokens": int(usage.get("completion_tokens", 0)),
            },
            raw_assistant={
                "role": "assistant",
                "content": message.get("content") or "",
                "tool_calls": raw_calls,
            },
        )

    async def validate(self) -> None:
        """Use the models endpoint when available."""
        await self._post_json(
            "/chat/completions",
            {
                "model": self.model,
                "messages": [{"role": "user", "content": "Reply with OK."}],
                "max_tokens": 2,
                "temperature": 0,
            },
            self._headers(),
            15,
        )
