"""Runtime container for HAOS AI."""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from dataclasses import dataclass, field

from homeassistant.config_entries import ConfigEntry

from .advisor import Advisor
from .storage import AdvisorStore


@dataclass(slots=True)
class HaosAIRuntime:
    """Objects owned by the single HAOS AI config entry."""

    entry: ConfigEntry
    advisor: Advisor
    store: AdvisorStore
    unsubscribe_schedule: Callable[[], None] | None = None
    operation_lock: asyncio.Lock = field(default_factory=asyncio.Lock)
