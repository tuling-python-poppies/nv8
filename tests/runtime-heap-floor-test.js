/**
 * 运行时堆下限
 *
 * 这个模块是一次真实偶发失败的根因修复。
 *
 * `realm guard returns a structured error on child-process` 在全量测试里偶尔
 * 失败，前几次被当作「资源竞争」放过。抓下来的实际错误是
 * `SandboxChildExitError (signal=SIGABRT)`，打开子进程 stderr 后看到：
 *
 * ```
 * FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
 * ```
 *
 * 原因：`limits.maxHeapBytes` 被同时用于两件互不相干的事——算 Realm 容量守卫，
 * 和设 V8 老生代上限。测试用 64MB 是为了让守卫触发，但 64MB 老生代**不够引导
 * 一个完整 Realm**。V8 在引导过程中 OOM 并 `abort()`，进程内拦不住，
 * 因为 abort 之后没有 JS 能再运行。
 *
 * 实测（Node 24，child-process，各 6 次并发）：
 * 32MB 0/6、48MB 0/6、**64MB 5/6**、80MB 6/6、96MB 6/6、128MB 6/6。
 * 64MB 正好在悬崖边——这就是「偶发」的真身。原地板 32MB 保证崩溃。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  MINIMUM_RUNTIME_HEAP_MB,
  isRuntimeHeapClamped,
  resolveRuntimeHeapMegabytes,
} from '../src/backend/controller/runtime-heap-floor.js';
import { ChildProcessConnection } from '../src/backend/controller/child-process.js';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';

const MB = 1024 * 1024;

test('the floor sits above the measured viable minimum', () => {
  // 实测 80MB 起 6/6 通过；地板要留余量，因为内存压力下的 OOM 时机本身有抖动，
  // 贴着可用值取会把"必崩"换成"偶崩"，而偶崩更难查
  assert.ok(MINIMUM_RUNTIME_HEAP_MB >= 80, 'must clear the measured 80MB mark');
});

test('a too-small budget is clamped up to the floor', () => {
  for (const megabytes of [1, 32, 48, 64]) {
    assert.equal(resolveRuntimeHeapMegabytes(megabytes * MB), MINIMUM_RUNTIME_HEAP_MB);
    assert.equal(isRuntimeHeapClamped(megabytes * MB), true);
  }
});

test('a sufficient budget passes through untouched', () => {
  assert.equal(resolveRuntimeHeapMegabytes(512 * MB), 512);
  assert.equal(isRuntimeHeapClamped(512 * MB), false);
});

test('the spawn arguments carry the clamped value', () => {
  const connection = new ChildProcessConnection({ maxHeapBytes: 64 * MB });
  const spec = connection.createSpawnSpec({ fingerprint: { timezone: 'UTC' } });

  const heapArgument = spec.args.find((arg) => arg.startsWith('--max-old-space-size='));
  // 原先这里是 --max-old-space-size=64，子进程在引导 Realm 时 OOM abort
  assert.equal(heapArgument, `--max-old-space-size=${MINIMUM_RUNTIME_HEAP_MB}`);
});

test('clamping the V8 cap does not weaken the realm guard', async () => {
  // 关键点：两个用途走不同路径。heapSafeRealmLimit 用**配置值**算
  // （floor(64/36) = 1），V8 上限用**钳制后的值**。所以守卫照旧触发，
  // 只是子进程不会在返回结构化错误之前先崩掉。
  const sandbox = await EdgeSandbox.create({
    execution: { backend: 'child-process' },
    limits: { maxHeapBytes: 64 * MB, timeoutMs: 30_000 },
  });
  try {
    const result = await sandbox.evaluate(`new Promise(resolve => {
      const worker = new Worker('data:text/javascript,self.onmessage=()=>{}');
      worker.onerror = event => resolve(event.error?.code || event.error?.name);
    })`);
    assert.equal(result.value, 'LIMIT_HEAP_BYTES');
  } finally {
    await sandbox.close();
  }
});

test('a clamped budget still boots a usable realm', async () => {
  // 回归断言：这正是以前 SIGABRT 的场景
  const sandbox = await EdgeSandbox.create({
    execution: { backend: 'child-process' },
    limits: { maxHeapBytes: 32 * MB, timeoutMs: 30_000 },
  });
  try {
    const result = await sandbox.evaluate('document.createElement("div").tagName');
    assert.equal(result.value, 'DIV');
  } finally {
    await sandbox.close();
  }
});
