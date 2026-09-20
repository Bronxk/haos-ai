"""Provider-neutral LLM contracts."""

from __future__ import annotations

import ipaddress
import json
import logging
from abc import ABC, abstractmethod
from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from typing import Any
from urllib.parse import urlsplit, urlunsplit

import aiohttp

ToolExecutor = Callable[[str, dict[str, Any]], Awaitable[dict[str, Any]]]

_LOGGER = logging.getLogger(__name__)
TEXTUAL_TOOL_MARKERS = (
    "<｜｜DSML｜｜tool_calls>",
    "<tool_call>",
    "<function_call>",
)
PROVIDER_ROUTE_SUFFIXES = (
    "/responses",
    "/messages",
    "/chat/completions",
)


def normalize_base_url(value: str) -> str:
    """Validate and normalize a provider API base URL."""
    candidate = value.strip().rstrip("/")
    parsed = urlsplit(candidate)
    if (
        parsed.scheme not in {"http", "https"}
        or not parsed.hostname
        or parsed.username is not None
        or parsed.password is not None
        or parsed.query
        or parsed.fragment
    ):
        raise ValueError("invalid_url")

    path = parsed.path.rstrip("/")
    if any(path.casefold().endswith(suffix) for suffix in PROVIDER_ROUTE_SUFFIXES):
        raise ValueError("invalid_url")

    if parsed.scheme == "http" and not _is_local_hostname(parsed.hostname):
        raise ValueError("invalid_url")

    normalized = urlunsplit(
        (parsed.scheme, parsed.netloc, path, "", "")
    )
    return normalized.rstrip("/")


def _is_local_hostname(hostname: str) -> bool:
    """Return whether an HTTP endpoint is limited to a local network."""
    host = hostname.rstrip(".").casefold()
    if host == "localhost" or host.endswith(".local") or "." not in host:
        return True
    try:
        address = ipaddress.ip_address(host)
    except ValueError:
        return False
    return address.is_private or address.is_loopback or address.is_link_local


def _contains_textual_tool_call(content: str) -> bool:
    """Detect provider tool syntax emitted as ordinary assistant text."""
    return any(marker in content for marker in TEXTUAL_TOOL_MARKERS)


class ProviderError(RuntimeError):
    """Base provider failure."""


class ProviderAuthError(ProviderError):
    """Provider credentials are invalid."""


class ProviderRateLimitError(ProviderError):
    """Provider rate limit was reached."""


class ProviderResponseError(ProviderError):
    """Provider response could not be understood."""


@dataclass(slots=True)
class ToolSpec:
    """A read-only context tool definition."""

    name: str
    description: str
    parameters: dict[str, Any]


@dataclass(slots=True)
class ToolCall:
    """A normalized model tool call."""

    id: str
    name: str
    arguments: dict[str, Any]


@dataclass(slots=True)
class ProviderResponse:
    """A normalized provider response."""

    content: str = ""
    tool_calls: list[ToolCall] = field(default_factory=list)
    usage: dict[str, int] = field(default_factory=dict)
    raw_assistant: dict[str, Any] | None = None


