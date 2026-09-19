"""Backend read and write access to Home Assistant's UI automation file.

Home Assistant's own automation editor stores UI automations in
``automations.yaml``. HAOS AI writes through the same file and the same
reload service so an approved change is indistinguishable from one made in
the built-in editor, and so approval can be enforced on the server instead
of in the browser.
"""

from __future__ import annotations

import os
from typing import Any

from homeassistant.const import CONF_ID, SERVICE_RELOAD
from homeassistant.core import HomeAssistant
from homeassistant.util.file import write_utf8_file_atomic
from homeassistant.util.yaml import dump as yaml_dump
from homeassistant.util.yaml import load_yaml

from .const import AUTOMATION_CONFIG_FILE

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


async def async_save_automation(
    hass: HomeAssistant, automation_id: str, config: dict[str, Any]
) -> bool:
    """Create or replace one automation, then reload the automation platform.

    Returns whether an existing automation was replaced.
    """
    path = _config_path(hass)
    current = await hass.async_add_executor_job(_read, path)
    # Home Assistant keys UI automations by ``id``; keep it authoritative so a
    # model-supplied id in the body cannot retarget the write.
    updated = {CONF_ID: automation_id}
    updated.update(
        {key: value for key, value in config.items() if key != CONF_ID}
    )

    replaced = False
    for index, item in enumerate(current):
        if str(item.get(CONF_ID, "")) == automation_id:
            current[index] = updated
            replaced = True
            break
    if not replaced:
        current.append(updated)

    await hass.async_add_executor_job(_write, path, current)
    await hass.services.async_call(
        AUTOMATION_DOMAIN, SERVICE_RELOAD, blocking=True
    )
    return replaced
