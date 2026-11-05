"""Backend read and write access to Home Assistant's UI automation file.

Home Assistant's own automation editor stores UI automations in
``automations.yaml``. HAOS AI writes through the same file and the same
reload service so an approved change is indistinguishable from one made in
the built-in editor, and so approval can be enforced on the server instead
of in the browser.
"""

from __future__ import annotations

import asyncio
import inspect
import logging
import os
from typing import Any

from homeassistant.const import CONF_ID, SERVICE_RELOAD
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util.file import write_utf8_file_atomic
from homeassistant.util.yaml import dump as yaml_dump
from homeassistant.util.yaml import load_yaml

from .const import AUTOMATION_CONFIG_FILE
from .storage import content_hash

_LOGGER = logging.getLogger(__name__)

AUTOMATION_DOMAIN = "automation"


def _config_path(hass: HomeAssistant) -> str:
    return hass.config.path(AUTOMATION_CONFIG_FILE)


def _read(path: str) -> list[dict[str, Any]]:
    """Read the automation list, tolerating a missing or empty file."""
    if not os.path.isfile(path):
        return []
    loaded = load_yaml(path)
    if not isinstance(loaded, list):
        return []
    return [item for item in loaded if isinstance(item, dict)]


def _write(path: str, data: list[dict[str, Any]]) -> None:
    """Serialize before touching the file so a dump error cannot truncate it."""
    contents = yaml_dump(data)
    write_utf8_file_atomic(path, contents)


async def async_read_automations(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Return every automation currently stored in the UI automation file."""
    return await hass.async_add_executor_job(_read, _config_path(hass))


async def async_get_automation(
    hass: HomeAssistant, automation_id: str
) -> dict[str, Any] | None:
    """Return one stored automation by its config id."""
    if not automation_id:
        return None
    for item in await async_read_automations(hass):
        if str(item.get(CONF_ID, "")) == automation_id:
            return item
    return None


async def _async_native_editor(hass: HomeAssistant) -> Any:
    """Resolve HA's registered automation editor, never invent a second lock.

    HA 2026.7+ registers bound views through request-handler closures. Inspect
    only the automation config route and fail closed if HA changes that shape.
    """
    from homeassistant.components.config.automation import EditAutomationConfigView

    for route in hass.http.app.router.routes():
        if route.resource.canonical != "/api/config/automation/config/{config_key}":
            continue
        handler = route.handler
        if not inspect.isfunction(handler):
            continue
        for cell in handler.__closure__ or ():
            view = cell.cell_contents
            if isinstance(view, EditAutomationConfigView) and isinstance(
                view.mutation_lock, asyncio.Lock
            ):
                return view
    raise HomeAssistantError(
        "Cannot coordinate with Home Assistant's automation editor; no changes written"
    )


async def async_save_automation(
    hass: HomeAssistant,
    automation_id: str,
    config: dict[str, Any],
    *,
    expected_config_hash: str | None = None,
    require_existing: bool = False,
) -> tuple[bool, bool]:
    """Write under HA's native editor lock and compare the reviewed config.

    Returns ``(replaced, reload_failed)``; a reload failure never hides an
    already committed write or allows duplicate approvals.
    """
    editor = await _async_native_editor(hass)
    path = _config_path(hass)
    async with editor.mutation_lock:
        current = await hass.async_add_executor_job(_read, path)
        previous = next(
            (item for item in current if str(item.get(CONF_ID, "")) == automation_id),
            None,
        )
        if require_existing:
            if previous is None:
                raise HomeAssistantError(
                    "The target automation no longer exists; run a new scan"
                )
            if (
                not expected_config_hash
                or content_hash(previous) != expected_config_hash
            ):
                raise HomeAssistantError(
                    "The target automation changed; review its current config again"
                )
        elif previous is not None:
            raise HomeAssistantError(
                "The new automation id already exists; retry approval"
            )
        updated = {
            CONF_ID: automation_id,
            **{key: value for key, value in config.items() if key != CONF_ID},
        }
        replaced = previous is not None
        if replaced:
            current[current.index(previous)] = updated
        else:
            current.append(updated)
        await hass.async_add_executor_job(_write, path, current)
    reload_failed = False
    try:
        await hass.services.async_call(AUTOMATION_DOMAIN, SERVICE_RELOAD, blocking=True)
    except Exception:
        reload_failed = True
        _LOGGER.exception(
            "Automation %s was written but the automation reload failed",
            automation_id,
        )
    return replaced, reload_failed
