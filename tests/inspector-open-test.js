import assert from "node:assert/strict";
import test, { after } from "node:test";
import { once } from "node:events";
import { createServer } from "node:net";
import { EdgeSandbox } from "../src/public/edge-sandbox.js";
import { drainWorkerThreadPool } from "../src/backend/controller/worker-thread-pool.js";
import { createWebSocketTransport } from "../src/collection/collector/websocket-transport.js";
import { createRequestPlan } from "../src/collection/request-protocol/index.js";
import { waitUntil } from './helpers/async-wait.js';

after(drainWorkerThreadPool);

// V8 inspector 的 CDP 地址形如 ws://127.0.0.1:<port>/<uuid>。
const WS_URL = /^ws:\/\/127\.0\.0\.1:\d+\/[0-9a-f-]+$/u;

test("openInspector returns a CDP WebSocket URL on the child-process backend", async () => {
  const sandbox = await EdgeSandbox.create({
    execution: { backend: "child-process" },
    limits: { timeoutMs: 10_000 },
  });
  try {
    const first = await sandbox.openInspector();
    assert.equal(first.alreadyOpen, false);
    assert.match(first.url, WS_URL);

    // 幂等：重复打开复用同一地址并标记 alreadyOpen，而不是抛错。
    const second = await sandbox.openInspector();
    assert.equal(second.alreadyOpen, true);
    assert.equal(second.url, first.url);

    // 使用仓库已有的 WebSocket transport；Node 18/20 也实际收发 CDP。
    const transport = createWebSocketTransport();
    try {
      const response = await transport.send(createRequestPlan({
        method: "GET",
        url: first.url,
        metadata: { websocket: {
          send: [JSON.stringify({
            id: 1,
            method: "Runtime.evaluate",
            params: { expression: "6 * 7", returnByValue: true },
          })],
          maxFrames: 1,
        } },
      }), { signal: AbortSignal.timeout(10_000) });
      const message = JSON.parse(response.websocket.frames[0].data);
      assert.equal(message.id, 1);
      assert.equal(message.error, undefined);
      assert.equal(message.result.result.value, 42);
    } finally {
      await transport.dispose();
    }

    // inspector 挂着时 Realm 仍能正常求值。
    const result = await sandbox.evaluate("1 + 1");
    assert.equal(result.value, 2);
  } finally {
    await sandbox.close();
  }
});

