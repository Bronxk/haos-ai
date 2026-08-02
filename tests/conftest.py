"""Allow pure unit tests without installing the full Home Assistant runtime."""

import sys
from pathlib import Path
from types import ModuleType

PACKAGE_ROOT = Path(__file__).parents[1] / "custom_components" / "haos_ai"

if "custom_components.haos_ai" not in sys.modules:
    package = ModuleType("custom_components.haos_ai")
    package.__path__ = [str(PACKAGE_ROOT)]  # type: ignore[attr-defined]
    sys.modules["custom_components.haos_ai"] = package
