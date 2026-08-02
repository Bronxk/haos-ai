"""OpenAI Responses API adapter."""

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


class OpenAIClient(ProviderClient):
    """Official OpenAI Responses API adapter."""

    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    @staticmethod
    def _input(messages: list[dict[str, Any]]) -> list[dict[str, Any]]:
        output: list[dict[str, Any]] = []
        for message in messages:
            role = message["role"]
            if role == "tool":
                output.append(
                    {
                        "type": "function_call_output",
                        "call_id": message["tool_call_id"],
                        "output": json.dumps(message["content"], separators=(",", ":")),
                    }
                )
                continue
            if role == "assistant" and message.get("tool_calls"):
                if message.get("content"):
                    output.append(
                        {
                            "role": "assistant",
                            "content": message["content"],
                        }
                    )
                output.extend(
                    {
                        "type": "function_call",
                        "call_id": call["id"],
                        "name": call["name"],
                        "arguments": json.dumps(call["arguments"]),
                    }
                    for call in message["tool_calls"]
                )
                continue
            output.append({"role": role, "content": message.get("content", "")})
        return output

    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[ToolSpec],
        *,
        timeout: float,
    ) -> ProviderResponse:
        payload: dict[str, Any] = {
            "model": self.model,
            "input": self._input(messages),
            "store": False,
        }
        if tools:
            payload["tools"] = [
                {
                    "type": "function",
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": tool.parameters,
                    "strict": True,
                }
                for tool in tools
            ]
            payload["tool_choice"] = "auto"
        data = await self._post_json("/responses", payload, self._headers(), timeout)

        content_parts: list[str] = []
        calls: list[ToolCall] = []
        raw_calls: list[dict[str, Any]] = []
        for item in data.get("output") or []:
            if item.get("type") == "function_call":
                try:
                    call = ToolCall(
                        id=str(item.get("call_id") or item["id"]),
                        name=str(item["name"]),
                        arguments=json.loads(item.get("arguments") or "{}"),
                    )
                except (KeyError, TypeError, json.JSONDecodeError) as err:
                    raise ProviderResponseError("Invalid OpenAI tool call") from err
                calls.append(call)
                raw_calls.append(
                    {"id": call.id, "name": call.name, "arguments": call.arguments}
                )
            elif item.get("type") == "message":
                for part in item.get("content") or []:
                    if part.get("type") in ("output_text", "text"):
                        content_parts.append(str(part.get("text", "")))
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
            "/responses",
            {
                "model": self.model,
                "input": "Reply with OK.",
                "max_output_tokens": 8,
                "store": False,
            },
            self._headers(),
            15,
        )

