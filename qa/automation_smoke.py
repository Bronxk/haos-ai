"""Exercise native automation validation in Home Assistant."""

import asyncio
import sys
from pathlib import Path

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
    # Load real blueprint YAML through Home Assistant's native domain store.
    root = Path(hass.config.path("blueprints", "automation", "haos_ai_qa"))
    root.mkdir(parents=True, exist_ok=True)
    (root / "grouped.yaml").write_text("""blueprint:
  name: Grouped native inputs
  domain: automation
  input:
    lighting:
      name: Lighting
      input:
        lamp:
          name: Lamp
triggers: []
actions:
  - action: light.turn_on
    target:
      entity_id: !input lamp
""", encoding="utf-8")
    (root / "null.yaml").write_text("""blueprint:
  name: Null required input
  domain: automation
  input:
    lamp:
triggers: []
actions: []
""", encoding="utf-8")
    grouped = {"use_blueprint": {
        "path": "haos_ai_qa/grouped.yaml", "input": {"lamp": "light.hall"}
    }}
    result = await async_validate_automation(hass, grouped)
    assert result.valid, result.errors
    bad_mode = await async_validate_automation(hass, {**grouped, "mode": "bogus"})
    assert not bad_mode.valid, bad_mode
    missing_null = await async_validate_automation(hass, {
        "use_blueprint": {"path": "haos_ai_qa/null.yaml", "input": {}}
    })
    assert not missing_null.valid, missing_null
    assert "lamp" in str(missing_null.errors), missing_null.errors
    supplied_null = await async_validate_automation(hass, {"use_blueprint": {
        "path": "haos_ai_qa/null.yaml", "input": {"lamp": "light.hall"}
    }})
    assert supplied_null.valid, supplied_null.errors

    from custom_components.haos_ai.context import ContextEngine
    discovery = await ContextEngine(hass).async_blueprints()
    rows = {row["path"]: row for row in discovery["blueprints"]}
    expected_inputs = [{"name": "lamp", "description": "", "required": True}]
    assert rows["haos_ai_qa/grouped.yaml"]["inputs"] == expected_inputs
    assert rows["haos_ai_qa/null.yaml"]["inputs"] == expected_inputs
    await hass.async_stop(force=True)
    print("Automation validation smoke test OK")


asyncio.run(main())
