"""Prove the built release archive installs and boots in Home Assistant.

CI uploads nothing between jobs, so this unpacks the same deterministic archive
that a release publishes and boots Home Assistant from it, instead of trusting
the source tree the other smoke tests use.
"""

from __future__ import annotations

import asyncio
import glob
import os
import sys
import tempfile
import zipfile

from homeassistant import bootstrap, loader
from homeassistant.core import HomeAssistant

sys.path.insert(0, "/workspace")


def _archive() -> str:
    """Return the release archive to install."""
    explicit = os.environ.get("HAOS_AI_ARCHIVE")
    if explicit:
        return explicit
    candidates: list[str] = []
    for base in ("release", "/workspace/release"):
        candidates.extend(glob.glob(os.path.join(base, "haos-ai-*.zip")))
    if not candidates:
        raise SystemExit("No release archive found; run scripts/release.py build")
    return max(candidates, key=os.path.getmtime)


async def main() -> None:
    archive = _archive()
    with tempfile.TemporaryDirectory() as work:
        config_dir = os.path.join(work, "config")
        os.makedirs(config_dir, exist_ok=True)
        with zipfile.ZipFile(archive) as bundle:
            bundle.extractall(config_dir)

        installed = os.path.join(
            config_dir, "custom_components", "haos_ai"
        )
        assert os.path.isfile(os.path.join(installed, "manifest.json")), archive
        assert os.path.isfile(
            os.path.join(installed, "frontend", "haos-ai-panel.js")
        ), archive

        # Nothing that only exists for development may travel in the archive.
        for root, _dirs, files in os.walk(installed):
            assert "__pycache__" not in root, root
            for name in files:
                assert not name.endswith((".pyc", ".map")), name
                assert name != ".DS_Store", name

        hass = HomeAssistant(config_dir)
        loader.async_setup(hass)
        initialized = await bootstrap.async_from_config_dict({"haos_ai": {}}, hass)
        assert initialized is hass
        assert hass.services.has_service("haos_ai", "scan")
        # The sidebar panel is registered through panel_custom, so this also
        # proves the panel config reaches the frontend.
        panels = hass.data.get("frontend_panels", {})
        assert "haos-ai" in panels, sorted(panels)
        assert panels["haos-ai"].component_name == "custom"
        assert panels["haos-ai"].require_admin is True
        await hass.async_stop(force=True)

    print(f"Release archive smoke test OK ({os.path.basename(archive)})")


asyncio.run(main())
