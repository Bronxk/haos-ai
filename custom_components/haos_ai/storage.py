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
    APPLIED_OUTCOMES,
    AUTOMATION_COMPLEXITIES,
    DEFAULT_ADVISOR_MODE,
    DEFAULT_AUTOMATION_COMPLEXITY,
    DEFAULT_CHANGE_PERMISSIONS,
    DEFAULT_MONTHLY_TOKEN_BUDGET,
    DEFAULT_SCAN_DEPTH,
    MAX_APPLIED_CHANGES,
    MAX_CHAT_MESSAGES,
    MAX_CHAT_THREADS,
    MAX_MONTHLY_TOKEN_BUDGET,
    MAX_SUGGESTIONS,
    RETENTION_DAYS,
    SCAN_DEPTHS,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .models import AppliedChange, ChatMessage, PrivacyReceipt, Recommendation


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
            "ignored_domains": [],
            "ignored_areas": [],
            "ignored_labels": [],
            "notes": [],
            "advisor_mode": DEFAULT_ADVISOR_MODE,
            "scan_depth": DEFAULT_SCAN_DEPTH,
            "automation_complexity": DEFAULT_AUTOMATION_COMPLEXITY,
            "fix_existing_first": True,
            "avoid_new_hardware": True,
            "monthly_token_budget": DEFAULT_MONTHLY_TOKEN_BUDGET,
            "dismissal_feedback": [],
            "change_permissions": dict(DEFAULT_CHANGE_PERMISSIONS),
        },
        "privacy_receipts": [],
        "usage_months": {},
        "scan_runs": [],
        "applied_changes": [],
    }


