"""Frontend asset registration constants."""

from custom_components.haos_ai.const import (
    INTEGRATION_VERSION,
    PANEL_ASSET_URL,
    PANEL_MODULE_URL,
)


def test_panel_module_url_is_versioned_without_changing_static_path() -> None:
    assert PANEL_ASSET_URL == "/haos_ai/haos-ai-panel.js"
    assert PANEL_MODULE_URL == f"{PANEL_ASSET_URL}?v={INTEGRATION_VERSION}"
