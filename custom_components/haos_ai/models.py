"""Serializable models used by HAOS AI."""

from __future__ import annotations

import uuid
from dataclasses import asdict, dataclass, field
from datetime import UTC, datetime
from enum import StrEnum
from typing import Any


def utcnow_iso() -> str:
    """Return a stable UTC timestamp."""
    return datetime.now(UTC).isoformat()


class RecommendationKind(StrEnum):
    """Recommendation kinds."""

    AUTOMATION = "automation"
    HYGIENE = "hygiene"


class RecommendationStatus(StrEnum):
    """Recommendation lifecycle."""

    NEW = "new"
    SAVED = "saved"
    DISMISSED = "dismissed"


@dataclass(slots=True)
class Evidence:
    """Evidence supporting a recommendation."""

    source_type: str
    source_id: str
    observation: str
    period: str | None = None

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Evidence:
        return cls(
            source_type=str(data.get("source_type", "unknown")),
            source_id=str(data.get("source_id", "")),
            observation=str(data.get("observation", "")),
            period=str(data["period"]) if data.get("period") else None,
        )


@dataclass(slots=True)
class ValidationResult:
    """Home Assistant automation validation result."""

    valid: bool
    errors: dict[str, str] = field(default_factory=dict)


@dataclass(slots=True)
class AutomationProposal:
    """Proposed Home Assistant automation."""

    config: dict[str, Any]
    yaml: str = ""
    validation: ValidationResult = field(
        default_factory=lambda: ValidationResult(valid=False)
    )
    explanation: str = ""


@dataclass(slots=True)
class Recommendation:
    """A persisted advisor recommendation."""

    title: str
    summary: str
    rationale: str
    kind: RecommendationKind
    evidence: list[Evidence]
    confidence: float
    impact: str
    id: str = field(default_factory=lambda: uuid.uuid4().hex)
    status: RecommendationStatus = RecommendationStatus.NEW
    created_at: str = field(default_factory=utcnow_iso)
    scan_id: str | None = None
    parent_id: str | None = None
    privacy_receipt_id: str | None = None
    automation: AutomationProposal | None = None
    dismissal_reason: str | None = None
    occurrences: int = 1
    last_seen_at: str = field(default_factory=utcnow_iso)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Recommendation:
        automation = None
        if raw := data.get("automation"):
            raw_validation = raw.get("validation", {})
            automation = AutomationProposal(
                config=dict(raw.get("config", {})),
                yaml=str(raw.get("yaml", "")),
                validation=ValidationResult(
                    valid=bool(raw_validation.get("valid", False)),
                    errors=dict(raw_validation.get("errors", {})),
                ),
                explanation=str(
                    raw.get("explanation")
                    or raw.get("config", {}).get("description")
                    or ""
                ),
            )
        return cls(
            id=str(data.get("id") or uuid.uuid4().hex),
            title=str(data.get("title", "Untitled suggestion")),
            summary=str(data.get("summary", "")),
            rationale=str(data.get("rationale", "")),
            kind=RecommendationKind(data.get("kind", "hygiene")),
            evidence=[Evidence.from_dict(item) for item in data.get("evidence", [])],
            confidence=max(0.0, min(1.0, float(data.get("confidence", 0.5)))),
            impact=str(data.get("impact", "medium")),
            status=RecommendationStatus(data.get("status", "new")),
            created_at=str(data.get("created_at") or utcnow_iso()),
            scan_id=data.get("scan_id"),
            parent_id=data.get("parent_id"),
            privacy_receipt_id=data.get("privacy_receipt_id"),
            automation=automation,
            dismissal_reason=data.get("dismissal_reason"),
            occurrences=max(1, int(data.get("occurrences", 1))),
            last_seen_at=str(
                data.get("last_seen_at")
                or data.get("created_at")
                or utcnow_iso()
            ),
        )


def balance_recommendations(
    recommendations: list[Recommendation],
    *,
    max_total: int = 8,
    max_hygiene: int = 3,
) -> list[Recommendation]:
    """Keep fixes useful without letting them dominate automation scans."""
    automations = [
        item
        for item in recommendations
        if item.kind is RecommendationKind.AUTOMATION
    ]
    hygiene = [
        item for item in recommendations if item.kind is RecommendationKind.HYGIENE
    ]
    if not automations:
        return hygiene[:max_hygiene]

    allowed_hygiene = {
        item.id for item in hygiene[: min(max_hygiene, len(automations))]
    }
    return [
        item
        for item in recommendations
        if item.kind is RecommendationKind.AUTOMATION or item.id in allowed_hygiene
    ][:max_total]


@dataclass(slots=True)
class ChatMessage:
    """A local chat message."""

    role: str
    content: str
    created_at: str = field(default_factory=utcnow_iso)
    id: str = field(default_factory=lambda: uuid.uuid4().hex)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class PrivacyReceipt:
    """Audit receipt for context sent to a provider."""

    provider: str
    model: str
    purpose: str
    categories: list[str]
    redactions: list[str]
    payload_preview: dict[str, Any]
    usage: dict[str, int] = field(default_factory=dict)
    id: str = field(default_factory=lambda: uuid.uuid4().hex)
    created_at: str = field(default_factory=utcnow_iso)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)
