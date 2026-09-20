# Changelog

## Unreleased

- Fixed two hassfest failures the unreleased work had introduced: `blueprint`
  is now declared in `after_dependencies`, and the panel strings moved out of a
  bespoke `panel` translation section — which hassfest rejects — into the
  `common` section, using slug keys. The panel lookup flattens its dotted keys
  for that lookup, so localization still resolves through Home Assistant.
- Hardened the approval path. Approvals are serialized, a suggestion that was
  already applied is refused instead of applied a second time, the operation is
  derived from the stored suggestion rather than chosen by the caller, and the
  applied-change ledger records a content hash of every automation body that
  was written.
- Token accounting now fails closed. Usage is recorded even when a provider
  call fails mid-loop, the JSON-repair call is counted, and a per-month rollup
  survives receipt pruning instead of under-counting the budget past 200
  requests.
- Device removal uses `async_remove_device` on Home Assistant 2026.8 and newer,
  where a device belongs to exactly one config entry; older releases keep the
  previous behaviour.
- Replaced `async_update_reload_and_abort` in the reconfigure flow. Combined
  with the entry's update listener it is deprecated since Home Assistant 2026.6
  and raises from 2026.12. An empty API key can no longer silently carry over
  to a different provider either.
- Scan time is validated as `HH:MM` or `HH:MM:SS`. A bare `22:30` used to be
  accepted and then silently replaced by `03:00`.
- Suggestions are pruned on their newest activity, so a recurring dismissed
  suggestion is no longer deleted and recreated as new after 90 days.
- Recommendations are balanced before the per-run cap, so a hygiene-heavy
  response can no longer crowd out every automation.
- An update target is validated against every automation rather than the
  50-row window sent to the model, which turned updates into duplicates on
  larger installations.
- Cited evidence is checked against the live registries and marked in the panel
  when it cannot be resolved.
- A failing read-only context tool now returns an error to the model instead of
  aborting the whole scan after tokens were already spent.
- The panel no longer flashes the full-screen loader on every refresh, no
  longer re-hydrates Settings over unsaved edits, and no longer discards an
  edited draft when the selection refreshes. The approval button is disabled
  while the update diff is loading or unavailable.
- CI runs the automation apply, release archive and freshness smoke tests. The
  archive build fails if a runtime file is missing, the built archive is
  exercised by a real install, Python and Node moved to 3.14 and 24, and
  Dependabot groups its updates.
- `SECURITY.md` now documents that `haos_ai.scan` deliberately accepts an
  unattributed call from an automation, and that panel threads are shared by
  all administrators.
- Fixed the panel's icon buttons. Home Assistant's `ha-icon-button` has no
  `icon` property — it renders a slotted `<ha-icon>` or a `path` — so every
  `icon="mdi:..."` button rendered blank. The new-conversation control in chat
  was invisible, along with six others (dismiss error, clear inbox, open in
  Home Assistant, rename conversation, delete conversation, refresh activity).
  All seven now slot an `<ha-icon>`, and a source test rejects the removed
  attribute.
- Fixed `get_automations` reporting an empty list. The tool marked `query` as
  required while describing it as optional and matched it as a literal
  substring, so a model asking for everything with `*`, `all`, an omitted
  argument, or JSON `null` was told the home had no automations. `query` is now
  optional, and the common "list everything" tokens mean "no filter".
- Modernized device registry access that Home Assistant deprecated in 2026.8:
  `registry.devices` is no longer a mapping and `DeviceEntry.config_entries` is
  a compatibility shim. Both are now read version-adaptively, so Home Assistant
  2026.7 through 2026.9 work without deprecation reports.
- Repaired three runtime smoke tests that the unreleased features had broken.
  The context test tripped the deprecated device mapping, the WebSocket test
  passed no advisor and a store without an applied-change ledger, and the
  change-safety test asserted the pre-ledger response shape. `get_automations`
  now has its own smoke test, and it runs in the CI runtime matrix.
- The panel's `_panel_custom` config passed `trust_external_script`, a key the
  frontend ignores; it now passes `trust_external`, matching
  `panel_custom.async_register_panel`.
- Dropped the obsolete `render_readme` key from `hacs.json`.
- **Security:** the Assist conversation agent now requires an administrator.
  It previously answered any caller, which let a non-admin — or any voice
  satellite — read the whole sanitized setup through the advisor's read-only
  context tools: inventory, entity detail, integration health, and raw
  automation config. Unattributed requests, which cannot be shown to come from
  an administrator, are refused as well.
- **Security:** Assist threads are namespaced per user instead of using the
  caller-supplied conversation id directly. A caller could previously pass a
  known panel thread id and have the model replay that private conversation
  back, or write into it.
- Assist now answers with the budget message instead of raising when the
  monthly token budget is spent.
- Moved automation creation and updates behind the backend approval gate. The
  panel no longer writes to Home Assistant's automation config API directly, so
  the default-off `create_automations` and `update_automations` capabilities are
  now enforced on the server, revalidated at approval time, and checked against
  a live stale-target lookup.
- Added a side-by-side YAML diff to the update-approval dialog so a replacement
  shows exactly which lines change before it is applied.
- Added a monthly token budget. Scans and chat fail closed once the cap is
  reached, warn at 80%, and report usage in Activity and settings.
- Added an applied-change ledger. Approved changes are re-checked after three
  days and recorded as kept, turned off, or reverted, and those outcomes are
  fed back into later scans.
- Added an optional second provider profile so scans can run on a cheaper model
  while chat stays on a stronger one.
- Added a `get_blueprints` context tool and blueprint-aware validation so the
  advisor can propose a blueprint instance instead of hand-written YAML.
