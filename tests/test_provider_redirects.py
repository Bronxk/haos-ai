"""Provider requests must never follow redirects."""

import asyncio
from typing import Any

import pytest

from custom_components.haos_ai.providers.anthropic import AnthropicClient
from custom_components.haos_ai.providers.base import ProviderError


class _Response:
    def __init__(self, status: int) -> None:
        self.status = status

    async def __aenter__(self) -> _Response:
        return self

    async def __aexit__(self, *exc: Any) -> None:
        return None

    async def json(self) -> dict[str, Any]:
        return {}


class _Session:
    def __init__(self, status: int) -> None:
        self.status = status
        self.kwargs: dict[str, Any] = {}

    def post(self, url: str, **kwargs: Any) -> _Response:
        self.kwargs = kwargs
        return _Response(self.status)


@pytest.mark.parametrize("status", [301, 302, 307, 308])
def test_redirect_is_refused(status: int) -> None:
    session = _Session(status)
    client = AnthropicClient(session, "secret", "https://api.example.test", "m")
    with pytest.raises(ProviderError, match="redirected"):
        asyncio.run(client._post_json("/v1/messages", {}, {"x-api-key": "secret"}, 5))
    assert session.kwargs["allow_redirects"] is False


def test_success_still_works_without_redirects() -> None:
    session = _Session(200)
    client = AnthropicClient(session, "secret", "https://api.example.test", "m")
    assert asyncio.run(client._post_json("/p", {}, {}, 5)) == {}
    assert session.kwargs["allow_redirects"] is False
