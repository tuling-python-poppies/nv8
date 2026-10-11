#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import process from "node:process";
import { createReverseEvidenceDiff } from "../src/public/target-evidence.js";

const [beforePath, afterPath] = process.argv.slice(2);
if (!beforePath || !afterPath) {
  console.error("usage: node scripts/diff-reverse-evidence.mjs <before.json> <after.json>");
  process.exit(2);
}

const before = JSON.parse(await readFile(beforePath, "utf8"));
const after = JSON.parse(await readFile(afterPath, "utf8"));
const diff = createReverseEvidenceDiff(before, after);
console.log(JSON.stringify(diff, null, 2));
process.exitCode = diff.changed ? 1 : 0;
