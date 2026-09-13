/**
 * 后端清理与崩溃恢复回归（IKF39Z-1/2/3/6/7、IKFD9M、IKFD9O）。
 *
 * 覆盖：
 * - INIT 失败后连接必须可重试且不残留句柄；
 * - 崩溃按 signal/退出码分类，stderr 尾部有界附着；
 * - 默认 fail-fast 不再静默冷启，restart 策略显式重启并通知；
 * - setPage 只有 RESET_REALM 不支持时才降级，真实失败不吞根因；
 * - stdin 背压与 worker post 串行链。
 */

import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { Opcode } from "../src/backend/protocol/constants.js";
import {
  ChildProcessConnection,
  appendStderrTail,
  childExitError,
} from "../src/backend/controller/child-process.js";
import {
  PooledWorkerThreadConnection,
  drainWorkerThreadPool,
} from "../src/backend/controller/worker-thread-pool.js";
import { RuntimeController } from "../src/backend/controller/runtime-controller.js";
import { normalizeRuntimeOptions } from "../src/public/edge-runtime-options.js";
import { waitUntil } from "./helpers/async-wait.js";

const BACKENDS = ["child-process", "worker-thread"];

const RUNTIME_LIMITS = Object.freeze({
  maxHeapBytes: 512 * 1024 * 1024,
  maxPayloadBytes: 8 * 1024 * 1024,
  maxValueDepth: 64,
  maxFrameQueueBytes: 32 * 1024 * 1024,
  timeoutMs: 15_000,
});

function normalizedFor(backend, limitOverrides = {}) {
  return normalizeRuntimeOptions({
    execution: { backend },
    limits: { timeoutMs: 30_000, maxRealms: 4, ...limitOverrides },
  });
}

function initPayloadFor(backend, overrides = {}) {
  const options = normalizedFor(backend);
  return {
    page: options.page,
    fingerprint: overrides.fingerprint ?? options.fingerprint,
    proxyTrace: { ...options.proxyTrace, enabled: false },
    networkCapture: options.networkCapture,
    replay: options.replay,
    evidence: options.evidence,
    limits: options.limits,
    persistence: null,
  };
}

function runtimeHandles() {
  return process.getActiveResourcesInfo().filter(
    resource => resource === "ChildProcess" || resource === "Worker",
  );
}

async function waitForNoRuntimeHandles() {
  await waitUntil(() => runtimeHandles().length === 0, {
    label: "runtime handles to drain",
  });
}

for (const backend of BACKENDS) {
  test(`INIT failure leaves ${backend} retryable with no residual handles`, async () => {
    const connection = backend === "child-process"
      ? new ChildProcessConnection(RUNTIME_LIMITS)
      : new PooledWorkerThreadConnection(RUNTIME_LIMITS);
    try {
      // 有 fingerprint（spawn 需要），但缺 proxyTrace：子侧 RuntimePool
      // 构造会抛错并回 ERROR 响应，此时连接不能进入永久 "already starting"。
      await assert.rejects(
        () => connection.start({ fingerprint: { timezone: "UTC" } }),
      );
      const handle = backend === "child-process"
        ? connection.child
        : connection.worker;
      assert.equal(handle, null);
      assert.equal(connection.ready, false);

      await connection.start(initPayloadFor(backend));
      assert.equal(connection.ready, true);
      const result = await connection.request(Opcode.EVALUATE, {
        source: "40 + 2",
      });
      assert.equal(result.type, "number");
      assert.equal(result.value, 42);
    } finally {
      connection.terminate();
    }
    await waitForNoRuntimeHandles();
    assert.deepEqual(runtimeHandles(), []);
  });
}

test("child exit errors classify signals and carry a bounded stderr tail", () => {
  const exited = childExitError(3, null, Buffer.from("exit detail"));
  assert.equal(exited.code, "ERR_EDGE_CHILD_EXIT");
  assert.equal(exited.exitCode, 3);
  assert.equal(exited.signal, null);
  assert.equal(exited.stderrTail, "exit detail");

  const signaled = childExitError(null, "SIGABRT", Buffer.from("abort detail"));
  assert.equal(signaled.code, "ERR_EDGE_CHILD_SIGNAL");
  assert.equal(signaled.exitCode, null);
  assert.equal(signaled.signal, "SIGABRT");
  assert.equal(signaled.stderrTail, "abort detail");

  let tail = Buffer.alloc(0);
  for (let index = 0; index < 10; index += 1) {
    tail = appendStderrTail(tail, Buffer.from("x".repeat(1024)));
  }
  assert.equal(tail.length, 4 * 1024);
});

