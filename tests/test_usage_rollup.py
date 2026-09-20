"""Monthly token accounting tests.

The budget check reads the month rollup, so the rollup has to survive receipt
pruning, and a scan has to be able to finalize usage after its receipt already
exists.
"""

from custom_components.haos_ai.const import MAX_SUGGESTIONS
from custom_components.haos_ai.models import PrivacyReceipt
from custom_components.haos_ai.storage import AdvisorStore, default_data


def _store() -> AdvisorStore:
    store = AdvisorStore.__new__(AdvisorStore)
    store.data = default_data()
    return store


def _receipt(store: AdvisorStore, usage: dict[str, int] | None = None) -> str:
    receipt = PrivacyReceipt(
        provider="deepseek",
        model="deepseek-v4-pro",
        purpose="scan",
        categories=["inventory"],
        redactions=[],
        payload_preview={},
        usage=usage or {},
    )
    store.add_receipt(receipt)
    return receipt.id


def test_finished_usage_is_rolled_up_when_the_receipt_is_added() -> None:
    store = _store()
    _receipt(store, {"input_tokens": 10, "output_tokens": 5})

    assert store.monthly_usage() == {
        "input_tokens": 10,
        "output_tokens": 5,
        "total_tokens": 15,
        "requests": 1,
    }


def test_late_usage_is_counted_once_even_when_reported_twice() -> None:
    store = _store()
    receipt_id = _receipt(store)

    store.set_receipt_usage(receipt_id, {"input_tokens": 7, "output_tokens": 3})
    store.set_receipt_usage(receipt_id, {"input_tokens": 7, "output_tokens": 3})

    usage = store.monthly_usage()
    assert usage["input_tokens"] == 7
    assert usage["output_tokens"] == 3
    assert usage["requests"] == 1


def test_partial_usage_from_a_failed_request_is_still_counted() -> None:
    store = _store()
    receipt_id = _receipt(store)

    # A tool turn spent tokens, then a later call in the loop failed.
    store.set_receipt_usage(receipt_id, {"input_tokens": 400, "output_tokens": 0})

    assert store.monthly_usage()["total_tokens"] == 400


def test_rollup_survives_receipt_pruning() -> None:
    store = _store()
    total = MAX_SUGGESTIONS + 20
    for _ in range(total):
        _receipt(store, {"input_tokens": 1, "output_tokens": 1})

    store._prune()

    assert len(store.data["privacy_receipts"]) <= MAX_SUGGESTIONS
    usage = store.monthly_usage()
    assert usage["requests"] == total
    assert usage["total_tokens"] == 2 * total
