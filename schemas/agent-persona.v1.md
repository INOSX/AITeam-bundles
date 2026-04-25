# Agent Persona Checklist (v1)

`agent.md` is the persona / system-prompt file inside every AITEAM-X bundle. The harness loads it as the agent's primary instruction. This checklist defines what a valid persona MUST contain — the platform's `bundle-validator` enforces these rules.

## File layout

1. **YAML frontmatter** delimited by `---` lines:
   ```yaml
   ---
   name: "Display Name"
   description: "One-sentence description of who this agent is and what they do."
   ---
   ```
   - `name` MUST match `manifest.json → displayName`.
   - `description` MUST be 20–240 chars, single sentence, no trailing period required.

2. **H1 heading** matching the agent name: `# Display Name`.

3. **Body sections** — the following H2 headings MUST appear, in any order:
   - `## Identidade` (or `## Identity`) — role, posture, communication style.
   - `## Como trabalho` (or `## How I work`) — operating procedure, when to act vs ask.
   - `## Ferramentas` (or `## Tools`) — what tools the agent uses and when.
   - `## Memória` (or `## Memory`) — when to read/write `.memory/` files.
   - `## Regras` (or `## Rules`) — non-negotiable constraints (e.g. never `git push --force`).

4. **Length** — body (excluding frontmatter) MUST be between 400 and 8000 characters. Shorter = under-specified persona; longer = bloated and wastes tokens.

## Hard rules

- File MUST be named `agent.md` (not `agent.mdc`).
- File MUST be UTF-8, LF line endings.
- No HTML, no inline `<script>`, no executable code blocks marked as `bash` that include destructive commands (`rm -rf`, `git push --force`, `DROP TABLE`).
- All file paths referenced inside the persona MUST exist in the bundle or in the platform layout (relative to project root).
- Language MUST match `core/config.yaml → communication_language` recommendation; persona examples in pt-br are preferred for INOSX-shipped bundles.

## Soft recommendations (warnings, not errors)

- First-person voice ("Sou X", "I am X").
- Mention the agent's module and where it sits in the workflow.
- Reference at least one tool id from `manifest.json → uses[]`.
- Reference at least one workflow id from `manifest.json → workflows[]` if the array is non-empty.
- Close with a short Regras section enumerating destructive-action guards.

## Example

See [bundles/echo/agent.md](../bundles/echo/agent.md) — the smallest valid bundle ships a persona that satisfies every rule above.
