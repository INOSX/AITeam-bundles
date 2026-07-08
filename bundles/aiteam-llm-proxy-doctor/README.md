# Dr. AITEAM-X - LLM Proxy Doctor

Dr. AITEAM-X is a support bundle for AITEAM-X LLM Proxy and Operations Table reliability.

## Purpose

The Doctor helps users understand and recover from:

- provider rate limits;
- billing or quota issues;
- missing or disabled provider routes;
- unavailable model catalogs;
- invalid preferred model slugs;
- stale AgentOps runs;
- task-safe continuation after provider limits;
- missing scope authorization for files outside `allowedPaths`;
- review/parser failures that leave tasks in `pending`.

## Safety Model

The Doctor diagnoses first and mutates only after explicit user confirmation. It must never expose API keys, headers, base URLs, raw provider responses, prompts, private memory, or full local logs.

## Expected Platform Integration

The AITEAM-X app can link to this bundle from recovery surfaces such as:

- `AITEAM-X LLM Proxy Status`;
- provider Setup cards;
- Operations Table failed/recoverable tasks;
- scope authorization cards;
- stale run repair prompts.

If the bundle is not installed, the app should suggest installation instead of trying to run Doctor diagnostics.
