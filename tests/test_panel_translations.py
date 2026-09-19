"""Panel translation catalog tests.

The panel resolves its strings through Home Assistant's translation catalog
and falls back to a table compiled into the bundle. The two must stay in
step, or a translated instance silently shows a key.
"""

import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).parents[1]
PANEL_SOURCE = REPO_ROOT / "frontend" / "haos-ai-panel.ts"
STRINGS = REPO_ROOT / "custom_components" / "haos_ai" / "strings.json"
ENGLISH = REPO_ROOT / "custom_components" / "haos_ai" / "translations" / "en.json"

STRING_ENTRY_RE = re.compile(
    r'"([^"]+)":\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*)+),'
)
STRING_PART_RE = re.compile(r'"((?:[^"\\]|\\.)*)"')


def _panel_strings() -> dict[str, str]:
    """Parse the English fallback table out of the panel source."""
    source = PANEL_SOURCE.read_text(encoding="utf-8")
    block = re.search(
        r"const PANEL_STRINGS: Record<string, string> = \{(.*?)\n\};",
        source,
        re.S,
    )
    assert block is not None, "PANEL_STRINGS table not found"
    return {
        key: "".join(STRING_PART_RE.findall(value)).replace('\\"', '"')
        for key, value in STRING_ENTRY_RE.findall(block.group(1))
    }


def test_panel_strings_are_mirrored_in_both_catalogs() -> None:
    panel = _panel_strings()
    assert panel, "the panel fallback table must not be empty"

    for path in (STRINGS, ENGLISH):
        catalog = json.loads(path.read_text(encoding="utf-8"))
        assert catalog.get("panel") == panel, f"{path.name} is out of sync"


def test_every_panel_key_used_in_the_panel_is_defined() -> None:
    source = PANEL_SOURCE.read_text(encoding="utf-8")
    panel = _panel_strings()
    used = set(re.findall(r'this\.t\("([^"]+)"\)', source))
    # Outcome keys are built from the backend outcome value at runtime.
    used.discard("applied.outcome.")
    dynamic = {key for key in panel if key.startswith("applied.outcome.")}
    assert dynamic, "outcome labels must exist"

    missing = {key for key in used if key not in panel}
    assert not missing, f"undefined panel strings: {sorted(missing)}"
