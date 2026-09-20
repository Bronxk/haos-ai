"""Chat thread retention tests.

Assist opens one thread per conversation id, so an unpruned thread map is an
unbounded file that is rewritten on every save.
"""

from datetime import UTC, datetime, timedelta

from custom_components.haos_ai.const import MAX_CHAT_THREADS, RETENTION_DAYS
from custom_components.haos_ai.models import ChatMessage
from custom_components.haos_ai.storage import AdvisorStore, default_data


def _store() -> AdvisorStore:
    store = AdvisorStore.__new__(AdvisorStore)
    store.data = default_data()
    return store


def _stamp(days_ago: float) -> str:
    return (datetime.now(UTC) - timedelta(days=days_ago)).isoformat()


def _thread(store: AdvisorStore, thread_id: str, days_ago: float) -> None:
    stamp = _stamp(days_ago)
    store.data["chat_threads"][thread_id] = [
        ChatMessage(role="user", content="Hello", created_at=stamp).to_dict()
    ]
    store.data["chat_thread_meta"][thread_id] = {
        "title": thread_id,
        "created_at": stamp,
        "updated_at": stamp,
    }


def test_prune_drops_threads_past_the_retention_window() -> None:
    store = _store()
    _thread(store, "fresh", 1)
    _thread(store, "stale", RETENTION_DAYS + 5)

    store._prune()

    assert "fresh" in store.data["chat_threads"]
    assert "stale" not in store.data["chat_threads"]
    assert "stale" not in store.data["chat_thread_meta"]


def test_prune_caps_thread_count_and_keeps_most_recent() -> None:
    store = _store()
    for index in range(MAX_CHAT_THREADS + 10):
        _thread(store, f"thread-{index:03d}", days_ago=index)

    store._prune()

    assert len(store.data["chat_threads"]) == MAX_CHAT_THREADS
    # Lower index means more recent activity, so those must survive.
    assert "thread-000" in store.data["chat_threads"]
    assert f"thread-{MAX_CHAT_THREADS + 9:03d}" not in store.data["chat_threads"]
    assert set(store.data["chat_thread_meta"]) == set(store.data["chat_threads"])


def test_prune_keeps_threads_with_unreadable_timestamps() -> None:
    store = _store()
    _thread(store, "broken", 1)
    store.data["chat_thread_meta"]["broken"]["updated_at"] = "not-a-date"
    store.data["chat_threads"]["broken"][0]["created_at"] = "not-a-date"

    store._prune()

    assert "broken" in store.data["chat_threads"]


def test_prune_removes_empty_threads_and_orphaned_metadata() -> None:
    store = _store()
    store.data["chat_threads"]["empty"] = []
    store.data["chat_thread_meta"]["empty"] = {"title": "Empty"}
    store.data["chat_thread_meta"]["ghost"] = {"title": "No thread"}

    store._prune()

    assert store.data["chat_threads"] == {}
    assert store.data["chat_thread_meta"] == {}


def test_prune_drops_applied_changes_past_retention() -> None:
    store = _store()
    store.data["applied_changes"] = [
        {"id": "old", "applied_at": _stamp(RETENTION_DAYS + 1)},
        {"id": "new", "applied_at": _stamp(1)},
    ]

    store._prune()

    assert [item["id"] for item in store.data["applied_changes"]] == ["new"]


def test_prune_keeps_a_suggestion_that_was_seen_again() -> None:
    """A recurring suggestion refreshes last_seen_at, not created_at."""
    store = _store()
    store.data["suggestions"].append(
        {
            "id": "recurring",
            "status": "dismissed",
            "created_at": _stamp(RETENTION_DAYS + 30),
            "last_seen_at": _stamp(1),
        }
    )

    store._prune()

    assert [item["id"] for item in store.data["suggestions"]] == ["recurring"]


def test_prune_drops_a_suggestion_that_was_never_seen_again() -> None:
    store = _store()
    store.data["suggestions"].append(
        {
            "id": "forgotten",
            "status": "new",
            "created_at": _stamp(RETENTION_DAYS + 30),
        }
    )

    store._prune()

    assert store.data["suggestions"] == []
