# AITeam-bundles

Public catalog of agent bundles for the [AITEAM-X](https://github.com/INOSX/AITeam) platform.

The AITEAM-X dashboard fetches `index.json` from this repo, lists each bundle in the **Bundles** wizard, and installs the selected bundle into the user's local pack.

## What is a bundle?

A self-contained, validated package that adds one agent to an AITEAM-X installation. Every bundle ships exactly four files:

```
bundles/<id>/
├── agent.md       # persona / system prompt (pt-br)
├── manifest.json  # metadata, schema agent-bundle.v1
├── visual.json    # card colors + SVG glyph, schema agent-visual.v1
└── README.md      # human docs
```

Manifests in this repo are the **source of truth** for agent metadata on the platform. Once installed, the platform regenerates its local `_cfg/agent-manifest.csv` from the bundle's `manifest.json`.

## Repo layout

| Path | Purpose |
|---|---|
| `index.json` | Catalog the platform reads. One entry per bundle. |
| `schemas/agent-bundle.v1.json` | JSON Schema for `manifest.json`. |
| `schemas/agent-visual.v1.json` | JSON Schema for `visual.json`. |
| `schemas/agent-persona.v1.md` | Checklist enforced on `agent.md`. |
| `bundles/<id>/` | One folder per bundle. |
| `scripts/validate.mjs` | Validates every bundle against the schemas. |
| `scripts/check-catalog.mjs` | Confirms `index.json` matches filesystem. |
| `.github/workflows/validate.yml` | CI runs both scripts on every PR. |

## Adding a bundle

1. Copy `bundles/echo/` to `bundles/<your-id>/` and edit the four files.
2. Add an entry to `index.json` (catalog metadata mirrors `manifest.json`).
3. Run `npm test` locally — must pass before opening a PR.
4. Open a PR. CI re-runs the validator. INOSX merges valid bundles.

## Validation rules

- `manifest.json` must satisfy `schemas/agent-bundle.v1.json`.
- `visual.json` must satisfy `schemas/agent-visual.v1.json`.
- `agent.md` must satisfy the checklist in `schemas/agent-persona.v1.md` (frontmatter, required H2 sections, length bounds, no destructive code blocks).
- Folder name must equal `manifest.json → id`.
- `id` must be unique across the catalog.

## Reference bundle

`bundles/echo/` is the canonical minimal bundle. The platform's wizard uses it as the template for "Create from scratch" and the validator uses it as a positive fixture.

## Consuming this catalog

The platform reads via raw GitHub:

```
GET https://raw.githubusercontent.com/INOSX/AITeam-bundles/main/index.json
GET https://raw.githubusercontent.com/INOSX/AITeam-bundles/main/bundles/<id>/manifest.json
GET https://raw.githubusercontent.com/INOSX/AITeam-bundles/main/bundles/<id>/visual.json
GET https://raw.githubusercontent.com/INOSX/AITeam-bundles/main/bundles/<id>/agent.md
GET https://raw.githubusercontent.com/INOSX/AITeam-bundles/main/bundles/<id>/README.md
```

Versioning: each bundle has its own semver in `manifest.json → version`. The catalog itself is versioned via `catalogVersion` in `index.json`.

## License

MIT — see [LICENSE](LICENSE).
