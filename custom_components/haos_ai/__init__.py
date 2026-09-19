"""HAOS AI setup."""

from __future__ import annotations

import logging
from datetime import time
from pathlib import Path
from typing import Any

from homeassistant.components import frontend, persistent_notification
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.event import async_track_time_change

from .advisor import Advisor
from .const import (
    CONF_BASE_URL,
    CONF_HISTORY_DAYS,
    CONF_INCLUDE_EXACT_LOCATION,
    CONF_MODEL,
    CONF_NOTIFY_NEW_SUGGESTIONS,
    CONF_PROVIDER,
    CONF_SCAN_API_KEY,
    CONF_SCAN_BASE_URL,
    CONF_SCAN_MODEL,
    CONF_SCAN_PROFILE_ENABLED,
    CONF_SCAN_PROVIDER,
    CONF_SCHEDULE,
    CONF_SCHEDULE_TIME,
    CONF_SCHEDULE_WEEKDAY,
    DEFAULT_HISTORY_DAYS,
    DEFAULT_NOTIFY_NEW_SUGGESTIONS,
    DEFAULT_SCHEDULE,
    DEFAULT_SCHEDULE_TIME,
    DEFAULT_SCHEDULE_WEEKDAY,
    DOMAIN,
    PANEL_ASSET_URL,
    PANEL_COMPONENT,
    PANEL_MODULE_URL,
    PANEL_URL,
    SCHEDULE_DAILY,
    SCHEDULE_WEEKLY,
)
from .context import ContextEngine
from .providers import create_provider
from .runtime import HaosAIRuntime
from .storage import AdvisorStore
from .websocket_api import async_register as async_register_websocket

