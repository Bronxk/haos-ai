# Release safety audit

Audit date: 2026-09-20
Candidate: HAOS AI 1.0.4
Decision: **NO-GO until the external gates below pass**

This audit covers the tree that produces `release/haos-ai-1.0.4.zip`. It
supersedes the 1.0.3 audit, which described a candidate that was never tagged
and is kept only in git history.

## Method

Everything below was executed against this tree, not inferred from a
description of it:

- `ruff check custom_components tests qa scripts`
- `python -m pytest -q`
- `tsc --noEmit` and `vitest run`
- `vite build`, then a second build compared byte for byte against the first
  and against the committed bundle
- `python scripts/release.py check` and `build`
- hassfest, run locally from `script/hassfest` against
  `custom_components/haos_ai` (no Docker on the audit machine)
- all eight Home Assistant runtime smoke tests on Home Assistant 2026.9.3
- `qa/visual.mjs` in headless Chromium at 320, 375, 414, 768, 1440 and 1920 px
  in light and dark themes
- the hosted `Validate` workflow on the pushed candidate

## Safety invariants

- Scan, chat, context lookup, scheduling and validation remain read-only.
- Registry and automation changes require an administrator, an enabled
  default-off capability, a suggestion that has not already been applied, an
  exact confirmation, and a live stale-target check. Approvals are serialized,
  the operation is derived from the stored suggestion rather than chosen by the
  caller, and the ledger records a content hash of every automation body that
  was written.
- Provider requests and stored privacy receipts use bounded, sanitized context.
  The budget fails closed: usage is recorded even when a provider call fails
  mid-loop, and the per-month rollup survives receipt pruning.
- Provider failures fail closed and do not echo untrusted response bodies.
- A single failing read-only context tool is returned to the model as a tool
  error instead of aborting a scan whose tokens were already spent.
- Release publication waits for the complete validation workflow, and the
  archive build fails if a required runtime file is missing.
- The release archive contains only `custom_components/haos_ai` runtime files.

## Findings

Every finding below was found, fixed and verified in this cycle.

| ID | Severity | Finding | Disposition |
| --- | --- | --- | --- |
| N-001 | High | `haos_ai.scan` allowed a call with no user context straight through, contradicting the documented fail-closed rule. | Confirmed as the deliberate automation path (an unattributed service call can only originate inside Home Assistant). Made explicit and logged, covered by a test, and `SECURITY.md` now states the exception. |
| N-002 | High | The approval path was not idempotent, was not serialized, let the caller choose the operation, and recorded no hash of the body it wrote. | Fixed: serialized under the operation lock, an already-applied suggestion is refused, the operation is derived from the stored suggestion, and the ledger records a content hash. |
| N-003 | High | Token usage was written to the receipt only on the success path, so a failed request was invisible to the budget, and the receipt cap under-counted a busy month. | Fixed: `run_tool_loop` reports usage through a sink, the repair call is counted, a failed chat turn is recorded, and a per-month rollup survives pruning. |
| N-004 | High | All seven `ha-icon-button` templates passed the `icon` attribute that Home Assistant removed in 2021, so each button rendered with no glyph — including the chat new-conversation control. | Fixed to the slotted form, guarded by a source test and verified in a real browser. |
| N-005 | High | `get_automations` applied its query literally, so a wildcard, an omitted argument or `null` returned an empty automation list. | Fixed: `query` is optional and the usual "list everything" tokens mean no filter. Covered by a runtime smoke test. |
| N-006 | High | Device-registry access deprecated in Home Assistant 2026.8 made the context smoke test fail on the stable runtime image. | Fixed version-adaptively, so 2026.7 through 2026.9 work without deprecation reports. |
| N-007 | Medium | `async_update_reload_and_abort` combined with the entry's update listener is deprecated since 2026.6 and raises from 2026.12. | Fixed with `async_update_and_abort`, keeping the listener that the panel update paths rely on. |
| N-008 | Medium | A scan time entered as `HH:MM` was accepted and then silently replaced by `03:00`. | Fixed: the options schema validates and normalizes the value, and the parser accepts both forms. |
| N-009 | Medium | Suggestions were pruned on `created_at` while recurrence only refreshed `last_seen_at`, so a recurring dismissed suggestion was deleted and re-created as new. | Fixed: pruning uses the newest activity. |
| N-010 | Medium | The per-run cap was applied before balancing, so a hygiene-heavy response could crowd out every automation. | Fixed: balancing runs first and the cap is applied afterwards. |
| N-011 | Medium | An update target was validated against the 50-row window sent to the model, so a target beyond it silently degraded into a duplicate create. | Fixed: targets are validated against every automation, honouring ignore scopes. |
| N-012 | Medium | Cited evidence was never checked, so a fabricated identifier could render as a plausible deep link. | Fixed: each source is resolved against the live registries and marked in the panel when it cannot be. |
| N-013 | Medium | hassfest failed: the integration reads the `blueprint` component without declaring it, and shipped a bespoke top-level `panel` translation section that hassfest rejects. | Fixed: `blueprint` is declared in `after_dependencies`, the strings moved into the documented `common` section with slug keys, and the panel flattens its dotted keys for that lookup. |
| N-014 | Medium | The panel config passed `trust_external_script`, a key the frontend ignores. | Fixed by registering through `panel_custom.async_register_panel`. This also uncovered that the helper became a coroutine, which the previous call never awaited — the panel was silently never registered by that code path. |
| N-015 | Low | Three panel strings were defined in three catalogs and referenced nowhere. | Fixed, with a reverse dead-key test so it cannot recur. |
| N-016 | Low | The committed release archive predated the current tree, two frontend findings were open (an off-screen error banner and a dead-end chat YAML action), and this document carried stale counts and a stale digest. | Fixed: the archive is rebuilt, errors render inside the scrolling pane, a chat draft can always be copied, and the counts and digest below are current. |

