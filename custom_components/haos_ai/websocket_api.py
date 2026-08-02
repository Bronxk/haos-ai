"""Admin-only WebSocket API for the HAOS AI panel."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant import loader
from homeassistant.components import websocket_api
from homeassistant.const import CONF_API_KEY
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .automation_validation import async_validate_automation, export_yaml
from .const import (
    CONF_BASE_URL,
    CONF_HISTORY_DAYS,
    CONF_INCLUDE_EXACT_LOCATION,
    CONF_MODEL,
    CONF_NOTIFY_NEW_SUGGESTIONS,
    CONF_PROVIDER,
    CONF_SCHEDULE,
    CONF_SCHEDULE_TIME,
    CONF_SCHEDULE_WEEKDAY,
    DEFAULT_ENDPOINTS,
    DEFAULT_HISTORY_DAYS,
    DEFAULT_MODELS,
    DEFAULT_NOTIFY_NEW_SUGGESTIONS,
    DEFAULT_SCHEDULE,
    DEFAULT_SCHEDULE_TIME,
    DEFAULT_SCHEDULE_WEEKDAY,
    DOMAIN,
    GOAL_PRESETS,
    INTEGRATION_VERSION,
    PROVIDER_LABELS,
    PROVIDERS,
    SCHEDULES,
)
from .models import RecommendationStatus
from .providers import create_provider
from .providers.base import ProviderAuthError, ProviderError, normalize_base_url
from .runtime import HaosAIRuntime
from .storage import normalize_preferences


def _runtime(hass: HomeAssistant) -> HaosAIRuntime:
    runtime = hass.data.get(DOMAIN)
    if not isinstance(runtime, HaosAIRuntime):
        raise RuntimeError("HAOS AI is not configured")
    return runtime


def _fail(connection: Any, msg_id: int, err: Exception) -> None:
    code = "provider_error" if isinstance(err, ProviderError) else "unknown_error"
    connection.send_error(msg_id, code, str(err))


def _validated_options(incoming: dict[str, Any]) -> dict[str, Any]:
    """Validate and normalize integration options shared by panel flows."""
    history_days = int(incoming.get(CONF_HISTORY_DAYS, DEFAULT_HISTORY_DAYS))
    weekday = int(
        incoming.get(CONF_SCHEDULE_WEEKDAY, DEFAULT_SCHEDULE_WEEKDAY)
    )
    schedule = str(incoming.get(CONF_SCHEDULE, DEFAULT_SCHEDULE))
    schedule_time = str(
        incoming.get(CONF_SCHEDULE_TIME, DEFAULT_SCHEDULE_TIME)
    )
    if not 1 <= history_days <= 90:
        raise ValueError("History window must be between 1 and 90 days")
    if not 0 <= weekday <= 6:
        raise ValueError("Weekly scan day is invalid")
    if schedule not in SCHEDULES:
        raise ValueError("Scan schedule is invalid")
    try:
        time_parts = [int(part) for part in schedule_time.split(":")]
        if len(time_parts) == 2:
            time_parts.append(0)
        if len(time_parts) != 3:
            raise ValueError
        hour, minute, second = time_parts
    except ValueError as err:
        raise ValueError("Scan time must use HH:MM or HH:MM:SS") from err
    if not (0 <= hour <= 23 and 0 <= minute <= 59 and 0 <= second <= 59):
        raise ValueError("Scan time is invalid")
    return {
        CONF_HISTORY_DAYS: history_days,
        CONF_INCLUDE_EXACT_LOCATION: bool(
            incoming.get(CONF_INCLUDE_EXACT_LOCATION, False)
        ),
        CONF_SCHEDULE: schedule,
        CONF_SCHEDULE_TIME: f"{hour:02d}:{minute:02d}:{second:02d}",
        CONF_SCHEDULE_WEEKDAY: weekday,
        CONF_NOTIFY_NEW_SUGGESTIONS: bool(
            incoming.get(
                CONF_NOTIFY_NEW_SUGGESTIONS,
                DEFAULT_NOTIFY_NEW_SUGGESTIONS,
            )
        ),
    }


@websocket_api.websocket_command({vol.Required("type"): "haos_ai/overview"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_overview(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Return panel bootstrap state without secrets."""
    runtime = _runtime(hass)
    entry = runtime.entry
    suggestions = runtime.store.list_suggestions()
    connection.send_result(
        msg["id"],
        {
            "version": INTEGRATION_VERSION,
            "provider": entry.data.get("provider"),
            "model": entry.data.get("model"),
            "base_url": entry.data.get("base_url"),
            "provider_options": [
                {
                    "id": provider,
                    "label": PROVIDER_LABELS[provider],
                    "default_model": DEFAULT_MODELS[provider],
                    "default_base_url": DEFAULT_ENDPOINTS.get(provider, ""),
                }
                for provider in PROVIDERS
            ],
            "goal_presets": [
                {"id": goal_id, "label": label}
                for goal_id, label in GOAL_PRESETS.items()
            ],
            "options": dict(entry.options),
            "suggestions": suggestions,
            "preferences": runtime.store.data["preferences"],
            "scan_runs": list(reversed(runtime.store.data["scan_runs"][-20:])),
            "threads": runtime.store.list_threads(),
            "counts": {
                "new": sum(item.get("status") == "new" for item in suggestions),
                "saved": sum(item.get("status") == "saved" for item in suggestions),
                "dismissed": sum(
                    item.get("status") == "dismissed" for item in suggestions
                ),
            },
        },
    )


