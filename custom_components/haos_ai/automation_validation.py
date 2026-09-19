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
    errors: dict[str, str] = {}
    reference = config.get("use_blueprint")
    if not isinstance(reference, dict):
        return ValidationResult(
            valid=False, errors={"use_blueprint": "use_blueprint must be a mapping"}
        )
    path = str(reference.get("path", "")).strip()
    if not path:
        return ValidationResult(
            valid=False, errors={"use_blueprint": "use_blueprint needs a path"}
        )
    supplied = reference.get("input") or {}
    if not isinstance(supplied, dict):
        return ValidationResult(
            valid=False, errors={"input": "Blueprint input must be a mapping"}
        )
    try:
        from homeassistant.components.blueprint import DOMAIN as BLUEPRINT_DOMAIN

        store = (hass.data.get(BLUEPRINT_DOMAIN) or {}).get("automation")
        if store is None:
            return ValidationResult(
                valid=False,
                errors={"use_blueprint": "Automation blueprints are unavailable"},
            )
        blueprint = await store.async_get_blueprint(path)
    except Exception as err:
        return ValidationResult(
            valid=False,
            errors={"use_blueprint": f"Unknown blueprint {path}: {err}"},
        )

    metadata = getattr(blueprint, "metadata", None) or {}
    declared = metadata.get("input") or {}
    if isinstance(declared, dict):
        missing = [
            name
            for name, spec in declared.items()
            if isinstance(spec, dict)
            and "default" not in spec
            and name not in supplied
        ]
        unknown = [name for name in supplied if name not in declared]
        if missing:
            errors["input"] = f"Missing required blueprint input: {', '.join(missing)}"
        if unknown:
            errors.setdefault(
                "input", f"Unknown blueprint input: {', '.join(unknown)}"
            )
    return ValidationResult(valid=not errors, errors=errors)


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