def _bounded_id_list(values: Any, *, limit: int, length: int) -> list[str]:
    """Return a deduplicated, trimmed list of identifier-like strings."""
    if not isinstance(values, list | tuple):
        return []
    return list(
        dict.fromkeys(
            str(value).strip()[:length]
            for value in values[:limit]
            if str(value).strip()
        )
    )


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
    try:
        budget = int(incoming.get("monthly_token_budget", 0) or 0)
    except (TypeError, ValueError):
        budget = DEFAULT_MONTHLY_TOKEN_BUDGET
    budget = max(0, min(budget, MAX_MONTHLY_TOKEN_BUDGET))
    return {
        "quiet_hours": quiet_hours,
        "goals": [str(value)[:200] for value in incoming.get("goals", [])[:20]],
        "ignored_categories": [
            str(value)[:80] for value in incoming.get("ignored_categories", [])[:30]
        ],
        "ignored_entities": _bounded_id_list(
            incoming.get("ignored_entities", []), limit=200, length=120
        ),
        "ignored_domains": _bounded_id_list(
            incoming.get("ignored_domains", []), limit=50, length=60
        ),
        "ignored_areas": _bounded_id_list(
            incoming.get("ignored_areas", []), limit=50, length=80
        ),
        "ignored_labels": _bounded_id_list(
            incoming.get("ignored_labels", []), limit=50, length=80
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
        "monthly_token_budget": budget,
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
            self.data["applied_changes"] = [
                item
                for item in loaded.get("applied_changes", [])
                if isinstance(item, dict)
            ]
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

        def still_relevant(item: dict[str, Any]) -> bool:
            """Expire a suggestion on its newest activity, not on first sight.

            A recurring suggestion refreshes ``last_seen_at`` while its
            ``created_at`` stays fixed. Pruning on ``created_at`` therefore
            deleted suggestions the user had already dismissed, and the next
            scan recreated them as new and re-notified.
            """
            try:
                stamp = item.get("last_seen_at") or item["created_at"]
                return datetime.fromisoformat(str(stamp)) >= cutoff
            except (KeyError, TypeError, ValueError):
                return True

        suggestions = [
            item
            for item in self.data.get("suggestions", [])
            if isinstance(item, dict) and still_relevant(item)
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
        applied = [
            item
            for item in self.data.get("applied_changes", [])
            if isinstance(item, dict)
            and recent({"created_at": item.get("applied_at")})
        ]
        self.data["applied_changes"] = applied[-MAX_APPLIED_CHANGES:]
        self._prune_threads(cutoff)

    def _prune_threads(self, cutoff: datetime) -> None:
        """Drop malformed, expired, and least recently used chat threads.

        Assist creates one thread per conversation id, so an unbounded thread
        map would grow forever and be rewritten on every save.
        """
        threads: dict[str, Any] = self.data.setdefault("chat_threads", {})
        meta: dict[str, Any] = self.data.setdefault("chat_thread_meta", {})

        def last_activity(thread_id: str, messages: list[Any]) -> str:
            entry = meta.get(thread_id)
            if isinstance(entry, dict) and entry.get("updated_at"):
                return str(entry["updated_at"])
            for message in reversed(messages):
                if isinstance(message, dict) and message.get("created_at"):
                    return str(message["created_at"])
            return ""

        surviving: list[tuple[str, str]] = []
        for thread_id, messages in list(threads.items()):
            if not isinstance(messages, list) or not messages:
                threads.pop(thread_id, None)
                meta.pop(thread_id, None)
                continue
            threads[thread_id] = messages[-MAX_CHAT_MESSAGES:]
            stamp = last_activity(thread_id, threads[thread_id])
            try:
                expired = datetime.fromisoformat(stamp) < cutoff
            except (TypeError, ValueError):
                # An unparsable timestamp must not silently delete a thread.
                expired = False
            if expired:
                threads.pop(thread_id, None)
                meta.pop(thread_id, None)
                continue
            surviving.append((thread_id, stamp))

        if len(surviving) > MAX_CHAT_THREADS:
            surviving.sort(key=lambda item: item[1])
            for thread_id, _ in surviving[: len(surviving) - MAX_CHAT_THREADS]:
                threads.pop(thread_id, None)
                meta.pop(thread_id, None)

        for thread_id in list(meta):
            if thread_id not in threads:
                meta.pop(thread_id, None)

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
        item = receipt.to_dict()
        self.data["privacy_receipts"].append(item)
        usage = item.get("usage")
        if isinstance(usage, dict) and usage:
            created_at = str(item.get("created_at", ""))
            self._add_month_usage(created_at, usage)
            self._count_month_request(created_at)

    def set_receipt_usage(self, receipt_id: str, usage: dict[str, int]) -> None:
        """Finalize a receipt's token usage and roll it into the month total.

        A scan receipt is stored before the provider call so the request stays
        auditable, which means its usage arrives later and may cover only part
        of the work when a later call failed. The month rollup is adjusted by
        the difference, so repeated calls for one receipt cannot double-count.
        """
        stored = self.get_receipt(receipt_id)
        if stored is None:
            return
        previous = stored.get("usage")
        if not isinstance(previous, dict):
            previous = {}
        finalized: dict[str, int] = {}
        for key, value in (usage or {}).items():
            try:
                finalized[str(key)] = int(value)
            except (TypeError, ValueError):
                continue
        stored["usage"] = finalized
        created_at = str(stored.get("created_at", ""))
        delta: dict[str, int] = {}
        for key in set(finalized) | set(previous):
            try:
                change = int(finalized.get(key, 0) or 0) - int(
                    previous.get(key, 0) or 0
                )
            except (TypeError, ValueError):
                continue
            if change:
                delta[key] = change
        if delta:
            self._add_month_usage(created_at, delta)
        if finalized and not previous:
            self._count_month_request(created_at)

    def _month_usage(self, created_at: str) -> dict[str, int] | None:
        """Return the bounded per-month usage rollup entry for a receipt."""
        month = str(created_at)[:7]
        if len(month) != 7:
            return None
        months = self.data.setdefault("usage_months", {})
        entry = months.setdefault(
            month, {"input_tokens": 0, "output_tokens": 0, "requests": 0}
        )
        for stale in sorted(months)[:-24]:
            months.pop(stale, None)
        return entry

    def _add_month_usage(self, created_at: str, usage: dict[str, Any]) -> None:
        """Add a token delta to the month rollup, never going below zero."""
        entry = self._month_usage(created_at)
        if entry is None:
            return
        try:
            entry["input_tokens"] = max(
                0, entry["input_tokens"] + int(usage.get("input_tokens", 0) or 0)
            )
            entry["output_tokens"] = max(
                0, entry["output_tokens"] + int(usage.get("output_tokens", 0) or 0)
            )
        except (TypeError, ValueError):
            return

    def _count_month_request(self, created_at: str) -> None:
        entry = self._month_usage(created_at)
        if entry is not None:
            entry["requests"] += 1

    def monthly_usage(self, now: datetime | None = None) -> dict[str, int]:
        """Aggregate provider token usage for the current UTC month.

        The rollup is authoritative because it survives receipt pruning. A
        store written before the rollup existed falls back to scanning its
        retained receipts.
        """
        moment = now or datetime.now(UTC)
        prefix = f"{moment.year:04d}-{moment.month:02d}"
        months = self.data.get("usage_months")
        entry = months.get(prefix) if isinstance(months, dict) else None
        if isinstance(entry, dict):
            try:
                input_tokens = max(0, int(entry.get("input_tokens", 0) or 0))
                output_tokens = max(0, int(entry.get("output_tokens", 0) or 0))
                requests = max(0, int(entry.get("requests", 0) or 0))
            except (TypeError, ValueError):
                input_tokens = output_tokens = requests = 0
            return {
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "total_tokens": input_tokens + output_tokens,
                "requests": requests,
            }
        input_tokens = 0
        output_tokens = 0
        requests = 0
        for item in self.data.get("privacy_receipts", []):
            if not isinstance(item, dict):
                continue
            if not str(item.get("created_at", "")).startswith(prefix):
                continue
            usage = item.get("usage") or {}
            if not isinstance(usage, dict):
                continue
            requests += 1
            try:
                input_tokens += int(usage.get("input_tokens", 0) or 0)
                output_tokens += int(usage.get("output_tokens", 0) or 0)
            except (TypeError, ValueError):
                continue
        return {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": input_tokens + output_tokens,
            "requests": requests,
        }

    def record_applied_change(self, change: AppliedChange) -> dict[str, Any]:
        """Persist one approved change so its outcome can be re-checked."""
        serialized = change.to_dict()
        self.data.setdefault("applied_changes", []).append(serialized)
        self.data["applied_changes"] = self.data["applied_changes"][
            -MAX_APPLIED_CHANGES:
        ]
        return serialized

    def list_applied_changes(self) -> list[dict[str, Any]]:
        """Return applied changes newest first."""
        return [
            item
            for item in reversed(self.data.get("applied_changes", []))
            if isinstance(item, dict)
        ]

    def set_applied_outcome(
        self, change_id: str, outcome: str, detail: str = ""
    ) -> dict[str, Any] | None:
        """Record the observed result of one previously applied change."""
        if outcome not in APPLIED_OUTCOMES:
            return None
        for item in self.data.get("applied_changes", []):
            if isinstance(item, dict) and item.get("id") == change_id:
                item["outcome"] = outcome
                item["outcome_detail"] = detail[:240]
                item["checked_at"] = datetime.now(UTC).isoformat()
                return item
        return None

    def get_receipt(self, receipt_id: str) -> dict[str, Any] | None:
        return next(
            (
                item
                for item in self.data["privacy_receipts"]
                if item.get("id") == receipt_id
            ),
            None,
        )
