"""Privacy filtering and outbound context receipts."""

from __future__ import annotations

import re
from collections.abc import Mapping, Sequence
from typing import Any
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

SENSITIVE_KEY_PARTS = frozenset(
    {
        "access_token",
        "api_key",
        "authorization",
        "bearer",
        "code",
        "credential",
        "latitude",
        "longitude",
        "password",
        "pin",
        "refresh_token",
        "secret",
        "token",
    }
)
LOCATION_KEYS = frozenset(
    {
        "gps_accuracy",
        "latitude",
        "longitude",
        "location",
    }
)
SAFE_LOCATION_KEYS = frozenset({"source_type"})
URL_CREDENTIALS_RE = re.compile(r"(https?://)([^/@:\s]+):([^/@\s]+)@", re.I)
BEARER_RE = re.compile(r"\bBearer\s+[A-Za-z0-9._~+/=-]+", re.I)
URL_RE = re.compile(r"https?://[^\s\"'<>]+", re.I)
SENSITIVE_QUERY_PARTS = frozenset(
    {"access_token", "api_key", "auth", "code", "key", "secret", "sig", "token"}
)


def exclude_ignored_entities(value: Any, ignored: set[str]) -> Any:
    """Remove explicitly ignored entity IDs from nested outbound context."""
    if isinstance(value, dict):
        if str(value.get("entity_id", "")) in ignored:
            return None
        return {
            key: cleaned
            for key, item in value.items()
            if key not in ignored
            and (cleaned := exclude_ignored_entities(item, ignored)) is not None
        }
    if isinstance(value, list):
        return [
            cleaned
            for item in value
            if (cleaned := exclude_ignored_entities(item, ignored)) is not None
        ]
    if isinstance(value, str) and value in ignored:
        return None
    return value


def _is_sensitive_key(key: str, include_exact_location: bool) -> bool:
    normalized = key.casefold()
    if normalized in SAFE_LOCATION_KEYS:
        return False
    if normalized in LOCATION_KEYS:
        return not include_exact_location
    return any(part in normalized for part in SENSITIVE_KEY_PARTS)


def _redact_url(match: re.Match[str]) -> str:
    """Redact URL credentials, sensitive query values, and webhook IDs."""
    raw = match.group(0)
    try:
        parsed = urlsplit(raw)
        host = parsed.hostname or ""
        if parsed.port:
            host = f"{host}:{parsed.port}"
        changed = parsed.username is not None or parsed.password is not None
        if changed:
            host = f"[REDACTED]@{host}"
        query: list[tuple[str, str]] = []
        for key, value in parse_qsl(parsed.query, keep_blank_values=True):
            if any(part in key.casefold() for part in SENSITIVE_QUERY_PARTS):
                query.append((key, "[REDACTED]"))
                changed = True
            else:
                query.append((key, value))
        path_parts = parsed.path.split("/")
        if "webhook" in path_parts:
            index = path_parts.index("webhook")
            if index + 1 < len(path_parts) and path_parts[index + 1]:
                path_parts[index + 1] = "[REDACTED]"
                changed = True
        if not changed:
            return raw
        return urlunsplit(
            (
                parsed.scheme,
                host,
                "/".join(path_parts),
                urlencode(query),
                parsed.fragment,
            )
        )
    except ValueError:
        return raw


def redact_text(value: str) -> tuple[str, bool]:
    """Redact credential-like substrings inside free text."""
    updated, url_count = URL_CREDENTIALS_RE.subn(r"\1[REDACTED]@", value)
    url_updated = URL_RE.sub(_redact_url, updated)
    url_changed = url_updated != updated
    updated = url_updated
    updated, bearer_count = BEARER_RE.subn("Bearer [REDACTED]", updated)
    return updated, bool(url_count or url_changed or bearer_count)


def sanitize(
    value: Any,
    *,
    include_exact_location: bool = False,
    max_string: int = 2000,
    max_items: int = 200,
) -> tuple[Any, list[str]]:
    """Return a JSON-safe, bounded, redacted value and redaction paths."""
    redactions: list[str] = []

    def walk(item: Any, path: str) -> Any:
        if isinstance(item, Mapping):
            cleaned: dict[str, Any] = {}
            for index, (raw_key, child) in enumerate(item.items()):
                if index >= max_items:
                    redactions.append(f"{path}.[truncated]")
                    break
                key = str(raw_key)
                child_path = f"{path}.{key}" if path else key
                if _is_sensitive_key(key, include_exact_location):
                    cleaned[key] = "[REDACTED]"
                    redactions.append(child_path)
                    continue
                cleaned[key] = walk(child, child_path)
            return cleaned
        if isinstance(item, Sequence) and not isinstance(
            item, str | bytes | bytearray
        ):
            output = [
                walk(child, f"{path}[{index}]")
                for index, child in enumerate(item[:max_items])
            ]
            if len(item) > max_items:
                redactions.append(f"{path}[truncated]")
            return output
        if isinstance(item, str):
            text, changed = redact_text(item[:max_string])
            if changed:
                redactions.append(path)
            if len(item) > max_string:
                redactions.append(f"{path}[truncated]")
                text += "…"
            return text
        if item is None or isinstance(item, bool | int | float):
            return item
        return str(item)[:max_string]

    return walk(value, ""), sorted(set(redactions))


def context_categories(payload: Mapping[str, Any]) -> list[str]:
    """Summarize top-level outbound context categories."""
    return sorted(
        str(key) for key, value in payload.items() if value not in (None, [], {})
    )
