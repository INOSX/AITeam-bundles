# AGENTS.md

This repository is the public source of truth for AITEAM-X agent bundles.

## Commands

```bash
npm test
```

`npm test` runs bundle validation and catalog consistency checks.

## Agent Change Protocol

Every change to an agent bundle must be published to this repository before it is considered complete.

1. Edit the bundle files under `bundles/<agent-id>/`.
2. Update `index.json` whenever bundle metadata, versions, paths, or available bundles change.
3. Run `npm test`.
4. Commit the complete agent change.
5. Push the commit to `origin/main`.

Do not tell the user that an agent change is available to AITEAM-X until the push to the agent repository succeeds, or until a concrete publishing blocker is reported.

## Bundle Contract

Each bundle must contain exactly these public files:

```text
bundles/<id>/
|-- agent.md
|-- manifest.json
|-- visual.json
`-- README.md
```

The platform consumes this catalog from raw GitHub URLs on `main`, so local-only agent edits do not count as published changes.
