"""Start HAOS AI from a clean custom-components installation."""

from __future__ import annotations

import asyncio

from homeassistant import bootstrap, loader
from homeassistant.core import HomeAssistant


async def main() -> None:
    """Load the integration from /config without configuring a provider."""
    hass = HomeAssistant("/config")
    loader.async_setup(hass)
    initialized = await bootstrap.async_from_config_dict(
        {"haos_ai": {}}, hass
    )

    assert initialized is hass
    assert hass.services.has_service("haos_ai", "scan")
    assert "haos_ai" in hass.config.components

    await hass.async_stop(force=True)
    print("Clean installation smoke test OK")


asyncio.run(main())
