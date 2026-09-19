"""Monthly token budget accounting tests."""

from datetime import UTC, datetime

from custom_components.haos_ai.const import (
    DEFAULT_MONTHLY_TOKEN_BUDGET,
    MAX_MONTHLY_TOKEN_BUDGET,
)
from custom_components.haos_ai.models import PrivacyReceipt
from custom_components.haos_ai.storage import (
    AdvisorStore,
    default_data,
    normalize_preferences,
)


def _store() -> AdvisorStore:
    store = AdvisorStore.__new__(AdvisorStore)
    store.data = default_data()
    return store


def _receipt(created_at: str, *, input_tokens: int, output_tokens: int) -> dict:
    receipt = PrivacyReceipt(
        provider="openai",
        model="gpt-5.6",
        purpose="scan",
        categories=[],
        redactions=[],
        payload_preview={},
        usage={"input_tokens": input_tokens, "output_tokens": output_tokens},
    ).to_dict()
    receipt["created_at"] = created_at
    return receipt


def test_monthly_usage_only_counts_the_current_month() -> None:
    store = _store()
    now = datetime(2026, 8, 3, 12, tzinfo=UTC)
    store.data["privacy_receipts"] = [
        _receipt("2026-08-01T00:00:00+00:00", input_tokens=100, output_tokens=10),
        _receipt("2026-08-31T23:59:59+00:00", input_tokens=200, output_tokens=20),
        _receipt("2026-07-31T23:59:59+00:00", input_tokens=900, output_tokens=90),
    ]

    usage = store.monthly_usage(now)

    assert usage == {
        "input_tokens": 300,
        "output_tokens": 30,
        "total_tokens": 330,
        "requests": 2,
    }


def test_monthly_usage_ignores_malformed_receipts() -> None:
    store = _store()
    now = datetime(2026, 8, 3, tzinfo=UTC)
    store.data["privacy_receipts"] = [
        _receipt("2026-08-02T00:00:00+00:00", input_tokens=5, output_tokens=5),
        {"created_at": "2026-08-02T00:00:00+00:00", "usage": "not-a-dict"},
        {"created_at": "2026-08-02T00:00:00+00:00", "usage": {"input_tokens": "x"}},
        "not-a-receipt",
    ]

    usage = store.monthly_usage(now)

    assert usage["total_tokens"] == 10
    # Only receipts carrying a usage mapping count as billable requests.
    assert usage["requests"] == 2


def test_budget_preference_is_clamped_and_defaults_safely() -> None:
    assert (
        normalize_preferences({})["monthly_token_budget"]
        == DEFAULT_MONTHLY_TOKEN_BUDGET
    )
    assert normalize_preferences({"monthly_token_budget": -5})[
        "monthly_token_budget"
    ] == 0
    assert (
        normalize_preferences({"monthly_token_budget": 10**12})[
            "monthly_token_budget"
        ]
        == MAX_MONTHLY_TOKEN_BUDGET
    )
    assert normalize_preferences({"monthly_token_budget": "abc"})[
        "monthly_token_budget"
    ] == DEFAULT_MONTHLY_TOKEN_BUDGET
    assert normalize_preferences({"monthly_token_budget": "5000"})[
        "monthly_token_budget"
    ] == 5000
