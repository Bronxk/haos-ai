"""Panel icon-button template tests.

Home Assistant's ``ha-icon-button`` element has no ``icon`` property. It
renders either an SVG ``path`` or a slotted ``<ha-icon>`` child, so passing
``icon="mdi:..."`` as an attribute produced a button with no glyph at all.
That silently hid the "new conversation" control and six other icon buttons
from the panel while leaving them present in the DOM.
"""

import re
from pathlib import Path

REPO_ROOT = Path(__file__).parents[1]
PANEL_SOURCE = REPO_ROOT / "frontend" / "haos-ai-panel.ts"

ICON_BUTTON_RE = re.compile(r"<ha-icon-button\b(.*?)</ha-icon-button>", re.S)
SLOTTED_ICON_RE = re.compile(r"<ha-icon\s+icon=")


def _icon_button_blocks() -> list[str]:
    """Return the markup of every ``ha-icon-button`` in the panel template."""
    return ICON_BUTTON_RE.findall(PANEL_SOURCE.read_text(encoding="utf-8"))


def test_panel_renders_icon_buttons() -> None:
    assert _icon_button_blocks(), "no ha-icon-button found in the panel source"


def test_icon_buttons_do_not_pass_the_removed_icon_attribute() -> None:
    """``icon=`` may only appear on the slotted child, never on the button."""
    offenders = []
    for block in _icon_button_blocks():
        child = block.find("<ha-icon")
        if child == -1:
            continue
        if 'icon="' in block[:child]:
            offenders.append(" ".join(block.split())[:160])

    assert not offenders, (
        "ha-icon-button has no `icon` property; slot an <ha-icon> child "
        f"instead of passing icon=: {offenders}"
    )


def test_every_icon_button_slots_an_ha_icon() -> None:
    missing = [
        " ".join(block.split())[:160]
        for block in _icon_button_blocks()
        if not SLOTTED_ICON_RE.search(block)
    ]

    assert not missing, f"icon buttons without a slotted <ha-icon>: {missing}"