class ProviderClient(ABC):
    """Base client for direct provider adapters."""

    def __init__(
        self,
        session: aiohttp.ClientSession,
        api_key: str,
        base_url: str,
        model: str,
    ) -> None:
        self.session = session
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.model = model

    @abstractmethod
    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[ToolSpec],
        *,
        timeout: float,
    ) -> ProviderResponse:
        """Complete one turn."""

    @abstractmethod
    async def validate(self) -> None:
        """Validate provider credentials and endpoint."""

    async def run_tool_loop(
        self,
        messages: list[dict[str, Any]],
        tools: list[ToolSpec],
        execute_tool: ToolExecutor,
        *,
        max_tool_calls: int,
        timeout: float,
        usage_sink: dict[str, int] | None = None,
    ) -> ProviderResponse:
        """Run a bounded provider-neutral tool loop.

        ``usage_sink`` is updated in place as each provider call returns, so a
        caller can still account for tokens that were already spent when a
        later call in the loop fails.
        """
        history = list(messages)
        calls_used = 0
        total_usage: dict[str, int] = {} if usage_sink is None else usage_sink

        async def final_response() -> ProviderResponse:
            """Force a useful answer from the context collected so far."""
            final_history: list[dict[str, Any]] = []
            collected_context: list[dict[str, Any]] = []
            for message in history:
                role = message.get("role")
                if role == "tool":
                    collected_context.append(
                        {
                            "tool": message.get("name"),
                            "content": message.get("content"),
                        }
                    )
                    continue
                if message.get("tool_calls"):
                    if content := str(message.get("content") or "").strip():
                        final_history.append(
                            {"role": "assistant", "content": content}
                        )
                    continue
                final_history.append(message)
            final_history.append(
                {
                    "role": "user",
                    "content": (
                        "The read-only context phase is complete. Respond now using "
                        "only the original request and collected context below. Do "
                        "not request or describe more tools. Do not output DSML, XML, "
                        "function calls, tool calls, or tool markup. If evidence is "
                        "insufficient, say so or return fewer results.\n\n"
                        "Collected context:\n"
                        + json.dumps(
                            collected_context,
                            ensure_ascii=False,
                            separators=(",", ":"),
                        )
                    ),
                }
            )
            response = await self.complete(
                final_history,
                [],
                timeout=timeout,
            )
            for key, value in response.usage.items():
                total_usage[key] = total_usage.get(key, 0) + int(value)
            if (
                response.tool_calls
                or _contains_textual_tool_call(response.content)
                or not response.content.strip()
            ):
                raise ProviderResponseError(
                    "Model did not return a final response after the "
                    "context-tool limit"
                )
            response.usage = total_usage
            return response

        while True:
            if calls_used >= max_tool_calls:
                return await final_response()

            response = await self.complete(history, tools, timeout=timeout)
            for key, value in response.usage.items():
                total_usage[key] = total_usage.get(key, 0) + int(value)

            if not response.tool_calls:
                if _contains_textual_tool_call(response.content):
                    return await final_response()
                response.usage = total_usage
                return response

            if calls_used + len(response.tool_calls) > max_tool_calls:
                return await final_response()
            calls_used += len(response.tool_calls)
            history.append(
                response.raw_assistant
                or {
                    "role": "assistant",
                    "content": response.content,
                    "tool_calls": [
                        {
                            "id": call.id,
                            "name": call.name,
                            "arguments": call.arguments,
                        }
                        for call in response.tool_calls
                    ],
                }
            )
            for call in response.tool_calls:
                try:
                    result = await execute_tool(call.name, call.arguments)
                except Exception as err:
                    # One malformed tool argument must not abort an entire scan
                    # after tokens were already spent: hand the failure back to
                    # the model as a tool result instead.
                    _LOGGER.debug(
                        "Read-only context tool %s failed", call.name, exc_info=True
                    )
                    result = {
                        "error": "tool_failed",
                        "tool": call.name,
                        "detail": type(err).__name__,
                    }
                history.append(
                    {
                        "role": "tool",
                        "tool_call_id": call.id,
                        "name": call.name,
                        "content": result,
                    }
                )

    async def _post_json(
        self,
        path: str,
        payload: dict[str, Any],
        headers: dict[str, str],
        timeout: float,
    ) -> dict[str, Any]:
        """POST JSON and normalize common HTTP errors."""
        try:
            async with self.session.post(
                f"{self.base_url}{path}",
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=timeout),
            ) as response:
                if response.status in (401, 403):
                    raise ProviderAuthError("Provider rejected the API key")
                if response.status == 429:
                    raise ProviderRateLimitError("Provider rate limit reached")
                if response.status >= 400:
                    raise ProviderError(
                        f"Provider returned HTTP {response.status}"
                    )
                try:
                    value = await response.json()
                except (ValueError, aiohttp.ContentTypeError) as err:
                    raise ProviderResponseError(
                        "Provider returned a non-JSON response"
                    ) from err
                if not isinstance(value, dict):
                    raise ProviderResponseError("Provider returned an invalid response")
                return value
        except TimeoutError as err:
            raise ProviderError("Provider request timed out") from err
        except aiohttp.ClientError as err:
            raise ProviderError(f"Could not connect to provider: {err}") from err