_LOGGER = logging.getLogger(__name__)
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
PLATFORMS = (Platform.CONVERSATION,)


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Register integration-wide UI and APIs."""
    frontend_dir = Path(__file__).parent / "frontend"
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                PANEL_ASSET_URL, str(frontend_dir / "haos-ai-panel.js"), False
            )
        ]
    )
    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title="HAOS AI",
        sidebar_icon="mdi:creation-outline",
        frontend_url_path=PANEL_URL,
        config={
            "_panel_custom": {
                "name": PANEL_COMPONENT,
                "module_url": PANEL_MODULE_URL,
                "embed_iframe": False,
                # The frontend reads `trust_external`; `trust_external_script`
                # is only the YAML key accepted by panel_custom and is ignored
                # here. Keep this in sync with panel_custom.async_register_panel.
                "trust_external": False,
            }
        },
        require_admin=True,
    )
    async_register_websocket(hass)

    async def handle_scan(call: ServiceCall) -> None:
        runtime: HaosAIRuntime | None = hass.data.get(DOMAIN)
        if runtime is None or runtime.operation_lock.locked():
            return
        if call.context.user_id:
            user = await hass.auth.async_get_user(call.context.user_id)
            if user is None or not user.is_admin:
                _LOGGER.warning("Rejected HAOS AI scan requested by a non-admin")
                return

        async def progress(event: dict[str, Any]) -> None:
            hass.bus.async_fire(f"{DOMAIN}_progress", event)

        async with runtime.operation_lock:
            await runtime.advisor.async_scan(progress, confirm_context=True)

    hass.services.async_register(DOMAIN, "scan", handle_scan)
    return True


def _parse_time(value: str) -> time:
    try:
        hour, minute, second = (int(part) for part in value.split(":"))
        return time(hour=hour, minute=minute, second=second)
    except (TypeError, ValueError):
        return time(hour=3)


def _configure_schedule(hass: HomeAssistant, runtime: HaosAIRuntime) -> None:
    if runtime.unsubscribe_schedule:
        runtime.unsubscribe_schedule()
        runtime.unsubscribe_schedule = None
    schedule = runtime.entry.options.get(CONF_SCHEDULE, DEFAULT_SCHEDULE)
    if schedule not in (SCHEDULE_DAILY, SCHEDULE_WEEKLY):
        return
    scan_time = _parse_time(
        str(runtime.entry.options.get(CONF_SCHEDULE_TIME, DEFAULT_SCHEDULE_TIME))
    )

    async def scheduled_scan(now: Any) -> None:
        if schedule == SCHEDULE_WEEKLY and now.weekday() != int(
            runtime.entry.options.get(
                CONF_SCHEDULE_WEEKDAY, DEFAULT_SCHEDULE_WEEKDAY
            )
        ):
            return
        if runtime.operation_lock.locked():
            return

        async def progress(event: dict[str, Any]) -> None:
            hass.bus.async_fire(f"{DOMAIN}_progress", event)

        try:
            async with runtime.operation_lock:
                result = await runtime.advisor.async_scan(
                    progress, confirm_context=True
                )
            if (
                result["recommendations"]
                and runtime.entry.options.get(
                    CONF_NOTIFY_NEW_SUGGESTIONS,
                    DEFAULT_NOTIFY_NEW_SUGGESTIONS,
                )
            ):
                count = len(result["recommendations"])
                persistent_notification.async_create(
                    hass,
                    (
                        f"HAOS AI found {count} new "
                        f"suggestion{'s' if count != 1 else ''}. "
                        "[Open the suggestion inbox](/haos-ai)."
                    ),
                    title="HAOS AI scan complete",
                    notification_id=f"{DOMAIN}_new_suggestions",
                )
        except Exception:
            _LOGGER.exception("Scheduled HAOS AI scan failed")

    runtime.unsubscribe_schedule = async_track_time_change(
        hass,
        scheduled_scan,
        hour=scan_time.hour,
        minute=scan_time.minute,
        second=scan_time.second,
    )


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the configured provider."""
    store = AdvisorStore(hass)
    await store.async_load()
    options = entry.options
    context = ContextEngine(
        hass,
        history_days=int(options.get(CONF_HISTORY_DAYS, DEFAULT_HISTORY_DAYS)),
        include_exact_location=bool(options.get(CONF_INCLUDE_EXACT_LOCATION, False)),
    )
    session = async_get_clientsession(hass)
    provider = create_provider(
        str(entry.data[CONF_PROVIDER]),
        session,
        str(entry.data["api_key"]),
        str(entry.data[CONF_BASE_URL]),
        str(entry.data[CONF_MODEL]),
    )
    scan_provider = None
    scan_provider_name = None
    if entry.data.get(CONF_SCAN_PROFILE_ENABLED):
        try:
            scan_provider_name = str(entry.data[CONF_SCAN_PROVIDER])
            scan_provider = create_provider(
                scan_provider_name,
                session,
                str(entry.data[CONF_SCAN_API_KEY]),
                str(entry.data[CONF_SCAN_BASE_URL]),
                str(entry.data[CONF_SCAN_MODEL]),
            )
        except (KeyError, ValueError):
            # A broken scan profile must not take the whole integration down;
            # scans fall back to the primary profile.
            _LOGGER.warning(
                "Ignoring an invalid HAOS AI scan profile; using the main provider"
            )
            scan_provider = None
            scan_provider_name = None
    advisor = Advisor(
        hass,
        provider,
        store,
        context,
        str(entry.data[CONF_PROVIDER]),
        scan_provider=scan_provider,
        scan_provider_name=scan_provider_name,
    )
    runtime = HaosAIRuntime(
        entry=entry,
        advisor=advisor,
        store=store,
    )
    hass.data[DOMAIN] = runtime
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    _configure_schedule(hass, runtime)
    entry.async_on_unload(entry.add_update_listener(_async_reload_entry))
    return True


async def _async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload provider runtime."""
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    runtime: HaosAIRuntime | None = hass.data.pop(DOMAIN, None)
    if runtime and runtime.unsubscribe_schedule:
        runtime.unsubscribe_schedule()
    return True
