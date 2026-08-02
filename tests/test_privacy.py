"""Privacy boundary tests."""

from custom_components.haos_ai.privacy import (
    exclude_ignored_entities,
    redact_text,
    sanitize,
)


def test_sanitize_redacts_nested_secrets_and_location() -> None:
    payload = {
        "entity": {
            "api_key": "secret",
            "latitude": 51.0,
            "attributes": {"friendly_name": "Phone"},
        },
        "url": "https://alice:password@example.test/path",
        "authorization": "Bearer abc",
    }

    cleaned, paths = sanitize(payload)

    assert cleaned["entity"]["api_key"] == "[REDACTED]"
    assert cleaned["entity"]["latitude"] == "[REDACTED]"
    assert cleaned["url"] == "https://[REDACTED]@example.test/path"
    assert cleaned["authorization"] == "[REDACTED]"
    assert "entity.api_key" in paths
    assert "entity.latitude" in paths


def test_exact_location_can_be_explicitly_allowed() -> None:
    cleaned, paths = sanitize(
        {"latitude": 51.1, "longitude": 7.2, "gps_accuracy": 12},
        include_exact_location=True,
    )

    assert cleaned == {"latitude": 51.1, "longitude": 7.2, "gps_accuracy": 12}
    assert paths == []


def test_free_text_bearer_tokens_are_removed() -> None:
    cleaned, changed = redact_text("Authorization: Bearer abc.DEF-123")
    assert cleaned == "Authorization: Bearer [REDACTED]"
    assert changed is True


def test_webhook_and_sensitive_query_values_are_removed() -> None:
    value = (
        "Call https://ha.example/api/webhook/very-secret"
        "?token=abc&view=compact"
    )
    cleaned, changed = redact_text(value)
    assert changed is True
    assert "very-secret" not in cleaned
    assert "token=%5BREDACTED%5D" in cleaned
    assert "view=compact" in cleaned


def test_secret_assignments_and_url_fragments_are_removed() -> None:
    value = (
        "api_key=sk-test-canary password:correct-horse "
        "https://ha.example/API/WEBHOOK/path-canary#token=fragment-canary"
    )

    cleaned, changed = redact_text(value)

    assert changed is True
    assert "sk-test-canary" not in cleaned
    assert "correct-horse" not in cleaned
    assert "path-canary" not in cleaned
    assert "fragment-canary" not in cleaned
    assert cleaned.count("[REDACTED]") == 3
    assert "token=%5BREDACTED%5D" in cleaned


def test_canaries_are_removed_from_nested_free_text() -> None:
    payload = {
        "friendly_name": "Authorization: Bearer bearer-canary",
        "notes": [
            "secret=plain-canary",
            "https://user:url-canary@example.test/path",
        ],
    }

    cleaned, paths = sanitize(payload)
    serialized = str(cleaned)

    for canary in ("bearer-canary", "plain-canary", "url-canary"):
        assert canary not in serialized
    assert paths == ["friendly_name", "notes[0]", "notes[1]"]


def test_location_metadata_is_redacted_by_default() -> None:
    cleaned, paths = sanitize({"gps_accuracy": 8, "location": "51.0,7.0"})
    assert cleaned == {
        "gps_accuracy": "[REDACTED]",
        "location": "[REDACTED]",
    }
    assert paths == ["gps_accuracy", "location"]


def test_payload_is_bounded() -> None:
    cleaned, paths = sanitize({"items": list(range(210))}, max_items=10)
    assert len(cleaned["items"]) == 10
    assert "items[truncated]" in paths


def test_ignored_entities_are_removed_from_nested_context() -> None:
    cleaned = exclude_ignored_entities(
        {
            "results": [
                {"entity_id": "light.keep", "state": "on"},
                {"entity_id": "light.ignore", "state": "off"},
            ],
            "candidate_ids": ["light.keep", "light.ignore"],
        },
        {"light.ignore"},
    )

    assert cleaned == {
        "results": [{"entity_id": "light.keep", "state": "on"}],
        "candidate_ids": ["light.keep"],
    }
