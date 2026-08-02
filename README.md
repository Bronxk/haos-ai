# HAOS AI

HAOS AI is a setup-aware AI advisor for Home Assistant. It gives a
directly configured LLM enough sanitized context to propose useful automations
and flag setup hygiene problems without letting the model control your home.
The model and all scheduled runs remain read-only. Optional Home Assistant
changes are performed only after an administrator reviews one request and
approves that exact change.

The panel provides:

- an evidence-backed suggestion inbox with per-view clearing;
- editable Home Assistant automation drafts with re-validation, download, and
  a chat-to-draft revision loop;
- setup-aware, multi-thread chat with bounded read-only context tools;
- a selectable read-only Assist conversation agent;
- OpenAI, Anthropic, DeepSeek, and generic OpenAI-compatible providers;
- a privacy preflight before every manual scan;
- a local activity and privacy ledger with redactions and token usage;
- recurring-evidence counters and structured dismissal feedback;
- conservative through `I WANT AUTOMATION HELL` recommendation styles;
- granular, default-off approval capabilities for creating/updating validated
  automations and removing confirmed orphaned registry entries;
- local preference, chat, scan, and privacy-receipt storage;
- manual, daily, or weekly scans with optional notifications; and
- exact-location redaction by default.

HAOS AI never calls Home Assistant services on behalf of the model and never
sends API keys, camera media, alarm codes, or lock codes as context. Enabling a
change capability only exposes a review button; it does not grant standing
approval. Scheduled scans and chat cannot press that button.

## Requirements

- Home Assistant 2026.7.0 or newer
- A provider API key with billing/credits enabled
- An administrator account for setup and panel access

ChatGPT, Claude, or other consumer subscriptions do not include provider API
usage. You need a separate API key from the provider.

## Install with HACS

