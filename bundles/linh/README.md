# Linh Nguyen — Reference Bundle

Minimal valid AITEAM-X bundle. Ships as the canonical example used by:

- The bundle wizard at `/[locale]/bundles → Create from scratch` (template).
- The platform's `lib/harness/bundle-validator.ts` integration tests.
- Catalog screenshot fixtures.

## Why this exists

A reference bundle guarantees the platform always has a known-good payload to validate against — useful when debugging installer regressions or schema breaks.

## Files

| File | Schema | Purpose |
|---|---|---|
| `manifest.json` | `agent-bundle.v1` | Metadata (id, module, role, tools used) |
| `visual.json`   | `agent-visual.v1` | Card colors + SVG glyph |
| `agent.md`      | `agent-persona.v1` | Persona / system prompt (pt-br) |
| `README.md`     | — | Human docs (this file) |

## Behavior

Linh confirms the user's input verbatim, proposes a next step, and refuses anything destructive. It uses only `read_file` and `list_directory` from the harness tool registry.

## Install on AITEAM-X

From the dashboard: **Bundles → Catalog → Linh → Install**.

Or via API: `POST /api/bundles/install { "id": "linh", "version": "1.0.0" }`.
