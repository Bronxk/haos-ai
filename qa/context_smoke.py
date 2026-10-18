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
    address = "12 Example Street, Berlin"
    hass.states.async_set(
        "sensor.phone_geocoded_location",
        address,
        {
            "friendly_name": "Phone geocoded location",
            "name": "Example Street",
            "thoroughfare": "Example Street",
            "postal_code": "10115",
            "locality": "Berlin",
        },
    )
    hass.states.async_set("sensor.temperature", "21.5", {"unit_of_measurement": "C"})
    hass.states.async_set("sensor.living_room_mood", "cozy", {})
    hass.states.async_set("zone.home", "0", {"friendly_name": "Home"})
    # Presence/enumeration/network states must stay readable.
    hass.states.async_set("sensor.wan_ip_address", "1.2.3.4", {})
    hass.states.async_set("binary_sensor.location_tracking", "on", {})
    hass.states.async_set("device_tracker.phone_location", "home", {})
    hass.states.async_set("sensor.washer_location", "Keller", {})
    hass.states.async_set("sensor.phone_geocoded_zone", "Home", {})
    # iOS Companion App style Title Case attributes.
    hass.states.async_set(
        "sensor.ios_place",
        "Example Street 12",
        {
            "Name": "Example Street 12",
            "Sub Thoroughfare": "12",
            "Postal Code": "10115",
            "ISO Country Code": "DE",
            "Areas Of Interest": "Cafe",
        },
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
    assert preview["payload"]["home_summary"]["counts"]["states"] == 112
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
    # Exact location OFF: the address state and address attributes are withheld
    # everywhere, and the redaction is reported. Ordinary sensors are untouched.
    geo = "sensor.phone_geocoded_location"
    found = await engine.async_execute_tool(
        "search_entities", {"query": "", "domain": "sensor", "area_id": None}, {}
    )
    rows = {row["entity_id"]: row for row in found["data"]["results"]}
    assert rows[geo]["state"] == "[REDACTED]"
    assert rows["sensor.temperature"]["state"] == "21.5"
    assert rows["sensor.living_room_mood"]["state"] == "cozy"
    assert f"{geo}.state" in found["privacy"]["redacted_fields"]
    assert "Example Street" not in str(found["data"])
    assert rows["sensor.wan_ip_address"]["state"] == "1.2.3.4"
    assert rows["sensor.washer_location"]["state"] == "Keller"
    assert rows["sensor.phone_geocoded_zone"]["state"] == "Home"
    ios = rows["sensor.ios_place"]
    assert ios["state"] == "[REDACTED]"
    for entity_id, expected in (
        ("binary_sensor.location_tracking", "on"),
        ("device_tracker.phone_location", "home"),
    ):
        plain = await engine.async_execute_tool(
            "get_entity_detail", {"entity_id": entity_id}, {}
        )
        assert plain["data"]["state"] == expected, entity_id
    ios_detail = await engine.async_execute_tool(
        "get_entity_detail", {"entity_id": "sensor.ios_place"}, {}
    )
    for key in ("Name", "Sub Thoroughfare", "Postal Code", "ISO Country Code",
                "Areas Of Interest"):
        assert ios_detail["data"]["attributes"][key] == "[REDACTED]", key
    assert "Example Street" not in str(ios_detail["data"])
    probe = await engine.async_execute_tool(
        "search_entities", {"query": "berlin", "domain": None, "area_id": None}, {}
    )
    assert probe["data"]["results"] == []
    geo_detail = await engine.async_execute_tool(
        "get_entity_detail", {"entity_id": geo}, {}
    )
    assert geo_detail["data"]["state"] == "[REDACTED]"
    for key in ("thoroughfare", "postal_code", "locality", "name"):
        assert geo_detail["data"]["attributes"][key] == "[REDACTED]", key
    assert "Berlin" not in str(geo_detail["data"])
    temp_detail = await engine.async_execute_tool(
        "get_entity_detail", {"entity_id": "sensor.temperature"}, {}
    )
    assert temp_detail["data"]["state"] == "21.5"
    assert temp_detail["data"]["attributes"]["unit_of_measurement"] == "C"
    zone_detail = await engine.async_execute_tool(
        "get_entity_detail", {"entity_id": "zone.home"}, {}
    )
    assert zone_detail["data"]["attributes"]["friendly_name"] == "Home"
    # Exact location ON: everything is kept.
    open_engine = ContextEngine(hass, include_exact_location=True)
    open_detail = await open_engine.async_execute_tool(
        "get_entity_detail", {"entity_id": geo}, {}
    )
    assert open_detail["data"]["state"] == address
    assert open_detail["data"]["attributes"]["locality"] == "Berlin"
    open_found = await open_engine.async_execute_tool(
        "search_entities", {"query": "berlin", "domain": None, "area_id": None}, {}
    )
    assert [r["entity_id"] for r in open_found["data"]["results"]] == [geo]
    # History summaries redact the address state too (recorder is not running,
    # so exercise the shared filter with State-like rows directly).
    from types import SimpleNamespace

    from custom_components.haos_ai.history import summarize_states

    summary = summarize_states(
        [SimpleNamespace(state=address), SimpleNamespace(state="unavailable")],
        state_filter=lambda value: engine._redact_location_state(
            geo, hass.states.get(geo).attributes, value
        ),
    )
    assert summary["state_counts"] == {"[REDACTED]": 1, "unavailable": 1}
    assert "Example" not in str(summary)
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