@websocket_api.websocket_command({vol.Required("type"): "haos_ai/context_preview"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_context_preview(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Build a privacy preflight preview."""
    try:
        connection.send_result(
            msg["id"], await _runtime(hass).advisor.async_context_preview()
        )
    except Exception as err:
        _fail(connection, msg["id"], err)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/scan",
        vol.Required("confirm_context"): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_scan(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Run one scan; only one may execute at a time."""
    runtime = _runtime(hass)
    if runtime.operation_lock.locked():
        connection.send_error(
            msg["id"], "scan_in_progress", "A scan is already running"
        )
        return

    async def progress(event: dict[str, Any]) -> None:
        hass.bus.async_fire(f"{DOMAIN}_progress", event)

    try:
        async with runtime.operation_lock:
            result = await runtime.advisor.async_scan(
                progress, confirm_context=msg["confirm_context"]
            )
        connection.send_result(msg["id"], result)
    except Exception as err:
        _fail(connection, msg["id"], err)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/suggestion/update",
        vol.Required("suggestion_id"): str,
        vol.Required("status"): vol.In(
            [status.value for status in RecommendationStatus]
        ),
        vol.Optional("reason"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_suggestion_update(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Save, dismiss, or restore a suggestion."""
    runtime = _runtime(hass)
    item = runtime.store.update_suggestion(
        msg["suggestion_id"], msg["status"], msg.get("reason")
    )
    if item is None:
        connection.send_error(msg["id"], "not_found", "Suggestion not found")
        return
    if msg["status"] == "dismissed" and msg.get("reason"):
        runtime.store.record_dismissal_feedback(item, msg["reason"])
    await runtime.store.async_save()
    connection.send_result(msg["id"], item)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/suggestions/clear",
        vol.Optional("status"): vol.In(
            [status.value for status in RecommendationStatus]
        ),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_suggestions_clear(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Clear one suggestion view, or the entire local inbox."""
    runtime = _runtime(hass)
    removed = runtime.store.clear_suggestions(msg.get("status"))
    await runtime.store.async_save()
    connection.send_result(msg["id"], {"removed": removed})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/change/apply",
        vol.Required("suggestion_id"): str,
        vol.Required("confirm"): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_change_apply(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Revalidate and apply one explicitly approved registry operation."""
    runtime = _runtime(hass)
    if msg["confirm"] is not True:
        connection.send_error(
            msg["id"], "approval_required", "Explicit approval is required"
        )
        return
    suggestion = runtime.store.get_suggestion(msg["suggestion_id"])
    operation = suggestion.get("operation") if suggestion else None
    if not isinstance(operation, dict):
        connection.send_error(
            msg["id"], "not_found", "Approved operation not found"
        )
        return
    operation_type = str(operation.get("type", ""))
    target_id = str(operation.get("target_id", ""))
    permission_key = {
        "remove_entity": "remove_entities",
        "remove_device": "remove_devices",
    }.get(operation_type)
    permissions = runtime.store.data["preferences"].get(
        "change_permissions", {}
    )
    if not permission_key or not permissions.get(permission_key, False):
        connection.send_error(
            msg["id"], "permission_disabled", "This approval capability is disabled"
        )
        return

    try:
        if operation_type == "remove_entity":
            if hass.states.get(target_id):
                raise HomeAssistantError(
                    "Entity is active again; run a new scan before removing it"
                )
            registry = er.async_get(hass)
            if (entity_entry := registry.async_get(target_id)) is None:
                raise HomeAssistantError("Entity registry entry no longer exists")
            if entity_entry.disabled_by:
                raise HomeAssistantError(
                    "Entity is disabled, not orphaned; run a new scan"
                )
            registry.async_remove(target_id)
        else:
            device_registry = dr.async_get(hass)
            if (device := device_registry.async_get(target_id)) is None:
                raise HomeAssistantError("Device registry entry no longer exists")
            entity_registry = er.async_get(hass)
            device_entities = er.async_entries_for_device(
                entity_registry, target_id
            )
            if any(item.disabled_by for item in device_entities):
                raise HomeAssistantError(
                    "Device has disabled entities; run a new scan"
                )
            if any(hass.states.get(item.entity_id) for item in device_entities):
                raise HomeAssistantError(
                    "Device has active entities again; run a new scan before "
                    "removing it"
                )
            config_entry_id = str(operation.get("config_entry_id", ""))
            config_entry = hass.config_entries.async_get_entry(config_entry_id)
            if config_entry is None or not config_entry.supports_remove_device:
                raise HomeAssistantError(
                    "The owning integration no longer supports device removal"
                )
            config_entry_ids = set(
                getattr(device, "config_entries", ()) or ()
            )
            if not config_entry_ids and (
                current_entry_id := getattr(device, "config_entry_id", None)
            ):
                config_entry_ids.add(current_entry_id)
            if config_entry_id not in config_entry_ids:
                raise HomeAssistantError("Device ownership changed; run a new scan")
            integration = await loader.async_get_integration(
                hass, config_entry.domain
            )
            component = await integration.async_get_component()
            if not await component.async_remove_config_entry_device(
                hass, config_entry, device
            ):
                raise HomeAssistantError("The integration rejected device removal")
            if device_registry.async_get(target_id):
                device_registry.async_update_device(
                    target_id, remove_config_entry_id=config_entry_id
                )
        runtime.store.update_suggestion(msg["suggestion_id"], "saved")
        await runtime.store.async_save()
        connection.send_result(
            msg["id"], {"applied": True, "operation": operation_type}
        )
    except Exception as err:
        _fail(connection, msg["id"], err)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/chat",
        vol.Required("thread_id"): vol.All(str, vol.Length(min=1, max=80)),
        vol.Required("text"): vol.All(str, vol.Length(min=1, max=12000)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_chat(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Send one setup-aware chat turn."""

    async def progress(event: dict[str, Any]) -> None:
        hass.bus.async_fire(f"{DOMAIN}_progress", event)

    runtime = _runtime(hass)
    if runtime.operation_lock.locked():
        connection.send_error(
            msg["id"],
            "advisor_busy",
            "Another advisor request is already running",
        )
        return
    try:
        async with runtime.operation_lock:
            result = await runtime.advisor.async_chat(
                msg["thread_id"], msg["text"], progress
            )
        connection.send_result(msg["id"], result)
    except Exception as err:
        _fail(connection, msg["id"], err)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/chat/thread",
        vol.Required("thread_id"): vol.All(str, vol.Length(min=1, max=80)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_chat_thread(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Return one local chat thread."""
    connection.send_result(
        msg["id"], _runtime(hass).store.get_thread(msg["thread_id"])
    )


@websocket_api.websocket_command({vol.Required("type"): "haos_ai/chat/threads"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_chat_threads(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Return local chat thread summaries."""
    connection.send_result(msg["id"], _runtime(hass).store.list_threads())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/chat/thread/delete",
        vol.Required("thread_id"): vol.All(str, vol.Length(min=1, max=80)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_chat_thread_delete(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Delete one local chat thread."""
    runtime = _runtime(hass)
    deleted = runtime.store.delete_thread(msg["thread_id"])
    if deleted:
        await runtime.store.async_save()
    connection.send_result(msg["id"], {"deleted": deleted})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/chat/thread/rename",
        vol.Required("thread_id"): vol.All(str, vol.Length(min=1, max=80)),
        vol.Required("title"): vol.All(str, vol.Length(min=1, max=60)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_chat_thread_rename(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Rename one local chat thread."""
    runtime = _runtime(hass)
    renamed = runtime.store.rename_thread(msg["thread_id"], msg["title"])
    if not renamed:
        connection.send_error(msg["id"], "not_found", "Chat thread not found")
        return
    await runtime.store.async_save()
    connection.send_result(msg["id"], {"renamed": True})


@websocket_api.websocket_command({vol.Required("type"): "haos_ai/activity"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_activity(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Return scan history and privacy receipt summaries."""
    runtime = _runtime(hass)
    connection.send_result(
        msg["id"],
        {
            "scan_runs": list(reversed(runtime.store.data["scan_runs"][-50:])),
            "receipts": runtime.store.list_receipt_summaries()[:100],
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/privacy_receipt",
        vol.Required("receipt_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_privacy_receipt(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Return one stored outbound-context receipt."""
    receipt = _runtime(hass).store.get_receipt(msg["receipt_id"])
    if receipt is None:
        connection.send_error(msg["id"], "not_found", "Privacy receipt not found")
        return
    connection.send_result(msg["id"], receipt)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/automation/validate",
        vol.Required("config"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_automation_validate(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Validate an edited automation without saving it."""
    result = await async_validate_automation(hass, msg["config"])
    connection.send_result(
        msg["id"],
        {
            "validation": result.to_dict()
            if hasattr(result, "to_dict")
            else {
                "valid": result.valid,
                "errors": result.errors,
            },
            "yaml": export_yaml(msg["config"]),
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/preferences/update",
        vol.Required("preferences"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_preferences_update(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Update bounded local advisor preferences."""
    runtime = _runtime(hass)
    preferences = normalize_preferences(
        msg["preferences"],
        dismissal_feedback=runtime.store.data["preferences"].get(
            "dismissal_feedback", []
        ),
    )
    runtime.store.data["preferences"] = preferences
    await runtime.store.async_save()
    connection.send_result(msg["id"], preferences)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/config/update",
        vol.Required("connection"): dict,
        vol.Required("options"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_config_update(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Validate and update connection plus scan options without exposing secrets."""
    runtime = _runtime(hass)
    entry = runtime.entry
    incoming = msg["connection"]
    provider = str(incoming.get(CONF_PROVIDER, ""))
    if provider not in PROVIDERS:
        connection.send_error(msg["id"], "invalid_provider", "Unknown provider")
        return

    api_key = str(incoming.get(CONF_API_KEY, "")).strip()
    if not api_key:
        if provider != entry.data.get(CONF_PROVIDER):
            connection.send_error(
                msg["id"],
                "api_key_required",
                "Enter an API key when changing providers",
            )
            return
        api_key = str(entry.data[CONF_API_KEY])

    try:
        model = str(incoming.get(CONF_MODEL, "")).strip()
        if not model:
            raise ValueError("Enter a model")
        base_url = normalize_base_url(str(incoming.get(CONF_BASE_URL, "")))
        client = create_provider(
            provider,
            async_get_clientsession(hass),
            api_key,
            base_url,
            model,
        )
        await client.validate()
    except ProviderAuthError as err:
        connection.send_error(msg["id"], "invalid_auth", str(err))
        return
    except (ProviderError, ValueError) as err:
        connection.send_error(msg["id"], "cannot_connect", str(err))
        return

    try:
        options = _validated_options(msg["options"])
    except (TypeError, ValueError) as err:
        connection.send_error(msg["id"], "invalid_options", str(err))
        return

    data = {
        CONF_PROVIDER: provider,
        CONF_API_KEY: api_key,
        CONF_MODEL: model,
        CONF_BASE_URL: base_url,
    }
    connection.send_result(
        msg["id"],
        {
            "provider": provider,
            "model": model,
            "base_url": base_url,
            "options": options,
            "reloading": True,
        },
    )
    hass.config_entries.async_update_entry(
        entry,
        data=data,
        options=options,
        title=f"HAOS AI · {PROVIDER_LABELS[provider]}",
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "haos_ai/options/update",
        vol.Required("options"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_options_update(
    hass: HomeAssistant, connection: Any, msg: dict[str, Any]
) -> None:
    """Update privacy and schedule options without contacting the provider."""
    runtime = _runtime(hass)
    try:
        options = _validated_options(msg["options"])
    except (TypeError, ValueError) as err:
        connection.send_error(msg["id"], "invalid_options", str(err))
        return
    connection.send_result(msg["id"], {"options": options, "reloading": True})
    hass.config_entries.async_update_entry(runtime.entry, options=options)


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register all HAOS AI WebSocket commands."""
    for command in (
        ws_overview,
        ws_context_preview,
        ws_scan,
        ws_suggestion_update,
        ws_suggestions_clear,
        ws_change_apply,
        ws_chat,
        ws_chat_thread,
        ws_chat_threads,
        ws_chat_thread_delete,
        ws_chat_thread_rename,
        ws_activity,
        ws_privacy_receipt,
        ws_automation_validate,
        ws_preferences_update,
        ws_config_update,
        ws_options_update,
    ):
        websocket_api.async_register_command(hass, command)
