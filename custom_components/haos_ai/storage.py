"""Versioned local persistence for HAOS AI."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any

try:
    from homeassistant.core import HomeAssistant
    from homeassistant.helpers.storage import Store
except ImportError:  # pragma: no cover - allows pure unit tests outside HA
    HomeAssistant = Any  # type: ignore[misc,assignment]
    Store = Any  # type: ignore[misc,assignment]

from .const import (
    ADVISOR_MODES,
    AUTOMATION_COMPLEXITIES,
    DEFAULT_ADVISOR_MODE,
    DEFAULT_AUTOMATION_COMPLEXITY,
    DEFAULT_CHANGE_PERMISSIONS,
    DEFAULT_SCAN_DEPTH,
    MAX_CHAT_MESSAGES,
    MAX_SUGGESTIONS,
    RETENTION_DAYS,
    SCAN_DEPTHS,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .models import ChatMessage, PrivacyReceipt, Recommendation


def _suggestion_fingerprint(item: dict[str, Any]) -> tuple[str, str]:
    """Return a stable identity for semantically repeated suggestions."""
    kind = str(item.get("kind", "")).casefold()
    title = " ".join(str(item.get("title", "")).casefold().split())
    return kind, title


def default_data() -> dict[str, Any]:
    """Return empty persisted state."""
    return {
        "suggestions": [],
        "chat_threads": {},
        "chat_thread_meta": {},
        "preferences": {
            "quiet_hours": None,
            "goals": [],
            "ignored_categories": [],
            "ignored_entities": [],
            "notes": [],
            "advisor_mode": DEFAULT_ADVISOR_MODE,
            "scan_depth": DEFAULT_SCAN_DEPTH,
            "automation_complexity": DEFAULT_AUTOMATION_COMPLEXITY,
            "fix_existing_first": True,
            "avoid_new_hardware": True,
            "dismissal_feedback": [],
            "change_permissions": dict(DEFAULT_CHANGE_PERMISSIONS),
        },
        "privacy_receipts": [],
        "scan_runs": [],
    }


def normalize_preferences(
    incoming: dict[str, Any], *, dismissal_feedback: list[Any] | None = None
) -> dict[str, Any]:
    """Return bounded, backwards-compatible advisor preferences."""
    quiet_hours = incoming.get("quiet_hours")
    if not isinstance(quiet_hours, dict):
        quiet_hours = None
    elif not all(
        isinstance(quiet_hours.get(key), str) for key in ("start", "end")
    ):
        quiet_hours = None

    advisor_mode = str(incoming.get("advisor_mode", DEFAULT_ADVISOR_MODE))
    scan_depth = str(incoming.get("scan_depth", DEFAULT_SCAN_DEPTH))
    complexity = str(
        incoming.get("automation_complexity", DEFAULT_AUTOMATION_COMPLEXITY)
    )
    raw_permissions = incoming.get("change_permissions", {})
    if not isinstance(raw_permissions, dict):
        raw_permissions = {}
    return {
        "quiet_hours": quiet_hours,
        "goals": [str(value)[:200] for value in incoming.get("goals", [])[:20]],
        "ignored_categories": [
            str(value)[:80] for value in incoming.get("ignored_categories", [])[:30]
        ],
        "ignored_entities": list(
            dict.fromkeys(
                str(value).strip()[:120]
                for value in incoming.get("ignored_entities", [])[:200]
                if str(value).strip()
            )
        ),
        "notes": [str(value)[:500] for value in incoming.get("notes", [])[:30]],
        "advisor_mode": (
            advisor_mode if advisor_mode in ADVISOR_MODES else DEFAULT_ADVISOR_MODE
        ),
        "scan_depth": scan_depth if scan_depth in SCAN_DEPTHS else DEFAULT_SCAN_DEPTH,
        "automation_complexity": (
            complexity
            if complexity in AUTOMATION_COMPLEXITIES
            else DEFAULT_AUTOMATION_COMPLEXITY
        ),
        "fix_existing_first": bool(incoming.get("fix_existing_first", True)),
        "avoid_new_hardware": bool(incoming.get("avoid_new_hardware", True)),
        "change_permissions": {
            key: bool(raw_permissions.get(key, default))
            for key, default in DEFAULT_CHANGE_PERMISSIONS.items()
        },
        "dismissal_feedback": list(
            dismissal_feedback
            if dismissal_feedback is not None
            else incoming.get("dismissal_feedback", [])
        )[-30:],
    }


class AdvisorStore:
    """Small versioned store with bounded retention."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store = Store[dict[str, Any]](hass, STORAGE_VERSION, STORAGE_KEY)
        self.data = default_data()

    async def async_load(self) -> None:
        loaded = await self._store.async_load()
        if isinstance(loaded, dict):
            self.data = {**default_data(), **loaded}
            self.data["preferences"] = normalize_preferences(
                {
                    **default_data()["preferences"],
                    **loaded.get("preferences", {}),
                }
            )
            self.data["chat_thread_meta"] = loaded.get(
                "chat_thread_meta", {}
            )
        self._prune()

    async def async_save(self) -> None:
        self._prune()
        await self._store.async_save(self.data)

    def _prune(self) -> None:
        cutoff = datetime.now(UTC) - timedelta(days=RETENTION_DAYS)

        def recent(item: dict[str, Any]) -> bool:
            try:
                return datetime.fromisoformat(item["created_at"]) >= cutoff
            except (KeyError, TypeError, ValueError):
                return True

        suggestions = [
            item
            for item in self.data.get("suggestions", [])
            if isinstance(item, dict) and recent(item)
        ]
        self.data["suggestions"] = suggestions[-MAX_SUGGESTIONS:]
        receipts = [
            item
            for item in self.data.get("privacy_receipts", [])
            if isinstance(item, dict) and recent(item)
        ]
        self.data["privacy_receipts"] = receipts[-MAX_SUGGESTIONS:]
        scan_runs = [
            item
            for item in self.data.get("scan_runs", [])
            if isinstance(item, dict) and recent(item)
        ]
        self.data["scan_runs"] = scan_runs[-MAX_SUGGESTIONS:]
        for thread_id, messages in list(self.data.get("chat_threads", {}).items()):
            if not isinstance(messages, list):
                self.data["chat_threads"].pop(thread_id, None)
                self.data["chat_thread_meta"].pop(thread_id, None)
                continue
            self.data["chat_threads"][thread_id] = messages[-MAX_CHAT_MESSAGES:]

    def list_suggestions(self, status: str | None = None) -> list[dict[str, Any]]:
        items = sorted(
            self.data["suggestions"],
            key=lambda item: str(
                item.get("last_seen_at") or item.get("created_at") or ""
            ),
            reverse=True,
        )
        if status:
            items = [item for item in items if item.get("status") == status]
        return items

    def get_suggestion(self, suggestion_id: str) -> dict[str, Any] | None:
        return next(
            (
                item
                for item in self.data["suggestions"]
                if item.get("id") == suggestion_id
            ),
            None,
        )

    def add_suggestions(
        self, suggestions: list[Recommendation]
    ) -> list[Recommendation]:
        """Persist new suggestions and refresh recurrence data for known ones."""
        existing = {item.get("id") for item in self.data["suggestions"]}
        fingerprints = {
            _suggestion_fingerprint(item): item
            for item in self.data["suggestions"]
            if isinstance(item, dict)
        }
        added: list[Recommendation] = []
        for item in suggestions:
            serialized = item.to_dict()
            fingerprint = _suggestion_fingerprint(serialized)
            if item.id in existing or not fingerprint[1]:
                continue
            if previous := fingerprints.get(fingerprint):
                previous.update(
                    {
                        "summary": serialized["summary"],
                        "rationale": serialized["rationale"],
                        "evidence": serialized["evidence"],
                        "confidence": serialized["confidence"],
                        "impact": serialized["impact"],
                        "scan_id": serialized["scan_id"],
                        "privacy_receipt_id": serialized["privacy_receipt_id"],
                        "automation": serialized["automation"],
                        "occurrences": max(
                            1, int(previous.get("occurrences", 1))
                        )
                        + 1,
                        "last_seen_at": serialized["created_at"],
                    }
                )
                continue
            self.data["suggestions"].append(serialized)
            existing.add(item.id)
            fingerprints[fingerprint] = serialized
            added.append(item)
        return added

    def update_suggestion(
        self, suggestion_id: str, status: str, reason: str | None = None
    ) -> dict[str, Any] | None:
        item = self.get_suggestion(suggestion_id)
        if item is None:
            return None
        item["status"] = status
        item["dismissal_reason"] = reason
        return item

    def clear_suggestions(self, status: str | None = None) -> int:
        """Remove suggestions in one inbox view and return the count."""
        before = len(self.data["suggestions"])
        if status is None:
            self.data["suggestions"] = []
        else:
            self.data["suggestions"] = [
                item
                for item in self.data["suggestions"]
                if item.get("status") != status
            ]
        return before - len(self.data["suggestions"])

    def record_dismissal_feedback(
        self, item: dict[str, Any], reason: str
    ) -> None:
        """Keep bounded structured feedback available to future scans."""
        feedback = self.data["preferences"].setdefault(
            "dismissal_feedback", []
        )
        feedback.append(
            {
                "kind": str(item.get("kind", ""))[:40],
                "title": str(item.get("title", ""))[:120],
                "reason": reason[:240],
                "created_at": datetime.now(UTC).isoformat(),
            }
        )
        self.data["preferences"]["dismissal_feedback"] = feedback[-30:]

    def add_message(self, thread_id: str, message: ChatMessage) -> None:
        self.data["chat_threads"].setdefault(thread_id, []).append(message.to_dict())
        meta = self.data["chat_thread_meta"].setdefault(
            thread_id,
            {
                "title": "New conversation",
                "created_at": message.created_at,
            },
        )
        if message.role == "user" and meta["title"] == "New conversation":
            meta["title"] = message.content.strip().splitlines()[0][:60]
        meta["updated_at"] = message.created_at

    def get_thread(self, thread_id: str) -> list[dict[str, Any]]:
        return list(self.data["chat_threads"].get(thread_id, []))

    def list_threads(self) -> list[dict[str, Any]]:
        """Return recent chat thread metadata without message bodies."""
        rows: list[dict[str, Any]] = []
        for thread_id, messages in self.data["chat_threads"].items():
            if not isinstance(messages, list):
                continue
            meta = self.data["chat_thread_meta"].get(thread_id, {})
            last = messages[-1] if messages else {}
            rows.append(
                {
                    "id": thread_id,
                    "title": meta.get("title", "Conversation"),
                    "created_at": meta.get(
                        "created_at", last.get("created_at")
                    ),
                    "updated_at": meta.get(
                        "updated_at", last.get("created_at")
                    ),
                    "message_count": len(messages),
                }
            )
        return sorted(
            rows,
            key=lambda item: str(item.get("updated_at") or ""),
            reverse=True,
        )

    def rename_thread(self, thread_id: str, title: str) -> bool:
        if thread_id not in self.data["chat_threads"]:
            return False
        meta = self.data["chat_thread_meta"].setdefault(thread_id, {})
        meta["title"] = title.strip()[:60] or "Conversation"
        return True

    def delete_thread(self, thread_id: str) -> bool:
        deleted = self.data["chat_threads"].pop(thread_id, None) is not None
        self.data["chat_thread_meta"].pop(thread_id, None)
        return deleted

    def list_receipt_summaries(self) -> list[dict[str, Any]]:
        """Return privacy receipt metadata without outbound payloads."""
        return [
            {
                "id": item.get("id"),
                "created_at": item.get("created_at"),
                "provider": item.get("provider"),
                "model": item.get("model"),
                "purpose": item.get("purpose"),
                "categories": item.get("categories", []),
                "redaction_count": len(item.get("redactions", [])),
                "usage": item.get("usage", {}),
            }
            for item in reversed(self.data["privacy_receipts"])
            if isinstance(item, dict)
        ]

    def add_receipt(self, receipt: PrivacyReceipt) -> None:
        self.data["privacy_receipts"].append(receipt.to_dict())

    def get_receipt(self, receipt_id: str) -> dict[str, Any] | None:
        return next(
            (
                item
                for item in self.data["privacy_receipts"]
                if item.get("id") == receipt_id
            ),
            None,
        )