for (const backend of BACKENDS) {
  test(`a ${backend} crash fails fast by default and reports state loss`, async () => {
    const crashes = [];
    const controller = new RuntimeController({
      ...normalizedFor(backend, { timeoutMs: 400 }),
      onCrash: crash => crashes.push(crash),
    });
    try {
      await controller.start();
      await assert.rejects(
        () => controller.evaluate("while (true) {}"),
        error => error.code === "ERR_EDGE_SANDBOX_TIMEOUT",
      );
      await assert.rejects(
        () => controller.evaluate("1 + 1"),
        error => (
          error.code === "ERR_EDGE_RUNTIME_CRASHED"
          && error.crash?.code === "ERR_EDGE_SANDBOX_TIMEOUT"
        ),
      );
      assert.equal(crashes.length, 1);
      assert.equal(crashes[0].code, "ERR_EDGE_SANDBOX_TIMEOUT");
    } finally {
      await controller.close();
    }
  });
}

test("restart policy cold-starts a new realm after a crash", async () => {
  const crashes = [];
  const controller = new RuntimeController({
    ...normalizedFor("child-process", { timeoutMs: 400 }),
    execution: { backend: "child-process", restart: "restart" },
    onCrash: crash => crashes.push(crash),
  });
  try {
    await controller.start();
    await assert.rejects(
      () => controller.evaluate("while (true) {}"),
      error => error.code === "ERR_EDGE_SANDBOX_TIMEOUT",
    );
    const result = await controller.evaluate("1 + 1");
    assert.equal(result.value, 2);
    assert.equal(crashes.length, 1);
  } finally {
    await controller.close();
  }
});

function unsupportedResetError() {
  const error = new Error("Unknown request opcode");
  error.code = "ERR_EDGE_PROTOCOL_REQUEST";
  return error;
}

function fakePage() {
  return {
    url: "https://setpage.test/",
    html: "<!doctype html><html><body></body></html>",
    referrer: "",
    contentType: "text/html",
  };
}

function fakeConnection(requestImpl) {
  const calls = [];
  return {
    ready: true,
    onExit: null,
    calls,
    async start() {
      calls.push("start");
    },
    async request(opcode) {
      calls.push(opcode);
      return requestImpl(opcode);
    },
    terminate() {
      calls.push("terminate");
    },
  };
}

test("setPage falls back only when RESET_REALM is unsupported", async () => {
  const resetError = unsupportedResetError();
  const first = fakeConnection(async (opcode) => {
    if (opcode === Opcode.RESET_REALM) throw resetError;
    if (opcode === Opcode.SET_PAGE) return { saved: true };
    throw new Error("unexpected opcode");
  });
  const second = fakeConnection(async () => undefined);
  const controller = new RuntimeController(normalizedFor("child-process"));
  controller.connection = first;
  controller.createConnection = () => second;
  try {
    await controller.setPage(fakePage());
    assert.ok(first.calls.includes(Opcode.SET_PAGE));
    assert.ok(first.calls.includes("terminate"));
    assert.ok(second.calls.includes("start"));
  } finally {
    controller.closed = true;
  }
});

test("setPage does not kill the realm on a real RESET_REALM failure", async () => {
  const timeoutError = Object.assign(new Error("reset failed"), {
    code: "ERR_EDGE_SANDBOX_TIMEOUT",
  });
  const first = fakeConnection(async () => {
    throw timeoutError;
  });
  const controller = new RuntimeController(normalizedFor("child-process"));
  controller.connection = first;
  try {
    await assert.rejects(
      () => controller.setPage(fakePage()),
      error => error === timeoutError,
    );
    assert.equal(first.calls.includes(Opcode.SET_PAGE), false);
    assert.equal(first.calls.includes("terminate"), false);
  } finally {
    controller.closed = true;
  }
});

test("setPage fallback failure preserves the original RESET_REALM error as cause", async () => {
  const resetError = unsupportedResetError();
  const fallbackError = Object.assign(new Error("SET_PAGE failed"), {
    code: "ERR_EDGE_EVALUATION",
  });
  const first = fakeConnection(async (opcode) => {
    if (opcode === Opcode.RESET_REALM) throw resetError;
    throw fallbackError;
  });
  const controller = new RuntimeController(normalizedFor("child-process"));
  controller.connection = first;
  try {
    await assert.rejects(
      () => controller.setPage(fakePage()),
      error => error === fallbackError && error.cause === resetError,
    );
  } finally {
    controller.closed = true;
  }
});

