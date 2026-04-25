#!/usr/bin/env node
// Confirms index.json lists exactly the bundles present on disk and that each
// catalog entry's metadata matches the bundle's manifest.json.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(repoRoot, "index.json"), "utf-8"));
const bundlesDir = path.join(repoRoot, "bundles");

const onDisk = new Set(fs.readdirSync(bundlesDir).filter(d => fs.statSync(path.join(bundlesDir, d)).isDirectory()));
const inCatalog = new Set(catalog.bundles.map(b => b.id));

const missing = [...onDisk].filter(id => !inCatalog.has(id));
const extra = [...inCatalog].filter(id => !onDisk.has(id));

const errors = [];
if (missing.length) errors.push(`Bundles on disk but missing from index.json: ${missing.join(", ")}`);
if (extra.length) errors.push(`Bundles in index.json but missing from disk: ${extra.join(", ")}`);

for (const entry of catalog.bundles) {
  const manifestPath = path.join(bundlesDir, entry.id, "manifest.json");
  if (!fs.existsSync(manifestPath)) continue;
  const m = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const mismatches = [];
  for (const key of ["version", "module", "displayName", "title", "icon"]) {
    if (entry[key] !== m[key]) mismatches.push(`${key}: catalog='${entry[key]}' manifest='${m[key]}'`);
  }
  if (entry.path !== `bundles/${entry.id}`) mismatches.push(`path should be 'bundles/${entry.id}'`);
  if (mismatches.length) errors.push(`[${entry.id}] catalog/manifest mismatch: ${mismatches.join("; ")}`);
}

if (errors.length) {
  console.error("Catalog check failed:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("Catalog matches filesystem.");
