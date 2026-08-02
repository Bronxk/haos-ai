"""Exercise native automation validation in Home Assistant."""

import asyncio
import sys

from homeassistant import loader
from homeassistant.config_entries import ConfigEntries
from homeassistant.core import HomeAssistant
from homeassistant.helpers import condition, trigger
from homeassistant.setup import async_setup_component

sys.path.insert(0, "/workspace")

from custom_components.haos_ai.automation_validation import (  # noqa: E402
    async_validate_automation,
)


async def main() -> None:
    hass = HomeAssistant("/tmp/haos-ai-automation")
    loader.async_setup(hass)
    hass.config_entries = ConfigEntries(hass, {})
    await hass.config_entries.async_initialize()
    await trigger.async_setup(hass)
    await condition.async_setup(hass)
    assert await async_setup_component(hass, "homeassistant", {})
    assert await async_setup_component(hass, "automation", {})
    config = {
            "alias": "Hall light",
            "triggers": [
                {
                    "trigger": "state",
                    "entity_id": "binary_sensor.front_door",
                    "to": "on",
                }
            ],
            "conditions": [],
            "actions": [
                {
                    "action": "light.turn_on",
                    "target": {"entity_id": "light.hall"},
                }
            ],
            "mode": "single",
        }
    valid = await async_validate_automation(hass, config)
    assert valid.valid, valid.errors
    invalid = await async_validate_automation(
        hass, {"alias": "Broken", "triggers": [], "actions": "not-a-list"}
    )
    assert not invalid.valid
    await hass.async_stop(force=True)
    print("Automation validation smoke test OK")


asyncio.run(main())
