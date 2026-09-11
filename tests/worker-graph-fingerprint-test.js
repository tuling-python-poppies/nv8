import assert from "node:assert/strict";
import test from "node:test";
import { createWorkerGraphFingerprint } from "../src/infra/fingerprint/worker-graph.js";

test("worker graph fingerprints are stable across insertion order", () => {
  const first = createWorkerGraphFingerprint({
    kind: "shared-worker",
    url: "https://example.test/shared.js",
    name: "shared",
    type: "module",
    browserMajorVersion: 152,
    modules: [
      "https://example.test/shared.js",
      "https://example.test/helper.js",
      "https://example.test/helper.js",
    ],
    moduleCache: [
      { url: "https://example.test/helper.js", status: "evaluated" },
      { url: "https://example.test/shared.js", status: "evaluated" },
    ],
  });
  const second = createWorkerGraphFingerprint({
    kind: "shared-worker",
    url: "https://example.test/shared.js",
    name: "shared",
    type: "module",
    browserMajorVersion: 152,
    modules: [
      "https://example.test/helper.js",
      "https://example.test/shared.js",
    ],
    moduleCache: [
      { url: "https://example.test/shared.js", status: "evaluated" },
      { url: "https://example.test/helper.js", status: "evaluated" },
    ],
  });

  assert.equal(first.digest, second.digest);
  assert.deepEqual(first.graph.modules, [
    "https://example.test/helper.js",
    "https://example.test/shared.js",
  ]);
  assert.equal(first.cache.moduleCount, 2);
  assert.deepEqual(JSON.parse(JSON.stringify(first)), first);
});

test("worker graph fingerprints distinguish graph version inputs", () => {
  const base = createWorkerGraphFingerprint({
    kind: "paint-worklet",
    url: "https://example.test/paint.js",
    modules: ["https://example.test/paint.js"],
    moduleCache: [{ url: "https://example.test/paint.js", status: "evaluated" }],
    browserMajorVersion: 152,
  });
  const changed = createWorkerGraphFingerprint({
    kind: "paint-worklet",
    url: "https://example.test/paint.js",
    modules: [
      "https://example.test/paint.js",
      "https://example.test/colors.js",
    ],
    moduleCache: [
      { url: "https://example.test/paint.js", status: "evaluated" },
      { url: "https://example.test/colors.js", status: "evaluated" },
    ],
    browserMajorVersion: 152,
  });

  assert.notEqual(base.digest, changed.digest);
  assert.notDeepEqual(base.cache.modules, changed.cache.modules);
});
