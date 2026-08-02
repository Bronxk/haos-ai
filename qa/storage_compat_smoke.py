"""Exercise HAOS AI storage across upgrade and rollback code versions."""

from __future__ import annotations

import asyncio
import sys

from homeassistant.core import HomeAssistant

sys.path.insert(0, "/workspace")

from custom_components.haos_ai.storage import AdvisorStore  # noqa: E402


async def main() -> None:
    """Seed or verify persistent data using the mounted integration version."""
    if len(sys.argv) != 2 or sys.argv[1] not in {"seed", "upgrade", "rollback"}:
        raise SystemExit("usage: storage_compat_smoke.py seed|upgrade|rollback")
    mode = sys.argv[1]
    hass = HomeAssistant("/state")
    store = AdvisorStore(hass)
    await store.async_load()

    if mode == "seed":
        store.data["preferences"]["notes"] = ["upgrade-canary"]
    else:
        assert "upgrade-canary" in store.data["preferences"]["notes"]
        if mode == "upgrade":
            assert not any(
                store.data["preferences"]["change_permissions"].values()
            )
            store.data["preferences"]["notes"].append("rollback-canary")
        else:
            assert "rollback-canary" in store.data["preferences"]["notes"]
    await store.async_save()
    await hass.async_stop(force=True)
    print(f"Storage compatibility {mode} OK")


asyncio.run(main())