- Added deterministic domain, area, and label exclusions. Like ignored
  entities, these are withheld locally before a request is built rather than
  described to the model as a preference.
- Chat threads are now pruned. Threads past the 90-day retention window are
  removed and the total thread count is capped, so Assist conversations can no
  longer grow local storage without bound.
- Panel strings now resolve through Home Assistant's translation catalog, with
  the bundled English table as the fallback.
- Unexpected WebSocket errors no longer echo raw exception text to the browser.
- Marked the integration `single_config_entry` so Home Assistant hides the add
  button for a second entry.

## 1.0.3

- Fixed provider selection so DeepSeek connections no longer render as OpenAI
  when the saved endpoint or model clearly identifies DeepSeek.
- Added the `I WANT AUTOMATION HELL` advisor style for maximum evidence-backed
  automation discovery without weakening validation or approval requirements.
- Added filter-aware inbox clearing with an explicit destructive confirmation.
- Added granular, default-off approval capabilities for creating and updating
  validated automations and removing confirmed orphaned entities or devices.
- Kept scans and provider chat read-only: every proposed Home Assistant change
  requires a separate administrator review and approval in the panel.
- Revalidate registry targets immediately before removal so an entity or device
  that became active again cannot be deleted from an old suggestion.

## 1.0.2

- Preserved DeepSeek V4 `reasoning_content` across multi-round tool calls so
  thinking mode can continue with the complete provider context.
- Versioned the registered panel module URL so Home Assistant browsers load the
  redesigned frontend after an integration update instead of reusing 0.1.x UI.

## 1.0.1

- Corrected HACS, documentation, release, and issue links to the public
  `Bronxk/haos-ai` repository.
- Packaged the HAOS AI brand icon inside the integration for HACS validation.

## 1.0.0

- Rebuilt the panel around Home Assistant's native visual language, responsive
  workbench layouts, native buttons/dialogs/cards, dark theme tokens, and a new
  code-native HAOS AI house-and-advisor logo.
- Added structured dismissal feedback and recurring-evidence counters so future
  scans can learn from rejected ideas without duplicating recurring findings.
- Added multi-thread advisor chat with automatic titles, rename/delete controls,
  and a draft revision loop that can bring returned YAML back for validation.
- Added an Activity privacy ledger with scan history, token usage, redactions,
  context categories, and inspectable sanitized payload receipts.
- Added editable automation YAML, server-side re-validation, downloads, Home
  Assistant editor deep links, and evidence links to relevant native pages.
- Added optional persistent notifications for scheduled scans that produce new
  suggestions and live scan/chat progress in the panel.
- Added a read-only Home Assistant Assist conversation entity using the same
  bounded setup context as panel chat.
- Added Home Assistant 2026.7 runtime smoke coverage and light/dark responsive
  browser QA from 320 to 1920 pixels.
- Added in-panel provider, model, API-key, endpoint, privacy, and schedule
  controls with provider validation and no secret round-trip to the browser.
- Replaced free-text goals with multi-select advisor focus presets and added
  scan depth, recommendation style, automation complexity, quiet hours, and
  practical suggestion guardrails.
- Replaced ignored-entity text entry with a live searchable multi-selector that
  accepts pasted entity IDs and safely retains temporarily unavailable items.
- Added one-click HACS onboarding, brand assets, version visibility, HACS
  validation, and deterministic tagged-release automation with checksums.

## 0.1.6

- Fixed Supervisor app/add-on discovery on Home Assistant 2026.7 by using its
  synchronous callback API correctly.
- Report complete hygiene totals while keeping transmitted entity samples
  bounded to 100 items per category.
- Updated default models to GPT-5.6, Claude Sonnet 5, and DeepSeek V4 Flash;
  DeepSeek's retired `deepseek-chat` alias is no longer the default.
- Reject credential-bearing, route-complete, or plaintext public provider URLs
  while preserving HTTP support for local endpoints.
- Suppress repeated suggestions with the same normalized type and title.
- Improved narrow-screen evidence wrapping, tab labels, action layout, focus
  consistency, and semantic UI color/motion tokens.
- Added release checks for Supervisor context, accurate bounded counts, URL
  validation, and suggestion deduplication.

## 0.1.5

- Added a dedicated plain-language explanation for every generated automation,
  covering its trigger, conditions, and resulting actions.
- Displayed the explanation above the YAML with a fallback for older saved
  suggestions.

## 0.1.4

- Increased scan provider requests to a five-minute timeout for large Home
  Assistant baselines and slower reasoning models such as DeepSeek V4 Pro.
- Increased chat and JSON repair requests to a three-minute timeout.

## 0.1.3

- Prioritize automation discovery during scans, targeting five automations and
  limiting pure setup-hygiene recommendations to three.
- Keep automation recommendations at half or more of mixed scan results whenever
  evidence-backed automations are available.

## 0.1.2

- Finalize from already collected context when a model reaches the bounded
  context-tool budget instead of aborting the scan.
- Detect DeepSeek DSML tool requests emitted as text and isolate the final
  response from the prior tool protocol.

## 0.1.1

- Fixed admin WebSocket handlers failing with `unknown_error` on Home Assistant
  2026.7 because the asynchronous response decorator wrapped the synchronous
  administrator check.
- Added a Home Assistant runtime smoke test for the decorated overview command.

## 0.1.0

- Initial deployable V1.
- Added direct OpenAI Responses, Anthropic Messages, DeepSeek, and generic
  OpenAI-compatible adapters.
- Added privacy-gated scans, setup-aware chat, suggestion lifecycle, local
  preferences, privacy receipts, scheduling, and retention.
- Added read-only Home Assistant context tools and recorder aggregation.
- Added native automation validation and YAML export.
- Added an administrator-only responsive sidebar panel.
