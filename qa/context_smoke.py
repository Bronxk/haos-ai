"""Exercise the live context engine in a Home Assistant runtime image."""

import asyncio
import sys
from unittest.mock import patch

from homeassistant.config_entries import ConfigEntries
from homeassistant.core import HomeAssistant
from homeassistant.helpers import (
    area_registry as ar,
)
from homeassistant.helpers import (
    device_registry as dr,
)
from homeassistant.helpers import (
    entity_registry as er,
)
from homeassistant.helpers import (
    floor_registry as fr,
)
from homeassistant.helpers import (
    label_registry as lr,
)

sys.path.insert(0, "/workspace")

from custom_components.haos_ai.context import ContextEngine  # noqa: E402


async def main() -> None:
    hass = HomeAssistant("/tmp/haos-ai-context")
    hass.config_entries = ConfigEntries(hass, {})
    await hass.config_entries.async_initialize()
    await ar.async_load(hass)
    dr.async_setup(hass)
    await dr.async_load(hass)
    await er.async_load(hass)
    await fr.async_load(hass)
    await lr.async_load(hass)
    hass.states.async_set(
        "light.kitchen",
        "off",
        {"friendly_name": "Kitchen", "latitude": 51.0, "api_key": "secret"},
    )
    for index in range(101):
        hass.states.async_set(f"sensor.unavailable_{index}", "unavailable")
    before_states = {
        state.entity_id: (state.state, dict(state.attributes))
        for state in hass.states.async_all()
    }
    before_entity_count = len(er.async_get(hass).entities)
    before_device_count = len(dr.async_get(hass).devices)
    engine = ContextEngine(hass)
    preview = await engine.async_baseline_preview()
    assert preview["payload"]["home_summary"]["counts"]["states"] == 102
    candidates = preview["payload"]["local_candidates"]
    assert candidates["counts"]["unavailable"] == 101
    assert len(candidates["unavailable_entities"]) == 100
    with patch(
        "homeassistant.components.hassio.get_apps_list",
        return_value=[{"name": "Terminal", "slug": "terminal"}],
    ):
        apps = await engine.async_apps()
    assert apps["available"] is True
    assert apps["apps"][0]["slug"] == "terminal"
    detail = await engine.async_execute_tool(
        "get_entity_detail", {"entity_id": "light.kitchen"}, {}
    )
    assert detail["data"]["attributes"]["latitude"] == "[REDACTED]"
    assert detail["data"]["attributes"]["api_key"] == "[REDACTED]"
    after_states = {
        state.entity_id: (state.state, dict(state.attributes))
        for state in hass.states.async_all()
    }
    assert after_states == before_states
    assert len(er.async_get(hass).entities) == before_entity_count
    assert len(dr.async_get(hass).devices) == before_device_count
    await hass.async_stop(force=True)
    print("Context smoke test OK")


asyncio.run(main())
