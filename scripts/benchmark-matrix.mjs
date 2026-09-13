#!/usr/bin/env node
/**
 * Run the performance benchmark across installed Node versions and backends.
 *
 * The output is descriptive evidence, not a pass/fail performance gate. Absolute
 * timings depend on the host; consumers should compare like-for-like rows and
 * use the existing broad performance-budget tests for regression protection.
 *
 * Usage:
 *   node scripts/benchmark-matrix.mjs
 *   node scripts/benchmark-matrix.mjs --iterations 4 --json
 *   NV8_NODE_VERSIONS=18.20.8,24.20.0 node scripts/benchmark-matrix.mjs
 */

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const root = fileURLToPath(new URL("../", import.meta.url));
const benchmark = fileURLToPath(new URL("./benchmark.mjs", import.meta.url));
const args = process.argv.slice(2);
const iterationsIndex = args.indexOf("--iterations");
const iterations = iterationsIndex === -1 ? 4 : Number(args[iterationsIndex + 1]);
const asJson = args.includes("--json");
const backends = ["child-process", "worker-thread"];

if (!Number.isSafeInteger(iterations) || iterations < 1 || iterations > 100) {
  throw new RangeError("--iterations must be an integer from 1 to 100");
}

const versions = requestedVersions();
if (versions.length === 0) {
  throw new Error("No installed Node versions found; set NV8_NODE_VERSIONS");
}

const rows = [];
for (const version of versions) {
  const node = nodeBinary(version);
  if (!existsSync(node)) {
    if (!asJson) console.error(`skip Node ${version}: ${node} does not exist`);
    continue;
  }
  for (const backend of backends) {
    const result = spawnSync(
      node,
      ["--experimental-vm-modules", benchmark, "--iterations", `${iterations}`, "--backend", backend, "--json"],
      {
        cwd: root,
        encoding: "utf8",
        env: { ...process.env, NODE_NO_WARNINGS: "1" },
        timeout: 15 * 60 * 1000,
      },
    );
    if (result.error !== undefined || result.status !== 0) {
      const detail = `${result.stderr ?? ""}`.trim();
      throw new Error(
        `benchmark failed for Node ${version} / ${backend}`
        + (detail === "" ? "" : `: ${detail}`),
      );
    }
    try {
      rows.push(JSON.parse(result.stdout));
    } catch (error) {
      throw new Error(
        `benchmark returned invalid JSON for Node ${version} / ${backend}`,
        { cause: error },
      );
    }
  }
}

if (rows.length === 0) throw new Error("No benchmark rows were collected");
const report = {
  schema: "nv8-performance-matrix/1",
  iterations,
  rows,
};

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("Node version   backend         cold median/p90   warm run median/p90   realm median/p90   RSS Δ MiB");
  for (const row of rows) {
    const measurements = new Map(row.measurements.map((entry) => [entry.label, entry]));
    const cold = measurements.get("冷启动（create → 首次 run）");
    const warm = measurements.get("热复用（单次 run）");
    const realm = measurements.get("Realm 创建+销毁一轮");
    console.log(
      `${row.node.padEnd(14)}${row.backend.padEnd(17)}`
      + `${formatPair(cold)}         ${formatPair(warm)}             ${formatPair(realm)}       `
      + `${row.memory.deltaMiB.toFixed(2)}`,
    );
  }
}

function formatPair(entry) {
  return `${entry.median.toFixed(2)}/${entry.p90.toFixed(2)}ms`.padEnd(20);
}

function requestedVersions() {
  const explicit = process.env.NV8_NODE_VERSIONS;
  if (explicit !== undefined && explicit.trim() !== "") {
    return [...new Set(explicit.split(",").map((value) => value.trim()).filter(Boolean))];
  }
  const directory = path.join(process.env.HOME ?? "", ".nvm", "versions", "node");
  if (!existsSync(directory)) return [process.versions.node];
  return readdirSync(directory)
    .filter((name) => /^v\d+\.\d+\.\d+$/.test(name))
    .map((name) => name.slice(1))
    .sort(compareVersions);
}

function nodeBinary(version) {
  if (version === process.versions.node) return process.execPath;
  const executable = process.platform === "win32" ? "node.exe" : "node";
  return path.join(process.env.HOME ?? "", ".nvm", "versions", "node", `v${version}`, "bin", executable);
}

function compareVersions(left, right) {
  const a = left.split(".").map(Number);
  const b = right.split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
}
