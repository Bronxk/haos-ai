# Changelog

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
