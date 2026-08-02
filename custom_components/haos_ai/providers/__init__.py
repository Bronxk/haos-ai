"""Direct provider factory."""

from __future__ import annotations

import aiohttp

from ..const import (
    PROVIDER_ANTHROPIC,
    PROVIDER_DEEPSEEK,
    PROVIDER_OPENAI,
    PROVIDER_OPENAI_COMPATIBLE,
)
from .anthropic import AnthropicClient
from .base import ProviderClient
from .openai import OpenAIClient
from .openai_compatible import OpenAICompatibleClient


def create_provider(
    provider: str,
    session: aiohttp.ClientSession,
    api_key: str,
    base_url: str,
    model: str,
) -> ProviderClient:
    """Create the configured direct provider client."""
    if provider == PROVIDER_OPENAI:
        return OpenAIClient(session, api_key, base_url, model)
    if provider == PROVIDER_ANTHROPIC:
        return AnthropicClient(session, api_key, base_url, model)
    if provider in (PROVIDER_DEEPSEEK, PROVIDER_OPENAI_COMPATIBLE):
        return OpenAICompatibleClient(
            session,
            api_key,
            base_url,
            model,
            include_tool_choice=provider != PROVIDER_DEEPSEEK,
        )
    raise ValueError(f"Unsupported provider: {provider}")


__all__ = ["ProviderClient", "create_provider"]
