import assert from "node:assert/strict";
import test from "node:test";

import {
  applyTargetPatches,
  collectReverseEvidence,
  createCausalRecorder,
  createReverseEvidenceDiff,
  createTargetArtifactManifest,
  sha256Text,
} from "../src/public/target-evidence.js";

test("target manifests bind patches to source and record applied hashes", () => {
  const source = "const answer = 1;";
  const manifest = createTargetArtifactManifest({
    targetId: "fixture",
    source,
    patches: [{
      id: "replace-answer",
      reason: "fixture requires the recorded target branch",
      find: "const answer = 1;",
      replace: "const answer = 2;",
      expectedOccurrences: 1,
    }],
  });
  const result = applyTargetPatches(source, manifest);
  assert.equal(result.source, "const answer = 2;");
  assert.equal(result.applied[0].sourceSha256, sha256Text(source));
  assert.notEqual(result.applied[0].beforeSha256, result.applied[0].afterSha256);
  assert.throws(() => applyTargetPatches("const answer = 3;", manifest), /SHA-256/);
});

test("target patches fail closed on occurrence drift", () => {
  const manifest = createTargetArtifactManifest({
    targetId: "fixture",
    source: "x = 1;",
    patches: [{ id: "once", reason: "test", find: "x", replace: "y" }],
  });
  assert.throws(() => applyTargetPatches("x = 1; x = 1;", manifest), error => (
    error.code === "TARGET_SOURCE_DIGEST_MISMATCH"
  ));
});

test("manifests reject unknown keys and patch digests", () => {
  assert.throws(
    () => createTargetArtifactManifest({ targetId: "fixture", extra: true }),
    /extra is not supported/,
  );
  assert.throws(
    () => createTargetArtifactManifest({
      targetId: "fixture",
      patches: [{ id: "p", reason: "test", find: "x", replace: "y", sourceSha256: "bad" }],
    }),
    /sourceSha256 must be a lowercase SHA-256 digest/,
  );
});

test("causal recorder preserves parent links and bounds its log", () => {
  const recorder = createCausalRecorder({ maxEvents: 4 });
  const root = recorder.startSpan("page", { url: "https://example.test" });
  recorder.event("worker.created", { workerId: "w1" }, root);
  const child = recorder.startSpan("worker.message", { direction: "sent" }, root);
  recorder.endSpan(child, { ok: true });
  recorder.endSpan(root, { ok: true });
  const snapshot = recorder.snapshot();
  assert.equal(snapshot.length, 4);
  assert.equal(snapshot[1].parentId, root);
  assert.ok(snapshot.some(entry => entry.id === child && entry.type === "span.start"));
  assert.throws(() => recorder.endSpan(child), /unknown or already closed/);
});

test("reverse evidence is serializable and diffable", async () => {
  const sandbox = {
    options: { fingerprint: { browserMajorVersion: 154, navigator: { userAgent: "ua" }, screen: {} } },
    async proxyTrace() { return [{ api: "window.fetch" }]; },
    async networkRequests() { return [{ method: "GET", url: "https://example.test" }]; },
    async resources() { return { realms: 1 }; },
  };
  const first = await collectReverseEvidence({ sandbox, targetId: "fixture", acceptance: { level: "verified" } });
  const second = await collectReverseEvidence({
    sandbox,
    targetId: "fixture",
    acceptance: { level: "headers" },
  });
  const diff = createReverseEvidenceDiff(first, second);
  assert.equal(diff.changed, true);
  assert.ok(diff.changes.some(change => change.path.includes("acceptance")));
  assert.equal(typeof first.digest, "string");
});

test("reverse evidence redacts sensitive request material by default", async () => {
  const sandbox = {
    options: {},
    async proxyTrace() { return []; },
    async networkRequests() { return [{
      url: "https://example.test/a?token=secret&page=2",
      headers: [["authorization", "Bearer secret"], ["x-safe", "ok"]],
      bodyText: "private-body",
    }]; },
    async resources() { return null; },
  };
  const evidence = await collectReverseEvidence({ sandbox });
  assert.equal(evidence.requests[0].headers[0][1], "[redacted]");
  assert.equal(evidence.requests[0].bodyText, "[redacted]");
  assert.equal(evidence.redaction, "redacted");
  assert.match(evidence.requests[0].url, /token=%5Bredacted%5D/);
  const sensitive = await collectReverseEvidence({ sandbox, includeSensitive: true });
  assert.equal(sensitive.requests[0].bodyText, "private-body");
  assert.equal(sensitive.redaction, "original");
});

test("EdgeSandbox and quick wrapper expose unified runtime evidence", async () => {
  const { createSandbox } = await import("../src/public/create-sandbox.js");
  const sandbox = await createSandbox("https://evidence.test/", {
    limits: { timeoutMs: 30_000 },
  });
  try {
    const evidence = await sandbox.runtimeEvidence({ targetId: "runtime-evidence-test" });
    assert.equal(evidence.targetId, "runtime-evidence-test");
    assert.equal(evidence.schemaVersion, "nv8.reverse-evidence/v1");
    assert.match(evidence.digest, /^[a-f0-9]{64}$/u);
    assert.ok(Array.isArray(evidence.requests));
    assert.ok(evidence.resources);
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});
