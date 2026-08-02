# Release safety audit

Audit date: 2026-08-02
Candidate: HAOS AI 1.0.3
Decision: **NO-GO until the external gates below pass**

The local candidate is technically ready for the remaining external acceptance
steps. No unresolved critical or high code finding remains in the audited
workspace.

## Safety invariants

- Scan, chat, context lookup, scheduling, and validation remain read-only.
- Registry changes require an administrator, an enabled default-off capability,
  an exact suggestion, explicit confirmation, and a live stale-target check.
- Provider requests and stored privacy receipts use bounded, sanitized context.
- Provider failures fail closed and do not echo untrusted response bodies.
- Release publication waits for the complete validation workflow.
- The release archive contains only `custom_components/haos_ai` runtime files.

## Findings

| ID | Severity | Finding | Disposition |
| --- | --- | --- | --- |
| F-001 | Critical | A tag could publish while HACS, Hassfest, or runtime validation failed in a separate workflow. | Fixed: release calls and waits for the complete reusable validation workflow and uses the protected `release` environment. |
| F-002 | High | DeepSeek V4 thinking mode rejects `tool_choice`, but the adapter always sent it. | Fixed for the dedicated DeepSeek provider; generic OpenAI-compatible endpoints retain the field. Regression tests cover both paths. |
| F-003 | High | Docker-generated Home Assistant authentication material existed under ignored `qa/.storage`. | Quarantined outside the repository, removed from the workspace, and prevented by a blocking Gitleaks job. Rotate any credentials if this directory was ever copied or committed elsewhere. |
| F-004 | Medium | Free-text secret assignments, mixed-case webhook paths, and sensitive URL fragments were not fully redacted. | Fixed with canary tests. |
| F-005 | Medium | Provider HTTP error bodies could be returned to the administrator UI. | Fixed: errors expose status only. |
| F-006 | Medium | Runtime QA did not exercise registry-change rejection or prove context reads leave Home Assistant unchanged. | Fixed with destructive-change and before/after state smoke tests. |
| F-007 | Medium | Release dependencies used moving GitHub Action references and had no automated update configuration. | Fixed by commit pinning and Dependabot configuration. Upstream container images used by HACS/Hassfest remain vendor-managed. |
| F-008 | External gate | The current commit has not run the HACS GitHub Action. Local execution requires a GitHub token. | Open: require a green HACS job after push. |
| F-009 | Resolved external gate | The GitHub `release` environment needed a required reviewer and tag-only deployment policy. | Fixed: `Bronxk` is required to approve deployments, and only tags matching `v*` may deploy. |
| F-010 | External gate | Live provider acceptance requires real, separately billed provider keys. | Open: configure OpenAI, Anthropic, DeepSeek, and one generic OpenAI-compatible endpoint on disposable Home Assistant. Rotate the test keys afterward. |
| F-011 | External gate | HACS installation and update notification behavior have not been exercised from a signed-out/public client against this unpublished candidate. | Open: test after the candidate commit is available remotely. |
| F-012 | External gate | Public repository screenshots and HACS listing presentation were not manually approved during this audit. | Open: confirm branding and screenshots before tagging. |

## Evidence

- Ruff 0.16.1: pass.
- Python: 36 tests pass.
- TypeScript: pass.
- Vitest: 8 tests pass.
- Clean `npm ci` and Vite production build: pass; committed bundle hash unchanged.
- Production dependencies: zero reported npm vulnerabilities.
- Gitleaks 8.30.1: no leaks after quarantine.
- Actionlint 1.7.12: both workflows pass.
- Hassfest: 1 integration, 0 invalid integrations.
- Home Assistant 2026.7.4: automation, context, WebSocket, conversation,
  destructive-change, and clean-install smoke tests pass.
- Exact extracted ZIP: all runtime smoke tests and clean bootstrap pass.
- Storage: 1.0.2 -> 1.0.3 -> 1.0.2 -> 1.0.3 round trip preserves user
  notes; new change permissions restore to safe defaults.
- Responsive visual QA: pass at 320, 375, 414, 768, 1440, and 1920 px in
  light and dark themes.
- Provider defaults verified against current official documentation:
  `gpt-5.6` routes to GPT-5.6 Sol and supports Responses; `claude-sonnet-5`
  is a current Claude API ID; `deepseek-v4-flash` is a current DeepSeek model.
- Archive is deterministic across two builds, contains 24 runtime files, and
  contains no `.storage`, logs, databases, environment files, bytecode, or
  source maps.

Final candidate:

```text
release/haos-ai-1.0.3.zip
SHA-256 10d005206b73cc7dadf51e4a1b736792abb96bc66da14acfdc1e471b21418299
```

## Release procedure

1. Review these changes and commit them without the quarantined QA state.
2. Push the candidate branch and require every `Validate` job, including HACS,
   to pass.
3. Confirm the GitHub `release` environment still requires `Bronxk` approval and
   permits only tags matching `v*`.
4. Complete the live-provider and public HACS acceptance items in
   `RELEASE_CHECKLIST.md`; rotate all test keys.
5. Tag `v1.0.3` only after those items pass. The protected release job must build
   from the exact tag and wait for approval.
6. Verify the published ZIP digest and perform one final HACS update/install.

If any external gate fails, do not publish; fix the candidate, rerun the full
validation workflow, and create a new release candidate.