test("openInspector reports a busy port and can retry without losing the Realm", async () => {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  let sandbox;
  try {
    sandbox = await EdgeSandbox.create({ limits: { timeoutMs: 10_000 } });
    await assert.rejects(
      sandbox.openInspector({ port, host: "127.0.0.1" }),
      { code: "ERR_EDGE_INSPECTOR_NO_URL" },
    );
    assert.match((await sandbox.openInspector()).url, WS_URL);
    assert.equal((await sandbox.evaluate("2 + 3")).value, 5);
  } finally {
    await sandbox?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

test("CDP sees the Realm and supports breakpoints, scopes, stepping and resume", {
  // 基础 CDP 收发在上面的测试覆盖全部版本；交互客户端使用 Node 22+ 的原生 WebSocket。
  skip: typeof WebSocket !== "function" && "interactive client requires Node 22+ WebSocket",
  timeout: 60_000,
}, async () => {
  const sandbox = await EdgeSandbox.create({
    execution: { backend: "child-process" },
    limits: { timeoutMs: 30_000 },
  });
  let socket;
  try {
    const opened = await sandbox.openInspector({ port: 0, host: "127.0.0.1" });
    socket = new WebSocket(opened.url);
    const messages = [];
    let socketError;
    socket.addEventListener("message", event => messages.push(JSON.parse(event.data)));
    socket.addEventListener("error", () => { socketError = new Error("CDP socket failed"); });
    async function take(predicate) {
      let index;
      await waitUntil(() => {
        if (socketError) throw socketError;
        index = messages.findIndex(predicate);
        return index !== -1;
      }, { timeoutMs: 10_000, label: "CDP response or event" });
      return messages.splice(index, 1)[0];
    }
    let nextId = 0;
    async function call(method, params = {}) {
      const id = ++nextId;
      socket.send(JSON.stringify({ id, method, params }));
      const response = await take(message => message.id === id);
      assert.equal(response.error, undefined, `${method}: ${JSON.stringify(response.error)}`);
      return response.result;
    }
    await waitUntil(() => {
      if (socketError) throw socketError;
      return socket.readyState === WebSocket.OPEN;
    }, { label: "CDP connection" });
    await call("Runtime.enable");
    const context = (await take(message => message.method === "Runtime.executionContextCreated"
      && message.params.context.name === "edge-root-window")).params.context;
    const evaluated = await call("Runtime.evaluate", {
      contextId: context.id,
      expression: "[location.href, typeof process, typeof require]",
      returnByValue: true,
    });
    assert.equal(evaluated.exceptionDetails, undefined);
    assert.deepEqual(evaluated.result.value, ["https://sandbox.test/", "undefined", "undefined"]);

    await call("Debugger.enable");
    const { breakpointId } = await call("Debugger.setBreakpointByUrl", {
      url: "nv8-inspector-smoke.js", lineNumber: 2,
    });
    const evaluation = sandbox.evaluate([
      "(() => {",
      "  const local = 40;",
      "  const answer = local + 2;",
      "  return answer;",
      "})()",
      "//# sourceURL=nv8-inspector-smoke.js",
    ].join("\n"));
    // 先消费 paused；若测试在恢复前失败，finally 关闭连接，不能留下未处理拒绝。
    evaluation.catch(() => {});
    const paused = (await take(message => message.method === "Debugger.paused")).params;
    assert.ok(paused.hitBreakpoints.includes(breakpointId));
    const local = await call("Debugger.evaluateOnCallFrame", {
      callFrameId: paused.callFrames[0].callFrameId, expression: "local", returnByValue: true,
    });
    assert.equal(local.result.value, 40);
    await call("Debugger.stepOver");
    const stepped = (await take(message => message.method === "Debugger.paused")).params;
    const answer = await call("Debugger.evaluateOnCallFrame", {
      callFrameId: stepped.callFrames[0].callFrameId, expression: "answer", returnByValue: true,
    });
    assert.equal(answer.result.value, 42);
    await call("Debugger.resume");
    assert.equal((await evaluation).value, 42);
    await call("Debugger.disable");

    await sandbox.setPage({ url: "https://inspector-reset.test/" });
    assert.equal((await sandbox.openInspector()).url, opened.url);
    const replacement = (await take(message => message.method === "Runtime.executionContextCreated"
      && message.params.context.name === "edge-root-window")).params.context;
    assert.notEqual(replacement.id, context.id);
    const resetValue = await call("Runtime.evaluate", {
      contextId: replacement.id, expression: "location.href", returnByValue: true,
    });
    assert.equal(resetValue.result.value, "https://inspector-reset.test/");

    // 即使调试器仍连接，close 也应回收子进程及调试连接。
    await sandbox.close();
    await waitUntil(() => socket.readyState === WebSocket.CLOSED, { label: "inspector shutdown" });
    await assert.rejects(sandbox.openInspector(), /closed/u);
  } finally {
    socket?.close();
    await sandbox.close();
  }
});

test("openInspector rejects invalid options before dispatch", async () => {
  const sandbox = await EdgeSandbox.create({
    limits: { timeoutMs: 10_000 },
  });
  try {
    for (const port of [-1, 70_000, 1.5, NaN, null, "9229"]) {
      await assert.rejects(sandbox.openInspector({ port }), /port must be an integer/u);
    }
    for (const options of [null, [], "localhost"]) {
      await assert.rejects(sandbox.openInspector(options), /options must be an object/u);
    }
    await assert.rejects(sandbox.openInspector({ host: 123 }), /host must be a string/u);
  } finally {
    await sandbox.close();
  }
});

test("openInspector is unsupported on the worker-thread backend", async () => {
  const sandbox = await EdgeSandbox.create({
    execution: { backend: "worker-thread" },
    limits: { timeoutMs: 10_000 },
  });
  try {
    await assert.rejects(
      () => sandbox.openInspector(),
      (error) => {
        assert.equal(error.code, "ERR_EDGE_INSPECTOR_UNSUPPORTED");
        return true;
      },
    );
    // 拒绝后 Realm 未被拖垮，仍可继续求值。
    const result = await sandbox.evaluate("2 + 3");
    assert.equal(result.value, 5);
  } finally {
    await sandbox.close();
  }
});
