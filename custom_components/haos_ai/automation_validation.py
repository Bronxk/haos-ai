"""Read-only validation and YAML export for proposed automations."""

from __future__ import annotations

from typing import Any

import yaml

from .models import ValidationResult


def export_yaml(config: dict[str, Any]) -> str:
    """Export deterministic Home Assistant-friendly YAML."""
    return yaml.safe_dump(
        config,
        allow_unicode=True,
        default_flow_style=False,
        sort_keys=False,
    )


async def _async_validate_blueprint(
    hass: Any, config: dict[str, Any]
) -> ValidationResult:
    """Validate a blueprint-backed automation against the installed blueprint."""
    try:
        from homeassistant.components.blueprint import DOMAIN as BLUEPRINT_DOMAIN

        store = (hass.data.get(BLUEPRINT_DOMAIN) or {}).get("automation")
        if store is None:
            return ValidationResult(
                valid=False,
                errors={"use_blueprint": "Automation blueprints are unavailable"},
            )
        # Native processing validates instance fields and flattened inputs,
        # supplies defaults, and checks required inputs (including null specs).
        inputs = await store.async_inputs_from_config(config)
        expanded = inputs.async_substitute()
    except Exception as err:
        return ValidationResult(valid=False, errors={"use_blueprint": str(err)})
    # Substitution alone does not validate the generated automation or instance
    # overrides such as mode. Run the same full validation as a plain proposal.
    return await async_validate_automation(hass, expanded)


async def async_validate_automation(
    hass: Any, config: dict[str, Any]
) -> ValidationResult:
    """Validate without writing or registering an automation."""
    errors: dict[str, str] = {}
    if "use_blueprint" in config:
        return await _async_validate_blueprint(hass, config)
    try:
        from homeassistant.components.automation.config import PLATFORM_SCHEMA
        from homeassistant.helpers import script
        from homeassistant.helpers.condition import async_validate_conditions_config
        from homeassistant.helpers.trigger import async_validate_trigger_config

        normalized = dict(config)
        if "trigger" in normalized and "triggers" not in normalized:
            normalized["triggers"] = normalized.pop("trigger")
        if "condition" in normalized and "conditions" not in normalized:
            normalized["conditions"] = normalized.pop("condition")
        if "action" in normalized and "actions" not in normalized:
            normalized["actions"] = normalized.pop("action")

        validated = PLATFORM_SCHEMA(normalized)
        try:
            await async_validate_trigger_config(
                hass, validated["triggers"]
            )
        except Exception as err:  # HA validators expose multiple error types
            errors["triggers"] = str(err)
        try:
            await async_validate_conditions_config(
                hass, validated.get("conditions", [])
            )
        except Exception as err:
            errors["conditions"] = str(err)
        try:
            await script.async_validate_actions_config(
                hass, validated["actions"]
            )
        except Exception as err:
            errors["actions"] = str(err)
    except Exception as err:
        errors.setdefault("automation", str(err))
    return ValidationResult(valid=not errors, errors=errors)
