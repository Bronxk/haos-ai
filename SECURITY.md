# Security

## Report a vulnerability

Do not include API keys, Home Assistant backups, entity dumps, exact locations,
or other household data in a public issue. Contact the repository owner
privately before publishing a vulnerability.

Rotate the provider key immediately if it may have been exposed.

## Threat model

HAOS AI treats provider responses and all Home Assistant names/attributes as
untrusted data. The LLM has no action or service-call tool. Its context tools
only inspect bounded Home Assistant data and return sanitized JSON.

The integration protects against accidental disclosure with key-based
redaction, credential-pattern redaction, domain-specific attribute filtering,
payload bounds, administrator-only APIs, and visible privacy receipts. These
controls reduce risk but cannot guarantee that household metadata is
non-sensitive.

Users remain responsible for:

- choosing and trusting the external provider and endpoint;
- reviewing the privacy preflight;
- protecting Home Assistant backups and configuration storage;
- reviewing every exported automation before importing it; and
- limiting API-key permissions and spend with the provider.

