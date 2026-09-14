# AGENTS.md

This repository is the public source of truth for AITEAM-X agent bundles.

## AgentOS foundation (approved 2026-09-14)

GitHub `INOSX/AITeam-bundles` remains the primary source. The private
`INOSX/AgentOS-Bundles` repository on Git INOSX is its backup, not an
independent development source. After an authorized GitHub publication, run
`scripts/sync-inosx-backup.ps1` and report whether backup verification passed.
Never use a forced mirror push to erase divergent backup history.

The new AgentOS agent design starts with Adebayo, Administrador da equipe.
Files under `docs/adebayo-foundation/` are planning and review artifacts, not
active agent instructions. Human approval of the professional design precedes
implementation of the new runtime behavior. Legacy bundles remain compatible
until an approved replacement is implemented and validated.

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
