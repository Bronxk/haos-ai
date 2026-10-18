"""Prove a failed JSON-repair call still counts against the token budget."""

import asyncio
import json
import sys

sys.path.insert(0, "/workspace")

from custom_components.haos_ai.advisor import Advisor  # noqa: E402
from custom_components.haos_ai.providers.base import (  # noqa: E402
    ProviderResponse,
    ProviderResponseError,
)
from custom_components.haos_ai.storage import AdvisorStore, default_data  # noqa: E402

LOOP_USAGE = {"input_tokens": 100, "output_tokens": 20}
REPAIR_USAGE = {"input_tokens": 30, "output_tokens": 7}


class FakeProvider:
    """Return fixed responses; the repair call is the `complete` method."""

    model = "fake-model"

    def __init__(self, repair_content: str) -> None:
        self.repair_content = repair_content
        self.repair_calls = 0

    async def run_tool_loop(self, messages, tools, execute, **kwargs):
        kwargs["usage_sink"].update(LOOP_USAGE)
        return ProviderResponse(content="not json at all", usage=dict(LOOP_USAGE))

    async def complete(self, messages, tools, **kwargs):
        self.repair_calls += 1
        return ProviderResponse(
            content=self.repair_content, usage=dict(REPAIR_USAGE)
        )


class FakeContext:
    outbound_trace: list = []

    def tool_specs(self):
        return []

    def automation_ids(self):
        return set()

    def hygiene_candidates(self):
        return {}


def make_advisor(provider: FakeProvider) -> Advisor:
    store = AdvisorStore.__new__(AdvisorStore)
    store.data = default_data()

    async def async_save() -> None:
        return None

    store.async_save = async_save
    advisor = Advisor.__new__(Advisor)
    advisor.hass = None
    advisor.provider = advisor.scan_provider = provider
    advisor.provider_name = advisor.scan_provider_name = "fake"
    advisor.store = store
    advisor.context = FakeContext()
    advisor.refresh_applied_outcomes = lambda: 0

    async def baseline():
        return {"payload": {}, "redactions": []}

    advisor._async_scan_baseline = baseline
    return advisor


async def progress(_event) -> None:
    return None


async def main() -> None:
    # 1. Repair returns invalid JSON again: the scan fails, tokens are counted.
    provider = FakeProvider("still not json")
    advisor = make_advisor(provider)
    try:
        await advisor.async_scan(progress, confirm_context=True)
    except ProviderResponseError:
        pass
    else:
        raise AssertionError("an unrepairable response must still raise")
    assert provider.repair_calls == 1
    usage = advisor.store.monthly_usage()
    assert usage["input_tokens"] == 130, usage
    assert usage["output_tokens"] == 27, usage
    receipt = advisor.store.data["privacy_receipts"][-1]
    assert receipt["usage"] == {"input_tokens": 130, "output_tokens": 27}, receipt

    # 2. Repair succeeds: reported usage equals what the budget counts.
    provider = FakeProvider(json.dumps({"recommendations": []}))
    advisor = make_advisor(provider)
    result = await advisor.async_scan(progress, confirm_context=True)
    usage = advisor.store.monthly_usage()
    assert usage["total_tokens"] == 157, usage
    assert result["usage"] == {"input_tokens": 130, "output_tokens": 27}, result
    assert advisor.store.data["scan_runs"][-1]["usage"] == result["usage"]

    # 3. The repair succeeds but the JSON has a malformed shape, so the scan
    # fails while parsing the recommendations after both calls were paid for.
    provider = FakeProvider(json.dumps({"recommendations": "nope"}))
    advisor = make_advisor(provider)
    advisor.provider = advisor.scan_provider = provider
    try:
        await advisor.async_scan(progress, confirm_context=True)
    except ProviderResponseError:
        pass
    else:
        raise AssertionError("a malformed recommendation list must raise")
    usage = advisor.store.monthly_usage()
    assert usage["input_tokens"] == 130, usage
    assert usage["output_tokens"] == 27, usage
    print("budget repair smoke ok")


asyncio.run(main())
