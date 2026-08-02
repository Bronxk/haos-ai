"""Local advisor storage behavior tests."""

from custom_components.haos_ai.models import (
    ChatMessage,
    Evidence,
    Recommendation,
    RecommendationKind,
)
from custom_components.haos_ai.storage import (
    AdvisorStore,
    default_data,
    normalize_preferences,
)


def _recommendation(title: str, *, kind: RecommendationKind) -> Recommendation:
    return Recommendation(
        title=title,
        summary="Summary",
        rationale="Rationale",
        kind=kind,
        evidence=[Evidence("entity", "sensor.example", "Observed")],
        confidence=0.8,
        impact="medium",
    )


def test_add_suggestions_deduplicates_kind_and_normalized_title() -> None:
    store = AdvisorStore.__new__(AdvisorStore)
    store.data = default_data()
    first = _recommendation(
        "Turn on the hall light", kind=RecommendationKind.AUTOMATION
    )
    repeated = _recommendation(
        "  turn ON  the hall LIGHT ", kind=RecommendationKind.AUTOMATION
    )
    different_kind = _recommendation(
        "Turn on the hall light", kind=RecommendationKind.HYGIENE
    )

    assert store.add_suggestions([first]) == [first]
    assert store.add_suggestions([repeated, different_kind]) == [different_kind]
    assert len(store.data["suggestions"]) == 2
    refreshed = store.get_suggestion(first.id)
    assert refreshed is not None
    assert refreshed["occurrences"] == 2
    assert refreshed["summary"] == repeated.summary


def test_add_suggestions_also_rejects_reused_ids() -> None:
    store = AdvisorStore.__new__(AdvisorStore)
    store.data = default_data()
    first = _recommendation("First", kind=RecommendationKind.HYGIENE)
    reused = _recommendation("Second", kind=RecommendationKind.HYGIENE)
    reused.id = first.id

    store.add_suggestions([first])

    assert store.add_suggestions([reused]) == []


def test_dismissal_feedback_is_bounded_and_structured() -> None:
    store = AdvisorStore.__new__(AdvisorStore)
    store.data = default_data()
    item = _recommendation("Skip this", kind=RecommendationKind.HYGIENE)
    store.add_suggestions([item])

    for index in range(35):
        store.record_dismissal_feedback(
            store.get_suggestion(item.id),  # type: ignore[arg-type]
            f"Not relevant {index}",
        )

    feedback = store.data["preferences"]["dismissal_feedback"]
    assert len(feedback) == 30
    assert feedback[0]["reason"] == "Not relevant 5"
    assert feedback[-1]["title"] == "Skip this"


def test_chat_threads_can_be_listed_renamed_and_deleted() -> None:
    store = AdvisorStore.__new__(AdvisorStore)
    store.data = default_data()
    store.add_message("thread-a", ChatMessage(role="user", content="Hall lights?"))
    store.add_message("thread-a", ChatMessage(role="assistant", content="I can help."))

    assert store.list_threads()[0]["title"] == "Hall lights?"
    assert store.list_threads()[0]["message_count"] == 2
    assert store.rename_thread("thread-a", "Entry routine")
    assert store.list_threads()[0]["title"] == "Entry routine"
    assert store.delete_thread("thread-a")
    assert store.list_threads() == []


def test_recurring_suggestions_resurface_by_last_seen_time() -> None:
    store = AdvisorStore.__new__(AdvisorStore)
    store.data = default_data()
    recurring = _recommendation("Recurring", kind=RecommendationKind.HYGIENE)
    newer = _recommendation("Newer", kind=RecommendationKind.HYGIENE)
    recurring.created_at = "2026-01-01T00:00:00+00:00"
    recurring.last_seen_at = recurring.created_at
    newer.created_at = "2026-02-01T00:00:00+00:00"
    newer.last_seen_at = newer.created_at
    store.add_suggestions([recurring, newer])

    repeated = _recommendation("Recurring", kind=RecommendationKind.HYGIENE)
    repeated.created_at = "2026-03-01T00:00:00+00:00"
    store.add_suggestions([repeated])

    assert store.list_suggestions()[0]["id"] == recurring.id


def test_preferences_are_bounded_and_preserve_pasted_entity_ids() -> None:
    preferences = normalize_preferences(
        {
            "goals": ["automation_cleanup"],
            "ignored_entities": [
                "sensor.available",
                "binary_sensor.temporarily_missing",
                "sensor.available",
            ],
            "advisor_mode": "unexpected",
            "scan_depth": "thorough",
            "automation_complexity": "advanced",
            "quiet_hours": {"start": "22:00", "end": "07:00"},
        }
    )

    assert preferences["ignored_entities"] == [
        "sensor.available",
        "binary_sensor.temporarily_missing",
    ]
    assert preferences["advisor_mode"] == "balanced"
    assert preferences["scan_depth"] == "thorough"
    assert preferences["automation_complexity"] == "advanced"
    assert preferences["quiet_hours"] == {"start": "22:00", "end": "07:00"}


def test_change_permissions_are_off_by_default_and_bounded() -> None:
    defaults = normalize_preferences({})
    enabled = normalize_preferences(
        {
            "advisor_mode": "automation_hell",
            "change_permissions": {
                "create_automations": True,
                "remove_devices": True,
                "unknown_future_permission": True,
            },
        }
    )

    assert not any(defaults["change_permissions"].values())
    assert enabled["advisor_mode"] == "automation_hell"
    assert enabled["change_permissions"] == {
        "create_automations": True,
        "update_automations": False,
        "remove_entities": False,
        "remove_devices": True,
    }


def test_clear_suggestions_can_target_one_view() -> None:
    store = AdvisorStore.__new__(AdvisorStore)
    store.data = default_data()
    first = _recommendation("New", kind=RecommendationKind.HYGIENE)
    saved = _recommendation("Saved", kind=RecommendationKind.HYGIENE)
    saved.status = "saved"  # type: ignore[assignment]
    store.add_suggestions([first, saved])

    assert store.clear_suggestions("new") == 1
    assert [item["title"] for item in store.data["suggestions"]] == ["Saved"]
