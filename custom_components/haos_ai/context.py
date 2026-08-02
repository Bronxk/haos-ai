"""Read-only Home Assistant context and hygiene analysis."""

from __future__ import annotations

import logging
from datetime import timedelta
from typing import Any

from homeassistant.components.automation import (
    DATA_COMPONENT as AUTOMATION_COMPONENT,
)
from homeassistant.const import __version__ as HA_VERSION
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
from homeassistant.util import dt as dt_util

from .history import summarize_states
from .privacy import exclude_ignored_entities, sanitize
from .providers.base import ToolSpec

_LOGGER = logging.getLogger(__name__)

STATE_DOMAINS_WITHOUT_ROUTINES = frozenset(
    {
        "automation",
        "button",
        "conversation",
        "event",
        "image",
        "persistent_notification",
        "scene",
        "script",
        "stt",
        "tts",
        "update",
    }
)
SENSITIVE_DOMAINS = frozenset({"alarm_control_panel", "camera"})


class ContextEngine:
    """Build bounded, read-only context from live Home Assistant state."""

    def __init__(
        self,
        hass: HomeAssistant,
        *,
        history_days: int = 30,
        include_exact_location: bool = False,
    ) -> None:
        self.hass = hass
        self.history_days = max(1, min(history_days, 90))
        self.include_exact_location = include_exact_location
        self.outbound_trace: list[dict[str, Any]] = []

    @staticmethod
    def tool_specs() -> list[ToolSpec]:
        """Return the provider-neutral context tools."""
        object_schema = {"type": "object", "additionalProperties": False}
        return [
            ToolSpec(
                "get_home_summary",
                "Get counts, areas, floors, integrations and installation metadata.",
                {**object_schema, "properties": {}, "required": []},
            ),
            ToolSpec(
                "search_entities",
                "Search entities by text, domain, area or state. Returns at most 50.",
                {
                    **object_schema,
                    "properties": {
                        "query": {"type": "string"},
                        "domain": {"type": ["string", "null"]},
                        "area_id": {"type": ["string", "null"]},
                    },
                    "required": ["query", "domain", "area_id"],
                },
            ),
            ToolSpec(
                "get_entity_detail",
                "Get a sanitized entity, registry, device and area detail record.",
                {
                    **object_schema,
                    "properties": {"entity_id": {"type": "string"}},
                    "required": ["entity_id"],
                },
            ),
            ToolSpec(
                "get_history_summary",
                "Get a locally aggregated history summary for one entity.",
                {
                    **object_schema,
                    "properties": {
                        "entity_id": {"type": "string"},
                        "days": {"type": "integer", "minimum": 1, "maximum": 90},
                    },
                    "required": ["entity_id", "days"],
                },
            ),
            ToolSpec(
                "get_automations",
                (
                    "Get sanitized existing automation configurations, "
                    "optionally filtered."
                ),
                {
                    **object_schema,
                    "properties": {"query": {"type": "string"}},
                    "required": ["query"],
                },
            ),
            ToolSpec(
                "get_integrations",
                "Get configured integration domains and entry health.",
                {**object_schema, "properties": {}, "required": []},
            ),
            ToolSpec(
                "get_apps",
                (
                    "Get installed Home Assistant apps/add-ons when Supervisor "
                    "is available."
                ),
                {**object_schema, "properties": {}, "required": []},
            ),
            ToolSpec(
                "get_preferences",
                "Get the user's confirmed local advisor preferences.",
                {**object_schema, "properties": {}, "required": []},
            ),
        ]

    async def async_execute_tool(
        self, name: str, arguments: dict[str, Any], preferences: dict[str, Any]
    ) -> dict[str, Any]:
        """Execute a known read-only tool and keep a local outbound trace."""
        ignored = {
            str(entity_id)
            for entity_id in preferences.get("ignored_entities", [])
        }
        requested_entity = str(arguments.get("entity_id", ""))
        if requested_entity in ignored and name in {
            "get_entity_detail",
            "get_history_summary",
        }:
            raw = {
                "error": "entity_excluded_by_user",
                "entity_id": "[IGNORED]",
            }
        elif name == "get_home_summary":
            raw = self.home_summary()
        elif name == "search_entities":
            raw = self.search_entities(
                str(arguments.get("query", "")),
                domain=arguments.get("domain"),
                area_id=arguments.get("area_id"),
            )
        elif name == "get_entity_detail":
            raw = self.entity_detail(str(arguments.get("entity_id", "")))
        elif name == "get_history_summary":
            raw = await self.async_history_summary(
                str(arguments.get("entity_id", "")),
                min(
                    int(arguments.get("days", self.history_days)),
                    self.history_days,
                ),
            )
        elif name == "get_automations":
            raw = self.automations(str(arguments.get("query", "")))
        elif name == "get_integrations":
            raw = self.integrations()
        elif name == "get_apps":
            raw = await self.async_apps()
        elif name == "get_preferences":
            raw = preferences
        else:
            raw = {"error": f"Unknown read-only context tool: {name}"}
        raw = exclude_ignored_entities(raw, ignored)
        cleaned, redactions = sanitize(
            raw, include_exact_location=self.include_exact_location
        )
        result = {
            "data": cleaned,
            "privacy": {"redacted_fields": redactions},
        }
        self.outbound_trace.append(
            {"tool": name, "arguments": arguments, "result": result}
        )
        return result

    def home_summary(self) -> dict[str, Any]:
        """Return inventory counts and named physical structure."""
        area_registry = ar.async_get(self.hass)
        floor_registry = fr.async_get(self.hass)
        device_registry = dr.async_get(self.hass)
        entity_registry = er.async_get(self.hass)
        label_registry = lr.async_get(self.hass)
        return {
            "home_assistant": {
                "version": HA_VERSION,
                "name": self.hass.config.location_name,
                "timezone": self.hass.config.time_zone,
                "units": self.hass.config.units.as_dict(),
                "currency": self.hass.config.currency,
            },
            "counts": {
                "states": len(self.hass.states.async_all()),
                "entities": len(entity_registry.entities),
                "devices": len(device_registry.devices),
                "areas": len(area_registry.areas),
                "floors": len(floor_registry.floors),
                "labels": len(label_registry.labels),
                "integrations": len(self.hass.config_entries.async_entries()),
            },
            "areas": [
                {
                    "id": area.id,
                    "name": area.name,
                    "floor_id": area.floor_id,
                    "aliases": list(area.aliases),
                }
                for area in area_registry.areas.values()
            ],
            "floors": [
                {"id": floor.floor_id, "name": floor.name, "level": floor.level}
                for floor in floor_registry.floors.values()
            ],
        }

    def _entity_area_id(self, entity: er.RegistryEntry) -> str | None:
        if entity.area_id:
            return entity.area_id
        if entity.device_id:
            device = dr.async_get(self.hass).async_get(entity.device_id)
            return device.area_id if device else None
        return None

    def search_entities(
        self,
        query: str,
        *,
        domain: str | None = None,
        area_id: str | None = None,
    ) -> dict[str, Any]:
        """Search current entities with bounded output."""
        query = query.casefold().strip()
        registry = er.async_get(self.hass)
        rows: list[dict[str, Any]] = []
        for state in self.hass.states.async_all():
            state_domain = state.entity_id.split(".", 1)[0]
            if domain and state_domain != domain:
                continue
            entry = registry.async_get(state.entity_id)
            entity_area = self._entity_area_id(entry) if entry else None
            if area_id and entity_area != area_id:
                continue
            name = (
                (entry.name or entry.original_name)
                if entry
                else state.attributes.get("friendly_name")
            ) or state.entity_id
            haystack = f"{state.entity_id} {name} {state.state}".casefold()
            if query and query not in haystack:
                continue
            rows.append(
                {
                    "entity_id": state.entity_id,
                    "name": name,
                    "state": state.state,
                    "domain": state_domain,
                    "area_id": entity_area,
                    "device_id": entry.device_id if entry else None,
                    "disabled": bool(entry and entry.disabled_by),
                }
            )
            if len(rows) >= 50:
                break
        return {"results": rows, "truncated": len(rows) == 50}

    def entity_detail(self, entity_id: str) -> dict[str, Any]:
        """Return one live entity with its registry relationships."""
        state = self.hass.states.get(entity_id)
        entry = er.async_get(self.hass).async_get(entity_id)
        if state is None and entry is None:
            return {"error": "entity_not_found", "entity_id": entity_id}
        device = (
            dr.async_get(self.hass).async_get(entry.device_id)
            if entry and entry.device_id
            else None
        )
        area_id = self._entity_area_id(entry) if entry else None
        area = ar.async_get(self.hass).async_get_area(area_id) if area_id else None
        attributes = dict(state.attributes) if state else {}
        if entity_id.split(".", 1)[0] in SENSITIVE_DOMAINS:
            attributes = {
                key: value
                for key, value in attributes.items()
                if key in {"friendly_name", "device_class", "supported_features"}
            }
        return {
            "entity_id": entity_id,
            "state": state.state if state else None,
            "last_changed": state.last_changed.isoformat() if state else None,
            "attributes": attributes,
            "registry": (
                {
                    "name": entry.name,
                    "original_name": entry.original_name,
                    "platform": entry.platform,
                    "device_id": entry.device_id,
                    "area_id": entry.area_id,
                    "labels": list(entry.labels),
                    "disabled_by": (
                        str(entry.disabled_by) if entry.disabled_by else None
                    ),
                }
                if entry
                else None
            ),
            "device": (
                {
                    "name": device.name_by_user or device.name,
                    "manufacturer": device.manufacturer,
                    "model": device.model,
                    "area_id": device.area_id,
                    "config_entries": list(device.config_entries),
                }
                if device
                else None
            ),
            "area": {"id": area.id, "name": area.name} if area else None,
        }

    def integrations(self) -> dict[str, Any]:
        """Return configured integration health without secrets."""
        return {
            "entries": [
                {
                    "entry_id": entry.entry_id,
                    "domain": entry.domain,
                    "title": entry.title,
                    "state": entry.state.value,
                    "disabled": entry.disabled_by is not None,
                    "source": entry.source,
                }
                for entry in self.hass.config_entries.async_entries()
                if entry.domain != "haos_ai"
            ]
        }

    async def async_apps(self) -> dict[str, Any]:
        """Return Supervisor app metadata when HAOS exposes it."""
        try:
            from homeassistant.components.hassio import get_apps_list

            apps = get_apps_list(self.hass)
        except Exception as err:
            _LOGGER.debug("Supervisor app context is unavailable", exc_info=True)
            return {"available": False, "reason": type(err).__name__, "apps": []}
        rows = []
        for app in apps or []:
            if isinstance(app, dict):
                rows.append(
                    {
                        key: app.get(key)
                        for key in (
                            "name",
                            "slug",
                            "version",
                            "version_latest",
                            "update_available",
                            "state",
                            "repository",
                        )
                    }
                )
            else:
                rows.append(
                    {
                        key: getattr(app, key, None)
                        for key in (
                            "name",
                            "slug",
                            "version",
                            "version_latest",
                            "update_available",
                            "state",
                            "repository",
                        )
                    }
                )
        return {"available": True, "apps": rows}

    def automations(self, query: str = "") -> dict[str, Any]:
        """Return existing raw automation config from loaded entities."""
        component = self.hass.data.get(AUTOMATION_COMPONENT)
        if component is None:
            return {"automations": [], "available": False}
        query = query.casefold().strip()
        rows: list[dict[str, Any]] = []
        for automation in component.entities:
            raw = automation.raw_config
            if not raw:
                continue
            name = automation.name or automation.entity_id
            if query and query not in f"{name} {automation.entity_id}".casefold():
                continue
            rows.append(
                {
                    "entity_id": automation.entity_id,
                    "name": name,
                    "enabled": automation.is_on,
                    "config": dict(raw),
                    "referenced_entities": sorted(automation.referenced_entities),
                    "referenced_devices": sorted(automation.referenced_devices),
                    "referenced_areas": sorted(automation.referenced_areas),
                }
            )
            if len(rows) >= 50:
                break
        return {"automations": rows, "available": True}

    async def async_history_summary(
        self, entity_id: str, days: int
    ) -> dict[str, Any]:
        """Read and summarize recorder data off the event loop."""
        if not self.hass.states.get(entity_id):
            return {"error": "entity_not_found", "entity_id": entity_id}
        try:
            from homeassistant.components.recorder import get_instance
            from homeassistant.components.recorder.history import get_significant_states

            start = dt_util.utcnow() - timedelta(days=max(1, min(days, 90)))
            end = dt_util.utcnow()
            instance = get_instance(self.hass)

            def fetch() -> dict[str, list[Any]]:
                return get_significant_states(
                    self.hass,
                    start,
                    end,
                    [entity_id],
                    include_start_time_state=True,
                    significant_changes_only=False,
                    minimal_response=False,
                    no_attributes=True,
                )

            result = await instance.async_add_executor_job(fetch)
            states = result.get(entity_id, [])
            return {
                "entity_id": entity_id,
                "days": days,
                "summary": summarize_states(states),
            }
        except Exception as err:
            _LOGGER.debug("Recorder history context is unavailable", exc_info=True)
            return {
                "entity_id": entity_id,
                "available": False,
                "reason": type(err).__name__,
            }

    def hygiene_candidates(self) -> dict[str, Any]:
        """Generate deterministic local candidates before spending tokens."""
        registry = er.async_get(self.hass)
        states = {state.entity_id: state for state in self.hass.states.async_all()}
        unavailable = [
            entity_id
            for entity_id, state in states.items()
            if state.state in {"unavailable", "unknown"}
        ]
        unassigned: list[str] = []
        disabled: list[str] = []
        for entry in registry.entities.values():
            if entry.disabled_by:
                disabled.append(entry.entity_id)
            if (
                not entry.entity_category
                and not self._entity_area_id(entry)
                and entry.domain not in STATE_DOMAINS_WITHOUT_ROUTINES
            ):
                unassigned.append(entry.entity_id)
        missing_refs: list[dict[str, str]] = []
        automation_rows = self.automations().get("automations", [])
        for automation in automation_rows:
            for referenced in automation["referenced_entities"]:
                if referenced not in states and registry.async_get(referenced) is None:
                    missing_refs.append(
                        {
                            "automation": automation["entity_id"],
                            "missing_entity": referenced,
                        }
                    )
        return {
            "unavailable_entities": unavailable[:100],
            "unassigned_entities": unassigned[:100],
            "disabled_entities": disabled[:100],
            "automation_missing_references": missing_refs[:100],
            "counts": {
                "unavailable": len(unavailable),
                "unassigned": len(unassigned),
                "disabled": len(disabled),
                "missing_references": len(missing_refs),
            },
        }

    async def async_baseline_preview(self) -> dict[str, Any]:
        """Build the exact baseline payload offered before a provider request."""
        # Registry and state-machine access must remain on Home Assistant's
        # event loop. Only recorder's synchronous query is delegated by its
        # own API in async_history_summary.
        home = self.home_summary()
        candidates = self.hygiene_candidates()
        integrations = self.integrations()
        apps = await self.async_apps()
        payload = {
            "home_summary": home,
            "local_candidates": candidates,
            "integrations": integrations,
            "apps": apps,
            "privacy_defaults": {
                "history_days": self.history_days,
                "exact_location": self.include_exact_location,
                "camera_media": False,
            },
        }
        cleaned, redactions = sanitize(
            payload, include_exact_location=self.include_exact_location
        )
        return {"payload": cleaned, "redactions": redactions}
