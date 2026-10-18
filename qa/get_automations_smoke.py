"""Exercise the get_automations context tool in a Home Assistant runtime.

Regression guard: the tool applied its query filter literally, so a model that
asked for everything with a wildcard, an omitted argument, or JSON ``null``
received an empty list and reported a home with no automations.
"""

from __future__ import annotations

import asyncio
import os
import sys

from homeassistant import bootstrap, loader
from homeassistant.core import HomeAssistant

sys.path.insert(0, "/workspace")

from custom_components.haos_ai.context import ContextEngine  # noqa: E402

AUTOMATIONS = [
    {
        "id": "hall_light",
        "alias": "Hall light",
        "triggers": [
            {"trigger": "state", "entity_id": "binary_sensor.front_door", "to": "on"}
        ],
        "conditions": [],
        "actions": [
            {"action": "light.turn_on", "target": {"entity_id": "light.hall"}}
        ],
        "mode": "single",
    },
    {
        "id": "night_mode",
        "alias": "Night mode",
        "triggers": [{"trigger": "time", "at": "23:00:00"}],
        "conditions": [],
        "actions": [
            {"action": "light.turn_off", "target": {"entity_id": "light.hall"}}
        ],
        "mode": "single",
    },
]

# Every argument shape that means "list them all".
LIST_ALL_ARGUMENTS = (
    {},
    {"query": None},
    {"query": ""},
    {"query": "*"},
    {"query": "all"},
)


async def main() -> None:
    config_dir = "/tmp/haos-ai-automations"
    os.makedirs(config_dir, exist_ok=True)
    hass = HomeAssistant(config_dir)
    loader.async_setup(hass)
    initialized = await bootstrap.async_from_config_dict(
        {"automation": AUTOMATIONS}, hass
    )
    assert initialized is hass

    engine = ContextEngine(hass)

    for arguments in LIST_ALL_ARGUMENTS:
        result = await engine.async_execute_tool("get_automations", arguments, {})
        found = result["data"]["automations"]
        assert len(found) == 2, f"{arguments} returned {len(found)} automations"
        assert result["data"]["available"] is True
        assert sorted(row["name"] for row in found) == ["Hall light", "Night mode"]
        # The raw config has to survive sanitizing so a draft can be revised.
        assert "triggers" in found[0]["config"]

    filtered = await engine.async_execute_tool(
        "get_automations", {"query": "night"}, {}
    )
    assert [row["name"] for row in filtered["data"]["automations"]] == ["Night mode"]

    unmatched = await engine.async_execute_tool(
        "get_automations", {"query": "does-not-exist"}, {}
    )
    assert unmatched["data"]["automations"] == []

    await hass.async_stop(force=True)

    # Missing-reference detection must cover every automation, not only the
    # 50-row window sent to the model: here only the 55th is broken.
    many = [
        {
            "id": f"bulk_{index}",
            "alias": f"Bulk {index}",
            "triggers": [{"trigger": "time", "at": "23:00:00"}],
            "conditions": [],
            "actions": [
                {
                    "action": "light.turn_on",
                    "target": {
                        "entity_id": (
                            "light.ghost" if index == 55 else "light.bulk"
                        )
                    },
                }
            ],
            "mode": "single",
        }
        for index in range(1, 61)
    ]
    big_dir = "/tmp/haos-ai-automations-many"
    os.makedirs(big_dir, exist_ok=True)
    big = HomeAssistant(big_dir)
    loader.async_setup(big)
    assert await bootstrap.async_from_config_dict({"automation": many}, big) is big
    big.states.async_set("light.bulk", "off")
    big_engine = ContextEngine(big)
    listing = await big_engine.async_execute_tool("get_automations", {}, {})
    assert len(listing["data"]["automations"]) == 50
    assert listing["data"]["truncated"] is True
    candidates = big_engine.hygiene_candidates()
    missing = candidates["automation_missing_references"]
    assert [row["missing_entity"] for row in missing] == ["light.ghost"], missing
    assert candidates["counts"]["missing_references"] == 1
    assert len(big_engine.automation_ids()) == 60
    await big.async_stop(force=True)
    print("get_automations smoke test OK")


asyncio.run(main())
