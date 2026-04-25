#!/usr/bin/env node
// Validates every bundle in /bundles against the schemas in /schemas.
// Exits non-zero on any failure. Used by CI and by local `npm test`.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import matter from "gray-matter";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemasDir = path.join(repoRoot, "schemas");
const bundlesDir = path.join(repoRoot, "bundles");

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const bundleSchema = JSON.parse(fs.readFileSync(path.join(schemasDir, "agent-bundle.v1.json"), "utf-8"));
const visualSchema = JSON.parse(fs.readFileSync(path.join(schemasDir, "agent-visual.v1.json"), "utf-8"));

const validateBundle = ajv.compile(bundleSchema);
const validateVisual = ajv.compile(visualSchema);

const REQUIRED_SECTIONS = [
  /^##\s+(Identidade|Identity)\b/m,
  /^##\s+(Como trabalho|How I work)\b/m,
  /^##\s+(Ferramentas|Tools)\b/m,
  /^##\s+(Mem[oó]ria|Memory)\b/m,
  /^##\s+(Regras|Rules)\b/m,
];

const errors = [];

function fail(bundleId, msg) {
  errors.push(`[${bundleId}] ${msg}`);
}

function validatePersona(bundleId, content, expectedName) {
  const parsed = matter(content);
  if (!parsed.data?.name) return fail(bundleId, "agent.md frontmatter missing 'name'");
  if (!parsed.data?.description) return fail(bundleId, "agent.md frontmatter missing 'description'");
  if (parsed.data.name !== expectedName) {
    return fail(bundleId, `agent.md frontmatter name '${parsed.data.name}' != manifest displayName '${expectedName}'`);
  }
  const desc = parsed.data.description;
  if (typeof desc !== "string" || desc.length < 20 || desc.length > 240) {
    return fail(bundleId, `agent.md description must be 20-240 chars (got ${desc?.length ?? 0})`);
  }
  const body = parsed.content.trim();
  if (body.length < 400 || body.length > 8000) {
    return fail(bundleId, `agent.md body must be 400-8000 chars (got ${body.length})`);
  }
  if (!new RegExp(`^#\\s+${expectedName}\\b`, "m").test(body)) {
    return fail(bundleId, `agent.md must contain '# ${expectedName}' H1 heading`);
  }
  for (const re of REQUIRED_SECTIONS) {
    if (!re.test(body)) fail(bundleId, `agent.md missing required section matching ${re}`);
  }
}

const ids = fs.readdirSync(bundlesDir).filter(d => fs.statSync(path.join(bundlesDir, d)).isDirectory());
console.log(`Found ${ids.length} bundle(s): ${ids.join(", ")}`);

for (const id of ids) {
  const dir = path.join(bundlesDir, id);
  const required = ["manifest.json", "visual.json", "agent.md", "README.md"];
  for (const f of required) {
    if (!fs.existsSync(path.join(dir, f))) fail(id, `missing required file: ${f}`);
  }
  if (errors.some(e => e.startsWith(`[${id}]`))) continue;

  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf-8"));
  if (!validateBundle(manifest)) {
    for (const e of validateBundle.errors) fail(id, `manifest.json: ${e.instancePath} ${e.message}`);
    continue;
  }
  if (manifest.id !== id) fail(id, `manifest.json id '${manifest.id}' != folder name '${id}'`);

  const visual = JSON.parse(fs.readFileSync(path.join(dir, "visual.json"), "utf-8"));
  if (!validateVisual(visual)) {
    for (const e of validateVisual.errors) fail(id, `visual.json: ${e.instancePath} ${e.message}`);
  }

  const persona = fs.readFileSync(path.join(dir, "agent.md"), "utf-8");
  validatePersona(id, persona, manifest.displayName);
}

if (errors.length) {
  console.error("\nValidation failed:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("\nAll bundles valid.");
