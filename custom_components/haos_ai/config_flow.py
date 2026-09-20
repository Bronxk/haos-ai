"""Config and options flows for HAOS AI."""

from __future__ import annotations

import logging
import re
from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.const import CONF_API_KEY
from homeassistant.helpers import selector
from homeassistant.helpers.aiohttp_client import async_get_clientsession

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
    PROVIDER_LABELS,
    PROVIDERS,
    SCHEDULES,
)
from .providers import create_provider
from .providers.base import ProviderAuthError, ProviderError, normalize_base_url

_LOGGER = logging.getLogger(__name__)

SCHEDULE_TIME_RE = re.compile(r"^([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$")


def _normalize_schedule_time(value: Any) -> str:
    """Return HH:MM:SS for an accepted HH:MM or HH:MM:SS scan time.

    Storing a bare ``HH:MM`` used to be accepted here and then discarded at
    load time, which silently moved a configured scan back to 03:00.
    """
    text = str(value).strip()
    if not SCHEDULE_TIME_RE.match(text):
        raise vol.Invalid("Scan time must use HH:MM or HH:MM:SS")
    parts = [int(part) for part in text.split(":")]
    if len(parts) == 2:
        parts.append(0)
    hour, minute, second = parts
    return f"{hour:02d}:{minute:02d}:{second:02d}"


def _schedule_time_default(value: Any) -> str:
    """Normalize a stored default, falling back instead of failing the form."""
    try:
        return _normalize_schedule_time(value)
    except vol.Invalid:
        return DEFAULT_SCHEDULE_TIME


def _provider_schema(defaults: dict[str, Any]) -> vol.Schema:
    provider = defaults.get(CONF_PROVIDER, PROVIDERS[0])
    return vol.Schema(
        {
            vol.Required(CONF_PROVIDER, default=provider): vol.In(PROVIDERS),
            vol.Required(CONF_API_KEY, default=""): selector.TextSelector(
                selector.TextSelectorConfig(
                    type=selector.TextSelectorType.PASSWORD,
                    autocomplete="new-password",
                )
            ),
            vol.Required(
                CONF_MODEL, default=defaults.get(CONF_MODEL, DEFAULT_MODELS[provider])
            ): str,
            vol.Required(
                CONF_BASE_URL,
                default=defaults.get(
                    CONF_BASE_URL, DEFAULT_ENDPOINTS.get(provider, "")
                ),
            ): str,
        }
    )


def _credentials_schema(provider: str, defaults: dict[str, Any]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(CONF_API_KEY, default=""): selector.TextSelector(
                selector.TextSelectorConfig(
                    type=selector.TextSelectorType.PASSWORD,
                    autocomplete="new-password",
                )
            ),
            vol.Required(
                CONF_MODEL,
                default=defaults.get(CONF_MODEL, DEFAULT_MODELS[provider]),
            ): str,
            vol.Required(
                CONF_BASE_URL,
                default=defaults.get(
                    CONF_BASE_URL, DEFAULT_ENDPOINTS.get(provider, "")
                ),
            ): str,
        }
    )


def _options_schema(defaults: dict[str, Any]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(
                CONF_HISTORY_DAYS,
                default=defaults.get(CONF_HISTORY_DAYS, DEFAULT_HISTORY_DAYS),
            ): vol.All(vol.Coerce(int), vol.Range(min=1, max=90)),
            vol.Required(
                CONF_INCLUDE_EXACT_LOCATION,
                default=defaults.get(CONF_INCLUDE_EXACT_LOCATION, False),
            ): bool,
            vol.Required(
                CONF_SCHEDULE,
                default=defaults.get(CONF_SCHEDULE, DEFAULT_SCHEDULE),
            ): vol.In(SCHEDULES),
            vol.Required(
                CONF_SCHEDULE_TIME,
                default=_schedule_time_default(
                    defaults.get(CONF_SCHEDULE_TIME, DEFAULT_SCHEDULE_TIME)
                ),
            ): _normalize_schedule_time,
            vol.Required(
                CONF_SCHEDULE_WEEKDAY,
                default=defaults.get(
                    CONF_SCHEDULE_WEEKDAY, DEFAULT_SCHEDULE_WEEKDAY
                ),
            ): vol.All(vol.Coerce(int), vol.Range(min=0, max=6)),
            vol.Required(
                CONF_NOTIFY_NEW_SUGGESTIONS,
                default=defaults.get(
                    CONF_NOTIFY_NEW_SUGGESTIONS,
                    DEFAULT_NOTIFY_NEW_SUGGESTIONS,
                ),
            ): bool,
        }
    )


