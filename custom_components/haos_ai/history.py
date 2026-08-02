"""Local recorder-history aggregation."""

from __future__ import annotations

from collections import Counter
from collections.abc import Iterable
from datetime import datetime
from typing import Any


def summarize_states(
    states: Iterable[Any], *, max_samples: int = 12
) -> dict[str, Any]:
    """Summarize a chronological sequence of HA State-like objects."""
    sequence = list(states)
    if not sequence:
        return {
            "samples": 0,
            "transitions": 0,
            "state_counts": {},
            "hour_histogram": {},
            "weekday_histogram": {},
            "examples": [],
        }
    state_counts: Counter[str] = Counter()
    hours: Counter[int] = Counter()
    weekdays: Counter[int] = Counter()
    transitions = 0
    previous: str | None = None
    examples: list[dict[str, Any]] = []
    for state in sequence:
        value = str(getattr(state, "state", "unknown"))
        changed: datetime | None = getattr(
            state, "last_changed", getattr(state, "last_updated", None)
        )
        state_counts[value] += 1
        if previous is not None and value != previous:
            transitions += 1
        previous = value
        if changed is not None:
            hours[changed.hour] += 1
            weekdays[changed.weekday()] += 1
            if len(examples) < max_samples:
                examples.append({"state": value, "at": changed.isoformat()})
    return {
        "samples": len(sequence),
        "transitions": transitions,
        "state_counts": dict(state_counts.most_common(12)),
        "hour_histogram": dict(sorted(hours.items())),
        "weekday_histogram": dict(sorted(weekdays.items())),
        "first_seen": examples[0]["at"] if examples else None,
        "last_seen": (
            getattr(sequence[-1], "last_changed", None).isoformat()
            if getattr(sequence[-1], "last_changed", None)
            else None
        ),
        "examples": examples,
    }


def rank_binary_correlations(
    event_times: dict[str, list[datetime]],
    *,
    window_seconds: int = 300,
    limit: int = 20,
) -> list[dict[str, Any]]:
    """Rank bounded co-occurrence candidates without external ML."""
    entities = sorted(event_times)
    matches: list[dict[str, Any]] = []
    for index, left in enumerate(entities):
        left_times = event_times[left]
        if not left_times:
            continue
        for right in entities[index + 1 :]:
            right_times = event_times[right]
            if not right_times:
                continue
            within = 0
            right_index = 0
            for left_time in left_times:
                while (
                    right_index < len(right_times)
                    and (right_times[right_index] - left_time).total_seconds()
                    < -window_seconds
                ):
                    right_index += 1
                if right_index < len(right_times) and abs(
                    (right_times[right_index] - left_time).total_seconds()
                ) <= window_seconds:
                    within += 1
            score = within / max(1, min(len(left_times), len(right_times)))
            if within >= 2:
                matches.append(
                    {
                        "left": left,
                        "right": right,
                        "co_occurrences": within,
                        "score": round(score, 3),
                        "window_seconds": window_seconds,
                    }
                )
    return sorted(
        matches,
        key=lambda item: (item["score"], item["co_occurrences"]),
        reverse=True,
    )[:limit]

