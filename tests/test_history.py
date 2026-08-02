"""Local history analysis tests."""

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from custom_components.haos_ai.history import (
    rank_binary_correlations,
    summarize_states,
)


@dataclass
class FakeState:
    state: str
    last_changed: datetime


def test_summarize_states_counts_transitions() -> None:
    start = datetime(2026, 7, 1, 21, tzinfo=UTC)
    states = [
        FakeState("off", start),
        FakeState("on", start + timedelta(minutes=1)),
        FakeState("on", start + timedelta(minutes=2)),
        FakeState("off", start + timedelta(minutes=3)),
    ]

    summary = summarize_states(states)

    assert summary["samples"] == 4
    assert summary["transitions"] == 2
    assert summary["state_counts"] == {"off": 2, "on": 2}
    assert summary["hour_histogram"] == {21: 4}


def test_correlations_require_repeat_evidence() -> None:
    start = datetime(2026, 7, 1, tzinfo=UTC)
    times = {
        "binary_sensor.door": [start, start + timedelta(hours=1)],
        "light.hall": [
            start + timedelta(seconds=15),
            start + timedelta(hours=1, seconds=20),
        ],
        "switch.noise": [start + timedelta(hours=5)],
    }

    matches = rank_binary_correlations(times, window_seconds=60)

    assert len(matches) == 1
    assert matches[0]["left"] == "binary_sensor.door"
    assert matches[0]["right"] == "light.hall"
    assert matches[0]["score"] == 1.0
