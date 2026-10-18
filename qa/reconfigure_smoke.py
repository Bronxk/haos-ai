"""Exercise the reconfigure flow handler without network access."""

import asyncio
import sys
from types import SimpleNamespace
from typing import Any
from unittest.mock import patch

sys.path.insert(0, "/workspace")

from custom_components.haos_ai import config_flow  # noqa: E402
from custom_components.haos_ai.const import (  # noqa: E402
    CONF_API_KEY,
    CONF_BASE_URL,
    CONF_MODEL,
    CONF_PROVIDER,
    CONF_SCAN_API_KEY,
    CONF_SCAN_BASE_URL,
    CONF_SCAN_MODEL,
    CONF_SCAN_PROFILE_ENABLED,
    CONF_SCAN_PROVIDER,
    DOMAIN,
    PROVIDERS,
)

MAIN = PROVIDERS[0]
OTHER = PROVIDERS[1]
SCAN = {
    CONF_SCAN_PROFILE_ENABLED: True,
    CONF_SCAN_PROVIDER: OTHER,
    CONF_SCAN_MODEL: "scan-model",
    CONF_SCAN_BASE_URL: "https://scan.example.test/v1",
    CONF_SCAN_API_KEY: "scan-secret",
}


def make_flow(entry_data: dict[str, Any]):
    """Build a flow handler bound to a fake entry; capture the update."""
    entry = SimpleNamespace(data=dict(entry_data))
    flow = config_flow.ConfigFlow()
    flow.hass = SimpleNamespace()
    flow.handler = DOMAIN
    flow.flow_id = "reconfigure-smoke"
    flow.context = {"source": "reconfigure"}
    flow._get_reconfigure_entry = lambda: entry  # type: ignore[method-assign]
    captured: dict[str, Any] = {}

    def fake_update(_entry: Any, **kwargs: Any) -> dict[str, Any]:
        captured.update(kwargs)
        return {"type": "abort", "reason": "reconfigure_successful"}

    flow.async_update_and_abort = fake_update  # type: ignore[method-assign]
    return flow, captured


def stored() -> dict[str, Any]:
    return {
        CONF_PROVIDER: MAIN,
        CONF_API_KEY: "main-secret",
        CONF_MODEL: "old-model",
        CONF_BASE_URL: "https://main.example.test/v1",
        **SCAN,
    }


async def main() -> None:
    """Drive async_step_reconfigure directly (no flow manager)."""
    validated: list[dict[str, Any]] = []

    async def fake_validate(_hass: Any, data: dict[str, Any]) -> None:
        validated.append(dict(data))

    with patch.object(config_flow, "_async_validate", fake_validate):
        # Same provider, empty key: stored key and scan profile survive.
        flow, captured = make_flow(stored())
        result = await flow.async_step_reconfigure(
            {
                CONF_PROVIDER: MAIN,
                CONF_API_KEY: "",
                CONF_MODEL: " new-model ",
                CONF_BASE_URL: "https://main.example.test/v1",
            }
        )
        assert result["type"] == "abort", result
        data = captured["data"]
        assert data[CONF_API_KEY] == "main-secret", data
        assert data[CONF_MODEL] == "new-model", data
        for key, value in SCAN.items():
            assert data.get(key) == value, (key, data)
        assert validated[-1][CONF_API_KEY] == "main-secret"

        # Same provider, new key: replaced, scan profile still untouched.
        flow, captured = make_flow(stored())
        await flow.async_step_reconfigure(
            {
                CONF_PROVIDER: MAIN,
                CONF_API_KEY: " fresh-key ",
                CONF_MODEL: "m",
                CONF_BASE_URL: "https://main.example.test/v1",
            }
        )
        data = captured["data"]
        assert data[CONF_API_KEY] == "fresh-key", data
        assert data[CONF_SCAN_API_KEY] == "scan-secret", data

        # Provider switch with an empty key: rejected, nothing written.
        count = len(validated)
        flow, captured = make_flow(stored())
        result = await flow.async_step_reconfigure(
            {
                CONF_PROVIDER: OTHER,
                CONF_API_KEY: "",
                CONF_MODEL: "m",
                CONF_BASE_URL: "https://other.example.test/v1",
            }
        )
        assert result["type"] == "form", result
        assert result["errors"] == {"base": "invalid_auth"}, result
        assert not captured and len(validated) == count

        # Provider switch with a new key: accepted, scan profile kept.
        flow, captured = make_flow(stored())
        await flow.async_step_reconfigure(
            {
                CONF_PROVIDER: OTHER,
                CONF_API_KEY: "other-key",
                CONF_MODEL: "m",
                CONF_BASE_URL: "https://other.example.test/v1",
            }
        )
        data = captured["data"]
        assert data[CONF_PROVIDER] == OTHER, data
        assert data[CONF_API_KEY] == "other-key", data
        assert data[CONF_SCAN_MODEL] == "scan-model", data

    print("Reconfigure smoke test OK")


asyncio.run(main())
