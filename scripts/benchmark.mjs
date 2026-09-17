#!/usr/bin/env node
/**
 * NV8 性能基准。
 *
 * 五个维度：
 *
 * - **冷启动**：从 `createSandbox()` 到页面脚本可求值
 * - **热复用**：同一沙箱内重复 `run()` 的吞吐
 * - **签名工作流**：`evaluateWithPayload` 带 256KiB 命名载荷的单次求值
 * - **崩溃恢复**：restart 策略下超时崩溃到下一次求值可用
 * - **Realm 生命周期**：创建 + 销毁一轮的耗时与常驻内存
 *
 * 输出是给人看的报告；回归护栏在 `tests/performance-budget-test.js`，那里的
 * 预算刻意宽松——目标是抓住**数量级**退化，不是把噪声当失败。CI 机器负载
 * 波动能轻易造成 2–3 倍差异，卡太紧只会制造假警报。
 *
 * 用法：
 *   node --experimental-vm-modules scripts/benchmark.mjs
 *   node --experimental-vm-modules scripts/benchmark.mjs --iterations 20 --json
 *   node --experimental-vm-modules scripts/benchmark.mjs --backend worker-thread --json
 */

import process from 'node:process';

const args = process.argv.slice(2);
const iterationsIndex = args.indexOf('--iterations');
const ITERATIONS = iterationsIndex === -1 ? 8 : Number(args[iterationsIndex + 1]);
const AS_JSON = args.includes('--json');
const backendIndex = args.indexOf('--backend');
const BACKEND = backendIndex === -1
  ? (process.env.NV8_BACKEND ?? 'child-process')
  : args[backendIndex + 1];
if (!['child-process', 'worker-thread'].includes(BACKEND)) {
  throw new RangeError('--backend must be child-process or worker-thread');
}
if (!Number.isSafeInteger(ITERATIONS) || ITERATIONS < 1 || ITERATIONS > 1_000) {
  throw new RangeError('--iterations must be an integer from 1 to 1000');
}

const PAGE_HTML = '<!doctype html><html><head><title>bench</title></head>'
  + '<body><div id="app">bench</div></body></html>';

/**
 * 统计口径：报中位数与 p90，不报平均值。
 *
 * 冷启动这类操作偶发的长尾（GC、文件缓存未命中）会把平均值拖得毫无参考性，
 * 中位数看典型情况、p90 看可接受的坏情况。
 *
 * @param {number[]} samples
 * @returns {{median: number, p90: number, min: number, max: number}}
 */
function summarize(samples) {
  const sorted = [...samples].sort((a, b) => a - b);
  const at = ratio => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * ratio))];
  return {
    median: round(at(0.5)),
    p90: round(at(0.9)),
    min: round(sorted[0]),
    max: round(sorted.at(-1)),
  };
}

function round(value) {
  return Number(value.toFixed(2));
}

async function measure(label, iterations, body) {
  const samples = [];
  for (let index = 0; index < iterations; index += 1) {
    const started = process.hrtime.bigint();
    await body();
    samples.push(Number(process.hrtime.bigint() - started) / 1e6);
  }
  return { label, iterations, ...summarize(samples) };
}

const { createSandbox } = await import('../src/public/create-sandbox.js');

// ---------------------------------------------------------------- 冷启动

const coldStart = await measure('冷启动（create → 首次 run）', ITERATIONS, async () => {
  const sandbox = await createSandbox('https://bench.test/', {
    execution: { backend: BACKEND },
    page: { html: PAGE_HTML },
    limits: { timeoutMs: 30_000 },
  });
  await sandbox.run('document.title');
  await sandbox.close();
  createSandbox.drain();
});

// ---------------------------------------------------------------- 热复用

const warmSandbox = await createSandbox('https://bench.test/', {
  execution: { backend: BACKEND },
  page: { html: PAGE_HTML },
  limits: { timeoutMs: 30_000 },
});
const warmRun = await measure('热复用（单次 run）', ITERATIONS * 25, async () => {
  await warmSandbox.run('1 + 1');
});
const warmDom = await measure('热复用（DOM 查询）', ITERATIONS * 25, async () => {
  await warmSandbox.run("document.getElementById('app').textContent");
});
await warmSandbox.close();
createSandbox.drain();

// ---------------------------------------------------------------- 签名工作流

