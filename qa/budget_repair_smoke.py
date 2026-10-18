"""Prove a failed JSON-repair call still counts against the token budget."""

import asyncio
import json
import sys

sys.path.insert(0, "/workspace")

from custom_components.haos_ai import advisor as advisor_module  # noqa: E402
from custom_components.haos_ai.advisor import Advisor  # noqa: E402
from custom_components.haos_ai.providers.base import (  # noqa: E402
    ProviderError,
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
        return ProviderResponse(content=self.repair_content, usage=dict(REPAIR_USAGE))


class SlowProvider(FakeProvider):
    """Spend tokens, then hang past the (patched) total time budget."""

    async def run_tool_loop(self, messages, tools, execute, **kwargs):
        kwargs["usage_sink"].update(LOOP_USAGE)
        await asyncio.sleep(5)
        raise AssertionError("the total timeout must cancel the tool loop")


class FakeContext:
    outbound_trace: list = []
    include_exact_location = False

    def tool_specs(self):
        return []

    def automation_ids(self):
        return set()

    editable_ids: set = set()

    async def async_editable_automation_ids(self):
        return set(self.editable_ids)

    def is_verified_source(self, source_type, source_id):
        return True

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


EVENTS: list[dict] = []


async def progress(event) -> None:
    EVENTS.append(event)


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
    assert EVENTS[-1] == {"stage": "failed"}, EVENTS[-1]
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

    # 4. The tool loop outlives the total scan budget: the request ends with a
    # provider error, a failed event and the already spent tokens still count.
    advisor_module.SCAN_TOTAL_TIMEOUT_SECONDS = 0.05
    provider = SlowProvider("unused")
    advisor = make_advisor(provider)
    EVENTS.clear()
    try:
        await advisor.async_scan(progress, confirm_context=True)
    except ProviderError as err:
        assert "took too long" in str(err), err
    else:
        raise AssertionError("a scan over the total budget must raise")
    assert EVENTS[-1] == {"stage": "failed"}, EVENTS[-1]
    usage = advisor.store.monthly_usage()
    assert usage["input_tokens"] == 100, usage
    assert usage["output_tokens"] == 20, usage

    # 5. Same for a chat turn (a failed chat records a receipt with usage).
    advisor_module.CHAT_TOTAL_TIMEOUT_SECONDS = 0.05
    advisor = make_advisor(SlowProvider("unused"))
    advisor.context.set_exclusions = lambda prefs: None
    EVENTS.clear()
    try:
        await advisor.async_chat("t1", "hello", progress)
    except ProviderError as err:
        assert "took too long" in str(err), err
    else:
        raise AssertionError("a chat over the total budget must raise")
    assert EVENTS[-1] == {"stage": "failed"}, EVENTS[-1]
    usage = advisor.store.monthly_usage()
    assert usage["input_tokens"] == 100, usage
    assert usage["output_tokens"] == 20, usage
    # 6. An update proposal whose target is not editable is dropped (never
    # downgraded to a create that would duplicate the running automation); a
    # proposal without a target stays a create, an editable target stays an
    # update.
    from types import SimpleNamespace

    async def fake_validate(hass, config):
        return SimpleNamespace(valid=True, errors={})

    original_validate = advisor_module.async_validate_automation
    advisor_module.async_validate_automation = fake_validate

    def item(title, **automation):
        return {
            "kind": "automation",
            "title": title,
            "summary": "s",
            "rationale": "r",
            "evidence": [
                {
                    "source_type": "entity",
                    "source_id": "light.kitchen",
                    "observation": "o",
                }
            ],
            "automation": {
                "alias": title,
                "trigger": [],
                "action": [],
                **automation,
            },
        }

    try:
        advisor = make_advisor(FakeProvider("unused"))
        advisor.context.editable_ids = {"0", "known"}
        parsed = await advisor._async_parse_recommendations(
            {
                "recommendations": [
                    item("package one", target_automation_id="package_only"),
                    item("fresh one"),
                    item("known one", target_automation_id="known"),
                    item("zero one", target_automation_id="0"),
                ]
            },
            "scan",
            "receipt",
        )
    finally:
        advisor_module.async_validate_automation = original_validate
    targets = {r.title: r.automation.target_id for r in parsed}
    assert targets == {
        "fresh one": None,
        "known one": "known",
        "zero one": "0",
    }, targets
    print("budget repair smoke ok")


asyncio.run(main())