async def _async_validate(hass: Any, data: dict[str, Any]) -> None:
    provider = str(data[CONF_PROVIDER])
    base_url = normalize_base_url(str(data[CONF_BASE_URL]))
    client = create_provider(
        provider,
        async_get_clientsession(hass),
        str(data[CONF_API_KEY]).strip(),
        base_url,
        str(data[CONF_MODEL]).strip(),
    )
    await client.validate()


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure one direct LLM provider."""

    VERSION = 1
    _provider: str | None = None

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Handle initial setup."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        if user_input is not None:
            self._provider = str(user_input[CONF_PROVIDER])
            return await self.async_step_credentials()
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_PROVIDER, default=PROVIDERS[0]
                    ): vol.In(PROVIDERS)
                }
            ),
        )

    async def async_step_credentials(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Collect credentials after the provider choice."""
        provider = self._provider or PROVIDERS[0]
        errors: dict[str, str] = {}
        if user_input is not None:
            candidate = {**user_input, CONF_PROVIDER: provider}
            try:
                await _async_validate(self.hass, candidate)
            except ProviderAuthError:
                errors["base"] = "invalid_auth"
            except ValueError:
                errors["base"] = "invalid_url"
            except ProviderError:
                errors["base"] = "cannot_connect"
            except Exception:
                _LOGGER.exception("Unexpected provider setup validation error")
                errors["base"] = "unknown"
            else:
                normalized = {
                    **candidate,
                    CONF_API_KEY: str(candidate[CONF_API_KEY]).strip(),
                    CONF_MODEL: str(candidate[CONF_MODEL]).strip(),
                    CONF_BASE_URL: normalize_base_url(str(candidate[CONF_BASE_URL])),
                }
                return self.async_create_entry(
                    title=f"HAOS AI · {PROVIDER_LABELS[provider]}",
                    data=normalized,
                    options={
                        CONF_HISTORY_DAYS: DEFAULT_HISTORY_DAYS,
                        CONF_INCLUDE_EXACT_LOCATION: False,
                        CONF_SCHEDULE: DEFAULT_SCHEDULE,
                        CONF_SCHEDULE_TIME: DEFAULT_SCHEDULE_TIME,
                        CONF_SCHEDULE_WEEKDAY: DEFAULT_SCHEDULE_WEEKDAY,
                        CONF_NOTIFY_NEW_SUGGESTIONS: (
                            DEFAULT_NOTIFY_NEW_SUGGESTIONS
                        ),
                    },
                )
        return self.async_show_form(
            step_id="credentials",
            data_schema=_credentials_schema(provider, user_input or {}),
            errors=errors,
            description_placeholders={
                "provider": PROVIDER_LABELS[provider],
                "privacy": (
                    "Your API key stays in Home Assistant and is sent only "
                    "to the configured provider endpoint."
                ),
            },
        )

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Replace provider credentials without deleting local advisor data."""
        entry = self._get_reconfigure_entry()
        errors: dict[str, str] = {}
        defaults = dict(entry.data)
        defaults.pop(CONF_API_KEY, None)
        if user_input is not None:
            candidate = dict(user_input)
            provider = str(candidate.get(CONF_PROVIDER, ""))
            if not str(candidate.get(CONF_API_KEY, "")).strip():
                # An empty key keeps the stored credential, but only while the
                # provider stays the same: a new provider needs its own key,
                # exactly as the panel path enforces.
                if provider == str(entry.data.get(CONF_PROVIDER, "")):
                    candidate[CONF_API_KEY] = entry.data[CONF_API_KEY]
                else:
                    errors["base"] = "invalid_auth"
            if not errors:
                try:
                    await _async_validate(self.hass, candidate)
                except ProviderAuthError:
                    errors["base"] = "invalid_auth"
                except ValueError:
                    errors["base"] = "invalid_url"
                except ProviderError:
                    errors["base"] = "cannot_connect"
                except Exception:
                    _LOGGER.exception("Unexpected provider reconfiguration error")
                    errors["base"] = "unknown"
                else:
                    normalized = {
                        **candidate,
                        CONF_API_KEY: str(candidate[CONF_API_KEY]).strip(),
                        CONF_MODEL: str(candidate[CONF_MODEL]).strip(),
                        CONF_BASE_URL: normalize_base_url(
                            str(candidate[CONF_BASE_URL])
                        ),
                    }
                    # __init__ registers a config entry update listener, so the
                    # reloading variant would reload the entry twice; Home
                    # Assistant errors on that combination from 2026.12.
                    return self.async_update_and_abort(
                        entry,
                        data=normalized,
                        title=(
                            f"HAOS AI · "
                            f"{PROVIDER_LABELS[str(candidate[CONF_PROVIDER])]}"
                        ),
                    )
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=_provider_schema(user_input or defaults),
            errors=errors,
            description_placeholders={
                "privacy": "Leave the API key empty to keep the stored key."
            },
        )

    @staticmethod
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        return HaosAIOptionsFlow(config_entry)


class HaosAIOptionsFlow(config_entries.OptionsFlow):
    """Update provider and privacy settings."""

    def __init__(self, entry: config_entries.ConfigEntry) -> None:
        self.entry = entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)
        return self.async_show_form(
            step_id="init", data_schema=_options_schema(dict(self.entry.options))
        )