// 256KiB 载荷接近真实 wasm 量级；脚本只读 byteLength，把测量锁定在
// 「父侧编码 → IPC/线程边界 → 子侧解码 → 注入 Realm」这段通路上。
const SIGN_PAYLOAD = Object.freeze({
  wasm: Uint8Array.from(
    { length: 256 * 1024 },
    (_, index) => (index * 31 + 7) & 0xff,
  ),
});

const signSandbox = await createSandbox('https://bench.test/', {
  execution: { backend: BACKEND },
  page: { html: PAGE_HTML },
  limits: { timeoutMs: 30_000 },
});
const signPayload = await measure('签名工作流（evaluateWithPayload）', ITERATIONS * 25, async () => {
  await signSandbox.raw.evaluateWithPayload(
    'globalThis.__nv8Payload.wasm.byteLength',
    SIGN_PAYLOAD,
  );
});
await signSandbox.close();
createSandbox.drain();

// ---------------------------------------------------------------- Realm reset

const resetSandbox = await createSandbox('https://bench.test/', {
  execution: { backend: BACKEND },
  page: { html: PAGE_HTML },
  limits: { timeoutMs: 30_000 },
});
const reset = await measure('Realm reset（setPage）', ITERATIONS, async () => {
  await resetSandbox.setPage({ url: 'https://bench.test/reset', html: PAGE_HTML });
});
await resetSandbox.close();
createSandbox.drain();

// ---------------------------------------------------------------- 崩溃恢复

// restart 策略：把子进程/线程打成超时崩溃，测「下一次求值可用」的墙钟成本
// （含新进程 spawn、Realm 重建与 INIT 握手）。
const recoverySandbox = await createSandbox('https://bench.test/', {
  execution: { backend: BACKEND, restart: 'restart' },
  page: { html: PAGE_HTML },
  limits: { timeoutMs: 300 },
});
await recoverySandbox.run('1 + 1');
const crashRecovery = await measure('崩溃恢复（崩溃→可再求值）', ITERATIONS, async () => {
  let crashed = false;
  try {
    await recoverySandbox.run('while (true) {}');
  } catch (error) {
    if (error?.code !== 'ERR_EDGE_SANDBOX_TIMEOUT') throw error;
    crashed = true;
  }
  if (!crashed) throw new Error('crash workload did not time out');
  await recoverySandbox.run('1 + 1');
});
await recoverySandbox.close();
createSandbox.drain();

// ---------------------------------------------------------------- Realm 生命周期

const rssBefore = process.memoryUsage().rss;
const realmCycle = await measure('Realm 创建+销毁一轮', ITERATIONS, async () => {
  const sandbox = await createSandbox('https://bench.test/', {
    execution: { backend: BACKEND },
    page: { html: PAGE_HTML },
    limits: { timeoutMs: 30_000 },
  });
  await sandbox.close();
  createSandbox.drain();
});
const rssAfter = process.memoryUsage().rss;

const report = {
  node: process.versions.node,
  backend: BACKEND,
  iterations: ITERATIONS,
  measurements: [coldStart, warmRun, warmDom, signPayload, reset, crashRecovery, realmCycle],
  memory: {
    rssBeforeMiB: round(rssBefore / 1024 / 1024),
    rssAfterMiB: round(rssAfter / 1024 / 1024),
    deltaMiB: round((rssAfter - rssBefore) / 1024 / 1024),
  },
  activeResources: process.getActiveResourcesInfo?.() ?? null,
};

if (AS_JSON) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Node ${report.node} · ${report.backend} · ${ITERATIONS} 轮\n`);
  console.log('指标                        中位数      p90       min       max');
  for (const entry of report.measurements) {
    console.log(
      `  ${entry.label.padEnd(24)}`
      + `${String(entry.median).padStart(8)}ms`
      + `${String(entry.p90).padStart(8)}ms`
      + `${String(entry.min).padStart(8)}ms`
      + `${String(entry.max).padStart(8)}ms`
    );
  }
  console.log(
    `\n常驻内存 ${report.memory.rssBeforeMiB} → ${report.memory.rssAfterMiB} MiB`
    + `（Δ ${report.memory.deltaMiB} MiB，${ITERATIONS} 轮创建销毁后）`
  );
  console.log(`活跃句柄: ${JSON.stringify(report.activeResources)}`);
}
