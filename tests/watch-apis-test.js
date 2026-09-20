import assert from "node:assert/strict";
import test, { after } from "node:test";
import { EdgeSandbox } from "../src/public/edge-sandbox.js";
import { drainWorkerThreadPool } from "../src/backend/controller/worker-thread-pool.js";
import { waitUntil } from "./helpers/async-wait.js";

after(drainWorkerThreadPool);

// document.cookie 的 getter 带 traceGetter("window.Document.prototype.cookie", ...)，
// 子串 "cookie" 命中即断——这是本测试的观察点。
const WATCHED_SCRIPT = [
  "(() => {",
  "  const value = document.cookie;", // line 2：命中断点
  "  return typeof value;",
  "})()",
  "//# sourceURL=nv8-watch-smoke.js",
].join("\n");

test("watchApis rejects invalid input before dispatch", async () => {
  const sandbox = await EdgeSandbox.create({ limits: { timeoutMs: 10_000 } });
  try {
    for (const bad of [123, "cookie", null, {}]) {
      await assert.rejects(sandbox.watchApis(bad), /expects an array/u);
    }
    for (const bad of [[""], [1], [null], ["ok", ""]]) {
      await assert.rejects(sandbox.watchApis(bad), /non-empty strings/u);
    }
    // 空数组是合法的“清除全部断点”。
    assert.deepEqual(await sandbox.watchApis([]), []);
    assert.deepEqual(await sandbox.watchApis(["cookie", "userAgent"]), [
      "cookie",
      "userAgent",
    ]);
  } finally {
    await sandbox.close();
  }
});

test("watchApis never pauses when no inspector is attached", async () => {
  // debugger 语句在未附调试器时是 no-op：设了断点也应正常跑完，零可观测副作用。
  const sandbox = await EdgeSandbox.create({
    execution: { backend: "child-process" },
    proxyTrace: { enabled: true },
    limits: { timeoutMs: 10_000 },
  });
  try {
    await sandbox.watchApis(["cookie"]);
    const result = await sandbox.evaluate(WATCHED_SCRIPT);
    assert.equal(result.value, "string");
  } finally {
    await sandbox.close();
  }
});

test("watchApis is unsupported on the worker-thread backend inspector path", async () => {
  // watch 本身可设，但断点依赖 inspector，而 inspector 仅 child-process。
  // 这里只校验 worker-thread 后端下 watch 设置不报错且执行正常（无 inspector）。
  const sandbox = await EdgeSandbox.create({
    execution: { backend: "worker-thread" },
    proxyTrace: { enabled: true },
    limits: { timeoutMs: 10_000 },
  });
  try {
    assert.deepEqual(await sandbox.watchApis(["cookie"]), ["cookie"]);
    const result = await sandbox.evaluate(WATCHED_SCRIPT);
    assert.equal(result.value, "string");
  } finally {
    await sandbox.close();
  }
});

test("a watched API access pauses under CDP, then clears", {
  // 交互客户端使用 Node 22+ 的原生 WebSocket。
  skip: typeof WebSocket !== "function" && "interactive client requires Node 22+ WebSocket",
  timeout: 60_000,
}, async () => {
  const sandbox = await EdgeSandbox.create({
    execution: { backend: "child-process" },
    proxyTrace: { enabled: true },
    limits: { timeoutMs: 30_000 }, // 暂停期间也计入预算
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
    await call("Debugger.enable"); // 让 debugger 语句生效
    await sandbox.watchApis(["cookie"]);

    // 命中：读 document.cookie 时应在 trace 收口处暂停。
    const evaluation = sandbox.evaluate(WATCHED_SCRIPT);
    evaluation.catch(() => {}); // 恢复前若失败，避免未处理拒绝
    const paused = (await take(message => message.method === "Debugger.paused")).params;
    // 恢复后 evaluate 正常返回。
    await call("Debugger.resume");
    assert.equal((await evaluation).value, "string");
    assert.ok(paused.callFrames.length >= 1);

    // 清除断点后，同一访问不再暂停：evaluate 直接跑完。
    await sandbox.watchApis([]);
    const cleared = await sandbox.evaluate(WATCHED_SCRIPT);
    assert.equal(cleared.value, "string");

    await call("Debugger.disable");
  } finally {
    socket?.close();
    await sandbox.close();
  }
});
