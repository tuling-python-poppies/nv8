import assert from "node:assert/strict";
import test, { after } from "node:test";
import { createAgentSession, validateEnvironmentPatch } from "../src/index.js";
import { drainWorkerThreadPool } from "../src/backend/controller/worker-thread-pool.js";

after(drainWorkerThreadPool);

test("Agent patches are declarative, versioned, and fail closed", async () => {
  assert.throws(
    () => validateEnvironmentPatch({
      baseVersion: 0,
      reason: "bad field",
      changes: { limits: { timeoutMs: 1 } },
    }),
    /not patchable/u,
  );
  assert.throws(
    () => validateEnvironmentPatch({
      baseVersion: 0,
      reason: "empty changes",
      changes: {},
    }),
    /must not be empty/u,
  );
  assert.throws(
    () => validateEnvironmentPatch({
      baseVersion: 0,
      reason: "expired",
      expiresAt: "2000-01-01T00:00:00.000Z",
      changes: { page: "https://expired.test/" },
    }),
    { code: "ERR_NV8_AGENT_PATCH_EXPIRED" },
  );
});

test("createAgentSession rejects sandbox options leaked to the top level", async () => {
  // 扁平形式混入 sandbox 字段时必须 fail closed，不能静默丢弃 page。
  await assert.rejects(
    createAgentSession({ agentId: "x", agentVersion: "1", page: { url: "https://x.test/" } }),
    /unexpected top-level option "page"/u,
  );
});

test("Agent session observes, rebuilds, rolls back, and serializes changes", async () => {
  const session = await createAgentSession({
    agent: {
      agentId: "pi",
      agentVersion: "test",
      agentCapabilities: ["observe", "patch"],
    },
    sandbox: {
      execution: { backend: "worker-thread" },
      proxyTrace: { enabled: true },
      limits: { timeoutMs: 10_000 },
    },
  });
  try {
    assert.equal(session.snapshot.environmentVersion, 0);
    await assert.rejects(
      session.applyEnvironmentPatch({
        baseVersion: 0,
        reason: "bad nested field",
        changes: { fingerprint: { navigator: { unknown: true } } },
      }),
      /not an allowed environment path/u,
    );
    const pageChange = await session.applyEnvironmentPatch({
      baseVersion: 0,
      reason: "load target page",
      auditId: "audit-page",
      changes: {
        page: {
          url: "https://agent.test/",
          html: "<!doctype html><title>agent</title>",
        },
      },
    });
    assert.equal(pageChange.change.auditId, "audit-page");
    assert.equal(pageChange.change.mode, "reset-realm");

    await assert.rejects(
      session.applyEnvironmentPatch({
        baseVersion: 0,
        reason: "stale patch",
        changes: { page: "https://stale.test/" },
      }),
      { code: "ERR_NV8_AGENT_VERSION_CONFLICT" },
    );

    const fingerprintChange = await session.applyEnvironmentPatch({
      baseVersion: 1,
      reason: "match observed screen",
      changes: { fingerprint: { screen: { width: 1440, height: 900 } } },
    });
    assert.equal(fingerprintChange.change.mode, "recreate-sandbox");
    assert.equal((await session.evaluate("screen.width")).value, 1440);

    const observation = await session.observe();
    assert.equal(observation.environment.environmentVersion, 2);
    assert.equal(Array.isArray(observation.trace), true);
    assert.equal(Array.isArray(observation.requests), true);

    const rollback = await session.rollback(1);
    assert.equal(rollback.change.targetVersion, 1);
    assert.equal((await session.evaluate("screen.width")).value, 1920);
  } finally {
    await session.close();
  }
});

test("agentCapabilities are advisory-only and never gate methods", async () => {
  // 声明只有 observe 能力的 agent 仍能成功 patch——capability 不参与鉴权，
  // 只进入审计快照。权限边界完全由 patchable 字段白名单强制。
  const session = await createAgentSession({
    agent: { agentId: "observer", agentVersion: "test", agentCapabilities: ["observe"] },
    sandbox: { execution: { backend: "worker-thread" }, limits: { timeoutMs: 10_000 } },
  });
  try {
    assert.deepEqual(session.snapshot.agent.agentCapabilities, ["observe"]);
    const patched = await session.applyEnvironmentPatch({
      baseVersion: 0,
      reason: "advisory capability does not block patch",
      changes: { page: "https://observer.test/" },
    });
    assert.equal(patched.environment.environmentVersion, 1);
  } finally {
    await session.close();
  }
});

test("Agent session compares an environment hypothesis without mutating the session", async () => {
  const session = await createAgentSession({
    agent: { agentId: "codex", agentVersion: "test", agentCapabilities: ["observe"] },
    sandbox: {
      execution: { backend: "worker-thread" },
      proxyTrace: { enabled: true },
      limits: { timeoutMs: 10_000 },
    },
  });
  try {
    const comparison = await session.compareEnvironment(
      "JSON.stringify({ width: screen.width, ua: navigator.userAgent })",
      {
        baseVersion: 0,
        reason: "test desktop geometry hypothesis",
        changes: { fingerprint: { screen: { width: 1440, height: 900 } } },
      },
    );
    assert.equal(comparison.environmentVersion, 0);
    assert.equal(comparison.before.evaluation.value.includes('1920'), true);
    assert.equal(comparison.after.evaluation.value.includes('1440'), true);
    assert.equal(comparison.diff.changed, true);
    assert.equal(comparison.diff.evaluationChanged, true);
    assert.equal(session.snapshot.environmentVersion, 0);
    assert.equal((await session.evaluate("screen.width")).value, 1920);
  } finally {
    await session.close();
  }
});

test("Agent session serializes concurrent operations", async () => {
  const session = await createAgentSession({
    agent: { agentId: "codex", agentVersion: "test" },
    sandbox: { execution: { backend: "worker-thread" }, limits: { timeoutMs: 10_000 } },
  });
  try {
    const results = await Promise.all([
      session.applyEnvironmentPatch({
        baseVersion: 0,
        reason: "first",
        changes: { page: "https://first.test/" },
      }),
      session.applyEnvironmentPatch({
        baseVersion: 0,
        reason: "second stale patch",
        changes: { page: "https://second.test/" },
      }).catch(error => error),
    ]);
    assert.equal(results[0].environment.environmentVersion, 1);
    assert.equal(results[1].code, "ERR_NV8_AGENT_VERSION_CONFLICT");
  } finally {
    await session.close();
  }
});
