# Release checklist

## Blocking before the first public release

- [x] Create or transfer the public repository at
  `https://github.com/Bronxk/haos-ai`.
- [x] Set a real maintainer in `manifest.json` under `codeowners` (`@Bronxk`).
- [x] Enable GitHub issues or replace the manifest's `issue_tracker`.
- [ ] Add repository branding/screenshots and confirm the HACS listing assets.
- [ ] Rotate every provider key used during development and live testing.

## Version and validation

- [x] Keep `package.json`, `package-lock.json`, `manifest.json`, and the
  changelog version aligned; `scripts/release.py check` enforces this.
- [x] Run `python3 -m pytest -q`.
- [x] Run `ruff check custom_components tests qa`.
- [x] Run `npm ci`, `npm run check`, `npm test`, and `npm run build`.
- [x] Confirm the committed production panel matches a clean build.
- [x] Run Hassfest and the Home Assistant runtime smoke tests.
- [x] Confirm the pushed candidate passes the complete hosted `Validate`
  workflow, including HACS.
- [x] Run `npm audit --omit=dev`.
- [x] Confirm the secret scan and GitHub Actions workflow lint jobs pass.
- [x] Confirm the GitHub `release` environment requires a maintainer approval
  and permits deployment only from tags matching `v*`.

## Manual acceptance

- [x] Install the release archive on a clean Home Assistant test instance.
- [ ] Configure each advertised provider at least once.
- [ ] Preview a scan and confirm secrets and exact location are absent.
- [ ] Complete a scan and confirm it contains automation suggestions when
  supported by evidence, plain-language explanations, validation, and YAML.
- [ ] Confirm a repeated scan does not duplicate an existing suggestion.
- [ ] Exercise chat, save/dismiss/restore, YAML copy/download, reconfigure, and
  uninstall/reinstall.
- [x] Test desktop plus 320 px and 375 px widths in light and dark themes.

## Publish

- [ ] Push the `vX.Y.Z` tag only after validation passes. The release workflow
  builds `release/haos-ai-X.Y.Z.zip` from the exact tagged source and publishes
  its SHA-256 checksum.
- [x] Inspect the archive: it must contain `custom_components/haos_ai` and must
  not contain `.storage`, logs, databases, environment files, or source maps.
- [ ] Publish release notes including breaking/default-model changes.
- [ ] Verify the public documentation, issue tracker, archive download, and
  HACS custom-repository install from a signed-out browser.