## Evidence

- Ruff: pass, with the target set to Python 3.14.
- Python: 62 tests pass.
- TypeScript: pass.
- Vitest: 10 tests pass.
- Panel bundle: a fresh build is byte-identical to the committed bundle, and
  two consecutive builds agree.
- Browser: 6 widths × 2 themes with no overflow, no clipped element and no
  wrapped control, and 44 rendered icon buttons each carrying a visible
  slotted icon.
- Home Assistant runtime: all eight smoke tests pass on 2026.9.3 — automation
  validation, context, `get_automations`, WebSocket, conversation, change
  safety, automation apply (server-assigned id, no retargeting, re-approval
  refused, invalid body refused, operation mismatch refused), and a real
  install of the built archive including panel registration.
- hassfest: 1 integration, 0 invalid integrations.
- Hosted `Validate` workflow on the candidate commit: all jobs pass —
  workflow-security (actionlint + gitleaks), hacs, test, panel-browser,
  hassfest, and the Home Assistant runtime matrix for 2026.7 and stable.
- Archive is deterministic across two builds, contains 29 runtime files, and
  contains no `.storage`, logs, databases, environment files, bytecode or
  source maps.

Final candidate:

```text
release/haos-ai-1.0.4.zip
SHA-256 0609b501849f9f089a4338e616fcd64adcbe0fc7117a8a778375e386d570fb26
```

## Deferred

The grouped frontend dependency upgrade (Vite 8, Vitest 5, TypeScript 7,
jsdom 30, `@types/node` 26, Playwright 1.63) is not part of this candidate.
It type-checks, tests, builds and renders correctly on this machine under
both Node 22 and Node 24, but the hosted `test` job fails at `npm run build`
and its log is only readable with repository admin rights. The grouped
Dependabot pull request stays open for a maintainer to investigate.

## Open external gates

These cannot be closed from the development machine and remain open:

- **Live provider acceptance.** Real, separately billed keys for OpenAI,
  Anthropic, DeepSeek and one generic OpenAI-compatible endpoint, exercised on
  a disposable Home Assistant. Rotate the test keys afterwards.
- **Public HACS install.** Install and update from a signed-out client against
  the published release, and confirm the HACS listing presentation.
- **Provider defaults.** The default model identifiers age quickly. Confirm
  them against current provider documentation before publishing.

## Release procedure

1. Confirm every external gate above.
2. Tag `v1.0.4` from the audited commit. The protected `release` environment
   requires a maintainer approval and permits only `v*` tags.
3. Let the release job rebuild the archive from the exact tag and verify the
   committed panel bundle.
4. Verify the published ZIP digest and perform one final HACS
   install/update.

If any gate fails, do not publish; fix the candidate, rerun the full
validation workflow, and create a new release candidate.
