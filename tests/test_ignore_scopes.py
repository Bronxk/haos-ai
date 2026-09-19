"""Ignore-scope preference tests.

Ignored things must be withheld deterministically rather than described to
the model as a request, so the stored shape has to stay predictable.
"""

from custom_components.haos_ai.storage import normalize_preferences


def test_ignore_scopes_default_to_empty_lists() -> None:
    preferences = normalize_preferences({})

    assert preferences["ignored_entities"] == []
    assert preferences["ignored_domains"] == []
    assert preferences["ignored_areas"] == []
    assert preferences["ignored_labels"] == []


def test_ignore_scopes_are_trimmed_deduplicated_and_bounded() -> None:
    preferences = normalize_preferences(
        {
            "ignored_domains": [" light ", "light", "", "  ", "switch"],
            "ignored_areas": ["bedroom"] * 3 + [f"area_{index}" for index in range(80)],
            "ignored_labels": ["x" * 200],
        }
    )

    assert preferences["ignored_domains"] == ["light", "switch"]
    assert len(preferences["ignored_areas"]) <= 50
    assert preferences["ignored_areas"][0] == "bedroom"
    assert len(preferences["ignored_labels"][0]) == 80


def test_ignore_scopes_reject_non_list_input() -> None:
    preferences = normalize_preferences(
        {"ignored_domains": "light", "ignored_areas": None, "ignored_labels": 7}
    )

    assert preferences["ignored_domains"] == []
    assert preferences["ignored_areas"] == []
    assert preferences["ignored_labels"] == []
