"""Read-only Home Assistant context and hygiene analysis."""

from __future__ import annotations

import logging
from collections.abc import Mapping
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

# The model-facing automation listing is capped so a huge installation cannot
# flood one tool result. Internal checks must not rely on this window.
MAX_AUTOMATION_ROWS = 50


def iter_device_entries(registry: dr.DeviceRegistry) -> list[Any]:
    """Return every device entry, across Home Assistant registry versions.

    Home Assistant 2026.8 deprecated using ``registry.devices`` as a mapping
    and 2026.9 added ``async_get_devices``; older releases still expose a plain
    mapping whose iteration yields ids rather than entries. Iterating the
    registry is the supported path on the new API, and imperative iteration is
    only a warning for custom integrations today but is removed in 2027.9.
    """
    get_devices = getattr(registry, "async_get_devices", None)
    if get_devices is not None:
        return list(get_devices())
    devices = registry.devices
    if isinstance(devices, Mapping):
        return list(devices.values())
    return list(devices)


def device_config_entry_ids(device: Any) -> list[str]:
    """Return the config entry ids a device is linked to.

    A device was restricted to a single config entry in Home Assistant 2026.8,
    which turned ``DeviceEntry.config_entries`` into a deprecated property.
    Prefer ``config_entry_id`` and only read the legacy set when the newer
    attribute does not exist at all, so the deprecated property is never
    touched on a release that warns about it.
    """
    if hasattr(device, "config_entry_id"):
        entry_id = device.config_entry_id
        return [str(entry_id)] if entry_id else []
    legacy = getattr(device, "config_entries", None) or ()
    return [str(entry) for entry in legacy]


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
        self.exclusions: set[str] = set()

    def set_exclusions(self, preferences: dict[str, Any]) -> set[str]:
        """Resolve every ignore scope into concrete identifiers to withhold.

        Entity, domain, area, and label ignores are enforced here rather than
        asked of the model, so an ignored thing is never transmitted at all.
        """
        entities = {
            str(value)
            for value in preferences.get("ignored_entities", [])
            if str(value)
        }
        domains = {
            str(value).casefold()
            for value in preferences.get("ignored_domains", [])
            if str(value)
        }
        areas = {
            str(value) for value in preferences.get("ignored_areas", []) if str(value)
        }
        labels = {
            str(value) for value in preferences.get("ignored_labels", []) if str(value)
        }

        excluded: set[str] = set(entities) | set(areas) | set(labels)
        registry = er.async_get(self.hass)
        device_registry = dr.async_get(self.hass)

        if areas or labels:
            for device in iter_device_entries(device_registry):
                if device.area_id in areas or (set(device.labels) & labels):
                    excluded.add(device.id)

        for entry in registry.entities.values():
            if entry.domain.casefold() in domains:
                excluded.add(entry.entity_id)
                continue
            if areas and self._entity_area_id(entry) in areas:
                excluded.add(entry.entity_id)
                continue
            if labels and (set(entry.labels) & labels):
                excluded.add(entry.entity_id)
                continue
            if entry.device_id and entry.device_id in excluded:
                excluded.add(entry.entity_id)

        if domains:
            # States without a registry entry still belong to a domain.
            for state in self.hass.states.async_all():
                if state.entity_id.split(".", 1)[0].casefold() in domains:
                    excluded.add(state.entity_id)

        self.exclusions = excluded
        return excluded

    def _is_excluded(self, identifier: str | None) -> bool:
        return bool(identifier) and identifier in self.exclusions

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
                    "Get existing automation configurations, optionally "
                    "filtered by a substring of the automation name or entity "
                    "id. Omit query, or pass an empty string or '*', to list "
                    "every automation."
                ),
                {
                    **object_schema,
                    "properties": {"query": {"type": ["string", "null"]}},
                    "required": [],
                },
            ),
            ToolSpec(
                "get_blueprints",
                (
                    "Get installed automation and script blueprints with their "
                    "inputs, so a proposal can reuse one instead of raw YAML."
                ),
                {**object_schema, "properties": {}, "required": []},
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
        ignored = self.set_exclusions(preferences)
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
            raw = self.automations(str(arguments.get("query") or ""))
        elif name == "get_blueprints":
            raw = await self.async_blueprints()
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
                "devices": len(iter_device_entries(device_registry)),
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
                if not self._is_excluded(area.id)
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
            # Exclude before the result cap so an ignored area cannot fill
            # the page and starve the model of usable results.
            if self._is_excluded(state.entity_id):
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
        if self._is_excluded(entity_id):
            return {"error": "entity_excluded_by_user", "entity_id": "[IGNORED]"}
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
                    "config_entries": device_config_entry_ids(device),
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

    async def async_blueprints(self) -> dict[str, Any]:
        """Return installed blueprints and their declared inputs.

        A blueprint instance is usually a better proposal than hand-written
        YAML, so the model needs to know which ones exist.
        """
        try:
            from homeassistant.components.blueprint import DOMAIN as BLUEPRINT_DOMAIN

            domain_blueprints = self.hass.data.get(BLUEPRINT_DOMAIN) or {}
        except Exception as err:
            _LOGGER.debug("Blueprint context is unavailable", exc_info=True)
            return {"available": False, "reason": type(err).__name__, "blueprints": []}

        rows: list[dict[str, Any]] = []
        for domain, store in domain_blueprints.items():
            try:
                blueprints = await store.async_get_blueprints()
            except Exception:
                _LOGGER.debug(
                    "Could not list %s blueprints", domain, exc_info=True
                )
                continue
            for path, blueprint in (blueprints or {}).items():
                metadata = getattr(blueprint, "metadata", None)
                if not isinstance(metadata, dict):
                    # Unparsable blueprints surface as exceptions in this map.
                    continue
                raw_inputs = metadata.get("input") or {}
                inputs: list[dict[str, Any]] = []
                if isinstance(raw_inputs, dict):
                    for input_name, spec in list(raw_inputs.items())[:30]:
                        detail = spec if isinstance(spec, dict) else {}
                        inputs.append(
                            {
                                "name": str(input_name),
                                "description": str(
                                    detail.get("description", "")
                                )[:300],
                                "required": "default" not in detail,
                            }
                        )
                rows.append(
                    {
                        "domain": str(domain),
                        "path": str(path),
                        "name": str(metadata.get("name", path)),
                        "description": str(metadata.get("description", ""))[:500],
                        "inputs": inputs,
                    }
                )
                if len(rows) >= 60:
                    break
        return {
            "available": True,
            "blueprints": rows,
            "usage_hint": (
                "Propose a blueprint automation as "
                "{'use_blueprint': {'path': <path>, 'input': {...}}} using the "
                "exact path and input names listed here."
            ),
        }

    def automations(self, query: str = "") -> dict[str, Any]:
        """Return existing raw automation config from loaded entities."""
        component = self.hass.data.get(AUTOMATION_COMPONENT)
        if component is None:
            return {"automations": [], "available": False}
        # A model that wants every automation often sends a wildcard or a
        # filler word instead of omitting the filter. Treat those as "no
        # filter" rather than as a literal substring that can never match,
        # which used to make this tool silently report an empty home.
        query = query.casefold().strip()
        if query in {"", "*", "all"}:
            query = ""
        rows: list[dict[str, Any]] = []
        truncated = False
        for automation in component.entities:
            raw = automation.raw_config
            if not raw or self._is_excluded(automation.entity_id):
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
            if len(rows) >= MAX_AUTOMATION_ROWS:
                truncated = True
                break
        return {"automations": rows, "available": True, "truncated": truncated}

    def automation_ids(self) -> set[str]:
        """Return every automation config id, honouring the ignore scopes.

        ``automations()`` is capped for the model's benefit, so it must not be
        used to decide whether a proposed update target exists: on a large
        installation the target would look missing and the update would be
        silently degraded into a create.
        """
        component = self.hass.data.get(AUTOMATION_COMPONENT)
        if component is None:
            return set()
        identifiers: set[str] = set()
        for automation in component.entities:
            raw = getattr(automation, "raw_config", None)
            if not raw or self._is_excluded(automation.entity_id):
                continue
            if automation_id := raw.get("id"):
                identifiers.add(str(automation_id))
        return identifiers

    def is_verified_source(self, source_type: str, source_id: str) -> bool:
        """Return whether a cited evidence source exists in this installation.

        A model can invent an identifier; unverifiable evidence stays visible
        but is marked, so a fabricated claim cannot pass as an observation.
        """
        identifier = str(source_id or "").strip()
        if not identifier:
            return False
        entity_registry = er.async_get(self.hass)
        if source_type in {"entity", "history"}:
            return bool(
                self.hass.states.get(identifier)
                or entity_registry.async_get(identifier)
            )
        if source_type == "device":
            return dr.async_get(self.hass).async_get(identifier) is not None
        if source_type == "automation":
            return bool(
                identifier in self.automation_ids()
                or self.hass.states.get(identifier)
                or entity_registry.async_get(identifier)
            )
        if source_type == "integration":
            return any(
                entry.domain == identifier
                for entry in self.hass.config_entries.async_entries()
            )
        if source_type == "registry":
            return bool(
                entity_registry.async_get(identifier)
                or dr.async_get(self.hass).async_get(identifier)
                or identifier in ar.async_get(self.hass).areas
                or identifier in fr.async_get(self.hass).floors
                or identifier in lr.async_get(self.hass).labels
            )
        # Supervisor app slugs need a network round trip to confirm, so they
        # are reported as unverified rather than guessed either way.
        return False

    async def async_history_summary(
        self, entity_id: str, days: int
    ) -> dict[str, Any]:
        """Read and summarize recorder data off the event loop."""
        if self._is_excluded(entity_id):
            return {"error": "entity_excluded_by_user", "entity_id": "[IGNORED]"}
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
        device_registry = dr.async_get(self.hass)
        states = {
            state.entity_id: state
            for state in self.hass.states.async_all()
            if not self._is_excluded(state.entity_id)
        }
        unavailable = [
            entity_id
            for entity_id, state in states.items()
            if state.state in {"unavailable", "unknown"}
        ]
        unassigned: list[str] = []
        disabled: list[str] = []
        orphaned: list[dict[str, str]] = []
        entities_by_device: dict[str, list[str]] = {}
        for entry in registry.entities.values():
            if self._is_excluded(entry.entity_id):
                continue
            if entry.device_id:
                entities_by_device.setdefault(entry.device_id, []).append(
                    entry.entity_id
                )
            if entry.disabled_by:
                disabled.append(entry.entity_id)
            if entry.entity_id not in states and not entry.disabled_by:
                orphaned.append(
                    {
                        "entity_id": entry.entity_id,
                        "platform": entry.platform,
                    }
                )
            if (
                not entry.entity_category
                and not self._entity_area_id(entry)
                and entry.domain not in STATE_DOMAINS_WITHOUT_ROUTINES
            ):
                unassigned.append(entry.entity_id)
        stale_devices: list[dict[str, Any]] = []
        disabled_entity_ids = set(disabled)
        for device in iter_device_entries(device_registry):
            if self._is_excluded(device.id):
                continue
            entity_ids = entities_by_device.get(device.id, [])
            if (
                not entity_ids
                or any(entity_id in states for entity_id in entity_ids)
                or any(entity_id in disabled_entity_ids for entity_id in entity_ids)
            ):
                continue
            config_entry_ids = device_config_entry_ids(device)
            removable_entry_id = next(
                (
                    entry_id
                    for entry_id in config_entry_ids
                    if (
                        config_entry := self.hass.config_entries.async_get_entry(
                            entry_id
                        )
                    )
                    and config_entry.supports_remove_device
                ),
                None,
            )
            if removable_entry_id:
                stale_devices.append(
                    {
                        "device_id": device.id,
                        "name": device.name_by_user or device.name or device.id,
                        "config_entry_id": removable_entry_id,
                        "orphaned_entities": entity_ids[:20],
                    }
                )
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
            "orphaned_entities": orphaned[:100],
            "stale_devices": stale_devices[:50],
            "automation_missing_references": missing_refs[:100],
            "counts": {
                "unavailable": len(unavailable),
                "unassigned": len(unassigned),
                "disabled": len(disabled),
                "orphaned": len(orphaned),
                "stale_devices": len(stale_devices),
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
        blueprints = await self.async_blueprints()
        payload = {
            "home_summary": home,
            "local_candidates": candidates,
            "integrations": integrations,
            "apps": apps,
            "blueprints": blueprints,
            "privacy_defaults": {
                "history_days": self.history_days,
                "exact_location": self.include_exact_location,
                "camera_media": False,
                "excluded_identifiers": len(self.exclusions),
            },
        }
        cleaned, redactions = sanitize(
            payload, include_exact_location=self.include_exact_location
        )
        return {"payload": cleaned, "redactions": redactions}
