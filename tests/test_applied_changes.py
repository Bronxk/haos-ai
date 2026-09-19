"""Applied-change ledger tests."""

from custom_components.haos_ai.const import MAX_APPLIED_CHANGES
from custom_components.haos_ai.models import AppliedChange
from custom_components.haos_ai.storage import AdvisorStore, default_data


def _store() -> AdvisorStore:
    store = AdvisorStore.__new__(AdvisorStore)
    store.data = default_data()
    return store


def test_recorded_change_starts_pending_and_lists_newest_first() -> None:
    store = _store()
    store.record_applied_change(
        AppliedChange(kind="create_automation", target_id="a1", label="First")
    )
    store.record_applied_change(
        AppliedChange(kind="remove_entity", target_id="sensor.x", label="Second")
    )

    listed = store.list_applied_changes()

    assert [item["label"] for item in listed] == ["Second", "First"]
    assert all(item["outcome"] == "pending" for item in listed)
    assert all(item["checked_at"] is None for item in listed)


def test_set_applied_outcome_updates_only_known_ids_and_outcomes() -> None:
    store = _store()
    recorded = store.record_applied_change(
        AppliedChange(kind="update_automation", target_id="a1", label="Draft")
    )

    assert store.set_applied_outcome(recorded["id"], "not-an-outcome") is None
    assert store.set_applied_outcome("missing", "kept") is None

    updated = store.set_applied_outcome(recorded["id"], "kept", "Still enabled")

    assert updated is not None
    assert updated["outcome"] == "kept"
    assert updated["outcome_detail"] == "Still enabled"
    assert updated["checked_at"] is not None


def test_applied_change_ledger_is_bounded() -> None:
    store = _store()
    for index in range(MAX_APPLIED_CHANGES + 25):
        store.record_applied_change(
            AppliedChange(
                kind="remove_entity",
                target_id=f"sensor.s{index}",
                label=f"Item {index}",
            )
        )

    assert len(store.data["applied_changes"]) == MAX_APPLIED_CHANGES
    assert store.list_applied_changes()[0]["target_id"] == (
        f"sensor.s{MAX_APPLIED_CHANGES + 24}"
    )