[![Open HAOS AI in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Bronxk&repository=haos-ai&category=integration)

Until HAOS AI is listed in the default HACS catalog, the button adds it as a
custom integration repository. You can also add it manually:

1. Open HACS.
2. Select the three-dot menu, then **Custom repositories**.
3. Add `https://github.com/Bronxk/haos-ai` and select **Integration**.
4. Search for **HAOS AI**, download it, and restart Home Assistant.
5. Open **Settings → Devices & services → Add integration**.
6. Search for **HAOS AI**, choose a provider, and enter its API key, model, and
   base URL.

[![Add HAOS AI to Home Assistant](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=haos_ai)

After setup, **HAOS AI** appears in the sidebar for administrators.

## Manual install

1. Download the newest `haos-ai-X.Y.Z.zip` release archive and extract it.
2. Copy its `custom_components/haos_ai` directory into the Home Assistant
   `/config/custom_components` directory.
3. Restart Home Assistant.
4. Add HAOS AI from **Settings → Devices & services**.

The final path must be:

```text
/config/custom_components/haos_ai/manifest.json
```

## Update

HACS installations receive normal Home Assistant update notifications. Select
**Update**, wait for HACS to finish, then restart Home Assistant. Local chats,
suggestions, preferences, and privacy receipts are stored outside the
integration directory and remain in place.

For a manual installation, download the new release archive, replace only
`/config/custom_components/haos_ai`, and restart Home Assistant. Do not delete
`.storage/haos_ai` unless you intentionally want to reset local advisor data.

## Provider defaults

| Provider | Default model | Default base URL |
| --- | --- | --- |
| OpenAI | `gpt-5.6` | `https://api.openai.com/v1` |
| Anthropic | `claude-sonnet-5` | `https://api.anthropic.com` |
| DeepSeek | `deepseek-v4-flash` | `https://api.deepseek.com` |
| OpenAI-compatible | set by you | set by you |

Models and endpoints change over time. Override either value during setup when
your provider account uses a different model or compatible gateway.

Provider setup performs one tiny completion to validate the key, endpoint, and
model. That request can incur a small API charge.

## Use

### Run a scan

Open the sidebar panel and select **Run scan**. HAOS AI first builds and shows
the exact sanitized baseline. Expand the payload if you want to inspect it,
then confirm the request.

The provider can request up to 12 additional read-only context lookups. New
suggestions appear in the inbox. Repeated evidence refreshes an existing item
and records how many scans surfaced it instead of creating duplicates.

Automation suggestions include an editable draft and the native validation
result. You can validate after editing, download the YAML, copy it into Home
Assistant, or send the current draft into a new advisor conversation for
revision. A YAML block returned by that conversation can be brought back into
the draft and validated again.

You can also invoke the `haos_ai.scan` action from an automation. Configuring a
daily or weekly schedule is treated as standing consent for scheduled scans.

### Ask a question

Use **Chat** for questions about the current setup. The provider receives only
the recent local thread and context it explicitly requests through the bounded
read-only tools. Free-text credentials that resemble bearer tokens or
credential-bearing URLs are redacted before transmission.

Conversations are stored locally and can be created, renamed, or deleted from
the thread list. Deleting a thread is permanent and requires confirmation.

### Use HAOS AI in Assist

Open your Home Assistant Assist configuration and select **HAOS AI advisor** as
the conversation agent. It uses the same bounded context tools and read-only
rules as panel chat. It can explain and advise, but it cannot call services or
control devices.

### Review activity and privacy

Open **Activity** to inspect scan history and the local receipt for every scan
or conversation request. Receipts show the provider, model, token usage,
redactions, context categories, and the exact sanitized payload retained for
the request.

### Change settings

Open the HAOS AI panel and select **Settings** to change the provider, model,
key, endpoint, history range, exact-location permission, scan schedule, focus
areas, scan depth, automation complexity, approval capabilities, quiet hours,
and ignored entities.
Ignored entities can be searched by friendly name or ID, selected from live
results, or pasted as comma-, space-, or line-separated entity IDs.

Provider credentials remain in the Home Assistant config entry. The stored API
key is never returned to the browser; leaving the field empty keeps the current
key. Changing providers requires a new key and saving performs a small
connection test.

## Context and privacy

Available context includes sanitized inventory counts, areas/floors, entity
states, entity/device relationships, integration health, Supervisor app
metadata when available, existing automation configuration, and locally
aggregated recorder history.

Important boundaries:

- exact coordinates are redacted unless explicitly enabled;
- camera content is never read;
- alarm and camera attributes use a strict allowlist;
- provider responses have no service-call or configuration-write tool;
- all change capabilities are off by default and every individual change needs
  an administrator's explicit approval in the panel;
- payload strings and collections are bounded;
- scans require a visible manual preflight unless a schedule was explicitly
  enabled;
- local data is stored in `.storage/haos_ai` and pruned after 90 days; and
- the panel and WebSocket commands require an administrator.

API keys are held in the Home Assistant config entry and are intentionally
excluded from the panel, context, and privacy receipts.

Provider keys are transmitted only to the endpoint configured during setup.
Public endpoints must use HTTPS. Plain HTTP remains available for loopback,
private-network, `.local`, and single-label local hosts.

## Troubleshooting

### Provider rejects setup

Confirm the key has API access, the model is enabled for the account, and the
base URL does not end in `/responses`, `/messages`, or `/chat/completions`.
HAOS AI appends the appropriate route.

### Supervisor apps are unavailable

App/add-on context is optional and only available on installations exposing the
Supervisor API. Home Assistant Container and Core installations continue
without it.

### A proposed automation does not validate

HAOS AI keeps the proposal visible but marks it **Check YAML** and shows the
validator error. Do not import it until corrected. Model output is always
untrusted, even when the validator passes.

### The sidebar does not appear

Confirm the integration is configured, sign in as an administrator, perform a
full browser refresh, and inspect Home Assistant logs for
`custom_components.haos_ai`.

## Development

```bash
npm install
npm run check
npm run build
python3 -m pytest -q
ruff check custom_components tests
python3 scripts/release.py check
```

The production panel is emitted to
`custom_components/haos_ai/frontend/haos-ai-panel.js` and must be committed in a
release so users do not need Node.js.

Pushing an annotated or lightweight `vX.Y.Z` tag runs the full release workflow,
rebuilds and verifies the committed panel, creates a deterministic archive and
SHA-256 checksum, and publishes both files to a GitHub release.

## Current limitations

- one active provider profile;
- English UI only;
- automation deletion is not offered; creation and updates require validated
  YAML plus a separate approval step;
- no semantic/vector memory; local history is deterministic aggregation; and
- scheduled scans reuse the configured standing consent instead of showing an
  interactive preflight.

## Security

See [SECURITY.md](SECURITY.md) for reporting instructions and the threat model.
See [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) before publishing a release.
