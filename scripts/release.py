#!/usr/bin/env python3
"""Validate versions and build a deterministic HAOS AI release archive."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
COMPONENT = ROOT / "custom_components" / "haos_ai"
RELEASE_DIR = ROOT / "release"
EXCLUDED_SUFFIXES = {".pyc", ".map"}
EXCLUDED_PARTS = {"__pycache__", ".DS_Store"}


def versions() -> dict[str, str]:
    package = json.loads((ROOT / "package.json").read_text())
    package_lock = json.loads((ROOT / "package-lock.json").read_text())
    manifest = json.loads((COMPONENT / "manifest.json").read_text())
    const_text = (COMPONENT / "const.py").read_text()
    match = re.search(r'INTEGRATION_VERSION: Final = "([^"]+)"', const_text)
    if match is None:
        raise SystemExit("INTEGRATION_VERSION is missing from const.py")
    return {
        "package.json": package["version"],
        "package-lock.json": package_lock["version"],
        "package-lock root package": package_lock["packages"][""]["version"],
        "manifest.json": manifest["version"],
        "const.py": match.group(1),
    }


def check(expected: str) -> None:
    found = versions()
    mismatches = {source: value for source, value in found.items() if value != expected}
    if mismatches:
        details = ", ".join(f"{source}={value}" for source, value in mismatches.items())
        raise SystemExit(f"Release version mismatch; expected {expected}: {details}")
    changelog = (ROOT / "CHANGELOG.md").read_text()
    if f"## {expected}" not in changelog:
        raise SystemExit(f"CHANGELOG.md has no {expected} section")
    if not (COMPONENT / "frontend" / "haos-ai-panel.js").is_file():
        raise SystemExit("Production frontend bundle is missing")


def build(expected: str) -> Path:
    check(expected)
    RELEASE_DIR.mkdir(exist_ok=True)
    archive = RELEASE_DIR / f"haos-ai-{expected}.zip"
    with ZipFile(archive, "w", ZIP_DEFLATED, compresslevel=9) as bundle:
        for path in sorted(COMPONENT.rglob("*")):
            if not path.is_file():
                continue
            if (
                path.suffix in EXCLUDED_SUFFIXES
                or EXCLUDED_PARTS.intersection(path.parts)
            ):
                continue
            relative = (
                Path("custom_components")
                / "haos_ai"
                / path.relative_to(COMPONENT)
            )
            info = ZipInfo(str(relative), date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            bundle.writestr(info, path.read_bytes())
    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    checksum = archive.with_suffix(".zip.sha256")
    checksum.write_text(f"{digest}  {archive.name}\n")
    print(archive.relative_to(ROOT))
    print(checksum.relative_to(ROOT))
    return archive


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=("check", "build"))
    parser.add_argument(
        "--version",
        help="Expected version; defaults to the integration manifest version",
    )
    args = parser.parse_args()
    expected = args.version or versions()["manifest.json"]
    check(expected) if args.command == "check" else build(expected)


if __name__ == "__main__":
    main()