function blockingChild() {
  const stdin = new EventEmitter();
  stdin.destroy = () => {};
  const writes = [];
  stdin.write = (frame, callback) => {
    writes.push({ frame, callback });
    return false;
  };
  const stdout = new EventEmitter();
  stdout.destroy = () => {};
  const stderr = new EventEmitter();
  stderr.destroy = () => {};
  return {
    child: { stdin, stdout, stderr, kill() {} },
    writes,
  };
}

test("child writes serialize and wait for drain under backpressure", async () => {
  const connection = new ChildProcessConnection(RUNTIME_LIMITS);
  const { child, writes } = blockingChild();
  connection.child = child;
  connection.ready = true;
  connection.rawRequest(Opcode.EVALUATE, { source: "1" }, 5_000).catch(() => {});
  connection.rawRequest(Opcode.EVALUATE, { source: "2" }, 5_000).catch(() => {});
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(writes.length, 1);

  child.stdin.emit("drain");
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(writes.length, 2);

  connection.terminate();
});

test("worker posts serialize through the bounded chain", async () => {
  const connection = new PooledWorkerThreadConnection(RUNTIME_LIMITS);
  const posts = [];
  const worker = new EventEmitter();
  worker.postMessage = frame => posts.push(frame.length);
  worker.terminate = () => {
    worker.terminated = (worker.terminated ?? 0) + 1;
    return Promise.resolve(0);
  };
  connection.worker = worker;
  connection.ready = true;
  connection.rawRequest(Opcode.EVALUATE, { source: "1" }, 5_000).catch(() => {});
  connection.rawRequest(Opcode.EVALUATE, { source: "2" }, 5_000).catch(() => {});
  await waitUntil(() => posts.length === 2, { label: "worker posts" });
  assert.equal(posts.length, 2);
  connection.terminate();
});

test("frame queue accounting includes the in-flight bootstrap frame", async () => {
  const connection = new ChildProcessConnection({
    ...RUNTIME_LIMITS,
    maxFrameQueueBytes: 100,
  });
  const { child } = blockingChild();
  connection.child = child;
  // INIT 是 bootstrap 帧：即使超过很小的队列上限也放行。
  connection.rawRequest(Opcode.INIT, { a: 1 }, 5_000).catch(() => {});
  // 第二帧必须把在途 INIT 的字节算进去。
  assert.throws(
    () => connection.rawRequest(
      Opcode.EVALUATE,
      { source: "x".repeat(200) },
      5_000,
    ),
    error => error.code === "LIMIT_FRAME_QUEUE_BYTES",
  );
  connection.terminate();
});

test("worker closeAndRecycle reclaims a failed ready=false handle", async () => {
  const connection = new PooledWorkerThreadConnection(RUNTIME_LIMITS);
  const worker = new EventEmitter();
  let terminated = 0;
  worker.postMessage = () => {};
  worker.terminate = () => {
    terminated += 1;
    return Promise.resolve(0);
  };
  connection.worker = worker;
  connection.ready = false;
  await connection.closeAndRecycle();
  assert.equal(connection.worker, null);
  assert.equal(terminated, 1);
});

test("idle worker pool matches the fingerprint timezone", async () => {
  const utc = new PooledWorkerThreadConnection(RUNTIME_LIMITS);
  await utc.start(initPayloadFor("worker-thread", {
    fingerprint: {
      ...normalizedFor("worker-thread").fingerprint,
      timezone: "UTC",
    },
  }));
  await utc.closeAndRecycle();

  const sameZone = new PooledWorkerThreadConnection(RUNTIME_LIMITS);
  await sameZone.start(initPayloadFor("worker-thread", {
    fingerprint: {
      ...normalizedFor("worker-thread").fingerprint,
      timezone: "UTC",
    },
  }));
  assert.equal(sameZone.reused, true);
  await sameZone.closeAndRecycle();

  const otherZone = new PooledWorkerThreadConnection(RUNTIME_LIMITS);
  await otherZone.start(initPayloadFor("worker-thread", {
    fingerprint: {
      ...normalizedFor("worker-thread").fingerprint,
      timezone: "Asia/Shanghai",
    },
  }));
  assert.equal(otherZone.reused, false);
  await otherZone.closeAndRecycle();

  drainWorkerThreadPool();
});
