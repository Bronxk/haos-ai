"""Persistence model round-trip tests."""

from custom_components.haos_ai.models import (
    AutomationProposal,
    Evidence,
    ProposedOperation,
    Recommendation,
    RecommendationKind,
    ValidationResult,
    balance_recommendations,
)


def test_recommendation_round_trip() -> None:
    recommendation = Recommendation(
        title="Hall light",
        summary="Turn on the hall light after the door opens.",
        rationale="The events repeatedly happen together.",
        kind=RecommendationKind.AUTOMATION,
        evidence=[Evidence("history", "binary_sensor.door", "Two co-occurrences")],
        confidence=0.9,
        impact="medium",
        automation=AutomationProposal(
            {"alias": "Hall light", "triggers": [], "actions": []},
            "alias: Hall light\n",
            ValidationResult(True),
            "When the door opens, the hall light turns on.",
        ),
    )

    restored = Recommendation.from_dict(recommendation.to_dict())

    assert restored.id == recommendation.id
    assert restored.kind is RecommendationKind.AUTOMATION
    assert restored.automation is not None
    assert restored.automation.validation.valid is True
    assert restored.automation.explanation == (
        "When the door opens, the hall light turns on."
    )


def test_proposed_operation_round_trip() -> None:
    recommendation = Recommendation(
        title="Remove old bridge",
        summary="All registered entities are orphaned.",
        rationale="The integration supports device removal.",
        kind=RecommendationKind.HYGIENE,
        evidence=[Evidence("device", "device-123", "No live entities")],
        confidence=0.9,
        impact="medium",
        operation=ProposedOperation(
            type="remove_device",
            target_id="device-123",
            label="Old bridge",
            config_entry_id="entry-123",
        ),
    )

    restored = Recommendation.from_dict(recommendation.to_dict())

    assert restored.operation is not None
    assert restored.operation.type == "remove_device"
    assert restored.operation.config_entry_id == "entry-123"


def _recommendation(kind: RecommendationKind, title: str) -> Recommendation:
    return Recommendation(
        title=title,
        summary="Summary",
        rationale="Rationale",
        kind=kind,
        evidence=[Evidence("entity", "sensor.example", "Observed")],
        confidence=0.8,
        impact="medium",
    )


def test_recommendation_balance_keeps_automations_at_half_or_more() -> None:
    recommendations = [
        _recommendation(RecommendationKind.HYGIENE, f"Fix {index}")
        for index in range(5)
    ] + [
        _recommendation(RecommendationKind.AUTOMATION, f"Automation {index}")
        for index in range(2)
    ]

    balanced = balance_recommendations(recommendations)

    assert len(balanced) == 4
    assert sum(
        item.kind is RecommendationKind.AUTOMATION for item in balanced
    ) == 2


def test_recommendation_balance_keeps_limited_fixes_without_automations() -> None:
    recommendations = [
        _recommendation(RecommendationKind.HYGIENE, f"Fix {index}")
        for index in range(5)
    ]

    balanced = balance_recommendations(recommendations)

    assert len(balanced) == 3
