/**
 * 堆容量守卫：放行的子 Realm 数不得超过堆能装下的数量
 *
 * 原公式是 `floor(maxHeapBytes / 36MB)`，把根 Realm 也按 36MB 算。实测它放行的子
 * Realm 数**超过**堆能装下的数量，溢出表现为子进程 SIGABRT（V8 OOM abort）：
 *
 * | maxHeapBytes | 实测安全上限 | 原守卫放行 | 结果 |
 * |---|---|---|---|
 * | 128MB | **1** | 2 | SIGABRT |
 * | 256MB | **5** | 6 | SIGABRT |
 * | 512MB（默认）| 11 | 11 | 正常 |
 *
 * 512MB 之所以没崩，是被 `limits.maxRealms`（默认 12）挡住的，**不是**堆估算起了
 * 作用。也就是说堆估算在所有实测档位上都偏大，只是默认配置恰好被另一个上限救了
 * ——这类「靠别处的上限兜住」的正确性最容易在调参时消失。
 *
 * V8 OOM 进程内拦不住：abort 之后没有 JS 能再运行，所以永远不可能变成结构化错误。
 * 唯一能做的是**不放行到那一步**。这与 `runtime-heap-floor.js` 的结论同源。
 *
 * 断言分两层：
 *
 * 1. **公式**（纯函数，快）——三个实测档位都不得超过安全上限
 * 2. **端到端**（一个沙箱）——低堆下必须给结构化拒绝而不是崩
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { heapSafeRealmLimitFor } from '../src/child/runtime-pool.js';

const MB = 1024 * 1024;

/** 返回值是「总 Realm 数（含根）」，所以子 Realm 上限要减 1。 */
function childLimit(heapMb) {
  return heapSafeRealmLimitFor(heapMb * MB) - 1;
}

// ------------------------------------------------------ 公式

test('the guard never permits more children than the heap measured safe', () => {
  // 左列是实测「不崩的最大子 Realm 数」，公式不得超过它。
  for (const [heapMb, measuredSafe] of [[128, 1], [256, 5], [512, 11]]) {
    const permitted = childLimit(heapMb);
    assert.ok(
      permitted <= measuredSafe,
      `${heapMb}MB permits ${permitted} children but only ${measuredSafe} are safe`,
    );
  }
});

test('the guard stays close to the measured ceiling', () => {
  // 只保守不激进，但也不能保守到没法用：允许比实测上限少 1 个，不许少更多。
  for (const [heapMb, measuredSafe] of [[128, 1], [256, 5], [512, 11]]) {
    assert.ok(
      childLimit(heapMb) >= measuredSafe - 1,
      `${heapMb}MB permits only ${childLimit(heapMb)} of ${measuredSafe} safe children`,
    );
  }
});

test('the default heap keeps the historical child capacity', () => {
  // 512MB 是默认值。收紧公式不能顺手改掉默认配置下的行为，
  // 否则「修一个低堆配置的崩溃」会变成「所有人的 iframe 上限降了」。
  assert.equal(childLimit(512), 11);
});

test('a heap too small for a single child permits none', () => {
  // 64MB：`runtime-heap-floor.js` 实测单个 Realm 引导在这里 5/6 成功——
  // 悬崖边。守卫应当一个子 Realm 都不放，让调用方拿到结构化的容量错误。
  assert.equal(childLimit(64), 0);
  assert.equal(childLimit(1), 0);
  assert.equal(childLimit(0), 0);
});

test('capacity grows monotonically with the heap', () => {
  let previous = -1;
  for (let heapMb = 0; heapMb <= 2048; heapMb += 16) {
    const permitted = childLimit(heapMb);
    assert.ok(
      permitted >= previous,
      `capacity dropped at ${heapMb}MB (${previous} → ${permitted})`,
    );
    previous = permitted;
  }
});

// ------------------------------------------------------ 端到端

test('a low heap rejects extra iframes instead of aborting the child', async () => {
  // 修复前这一段会让子进程 SIGABRT（code=134），连 close() 都跑不到。
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://capacity.test/page', {
    page: { html: '<!doctype html><html><head></head><body></body></html>' },
    limits: { timeoutMs: 30_000, maxHeapBytes: 128 * MB },
  });

  try {
    await sandbox.run(`(() => {
      globalThis.__events = [];
      for (let index = 0; index < 3; index += 1) {
        const frame = document.createElement('iframe');
        frame.addEventListener('load', () => globalThis.__events.push('load'));
        frame.addEventListener('error', () => globalThis.__events.push('error'));
        document.body.appendChild(frame);
      }
    })()`);

    // 等到三个 iframe 都有了结论。用轮询而不是固定等待：子 Realm 引导要几百毫秒，
    // 固定时长在负载下必然抖。
    let events = [];
    for (let attempt = 0; attempt < 400; attempt += 1) {
      events = JSON.parse(await sandbox.run('JSON.stringify(globalThis.__events)'));
      if (events.length >= 3) break;
      await new Promise((resolve) => { setTimeout(resolve, 2); });
    }

    assert.equal(events.length, 3, `only ${events.length} of 3 iframes settled`);
    assert.equal(
      events.filter((value) => value === 'load').length, 1,
      '128MB fits exactly one child Realm',
    );
    assert.equal(
      events.filter((value) => value === 'error').length, 2,
      'the rest must be rejected, not built',
    );
  } finally {
    // 崩溃过的子进程连 close 都会抛；能干净关闭本身就是断言的一部分
    await sandbox.close();
    createSandbox.drain();
  }
});
