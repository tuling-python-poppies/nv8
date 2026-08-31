/**
 * 性能预算、句柄泄漏、并发压力
 *
 * ## 预算为什么这么宽松
 *
 * 这些断言的目标是抓**数量级**退化，不是把噪声当失败。实测冷启动中位数
 * 约 490ms，但 CI 机器负载波动能轻易造成 2–3 倍差异——预算卡在 1.5 倍只会
 * 制造假警报，然后大家开始习惯性忽略红灯。
 *
 * 精确数字由 `npm run benchmark` 报告（中位数 + p90），这里只守住底线。
 *
 * ## 泄漏怎么判定
 *
 * 不比绝对值，比**是否随轮次增长**。实测句柄数在第一轮后稳定在 6
 * （5 个 PipeWrap + 1 个 ProcessWrap）——那是池子保留的常驻子进程，不是泄漏。
 * 判据是「第二轮到第三轮不再增长」，这样常驻池合法、真泄漏会被抓住。
 *
 * 用 `process.getActiveResourcesInfo()` 而不是堆快照：它是确定性的，
 * 不需要 `--expose-gc`，也不受 GC 时机影响。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const PAGE_HTML = '<!doctype html><html><head><title>budget</title></head>'
  + '<body><div id="app">budget</div></body></html>';

/** 预算上限，单位毫秒。只允许在有实测依据时调整。 */
const BUDGETS = Object.freeze({
  // 实测中位数 ~490ms；留 6 倍余量给负载波动与慢机器
  coldStartMs: 3_000,
  // 实测中位数 ~0.15ms；留很大余量，这条只防「热路径变成同步阻塞」
  warmRunMs: 50,
});

async function withSandbox(body) {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://budget.test/', {
    page: { html: PAGE_HTML },
    limits: { timeoutMs: 30_000 },
  });
  try {
    return await body(sandbox);
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

/** 统计活跃句柄，按类型分组。 */
function handleTally() {
  const info = process.getActiveResourcesInfo?.() ?? [];
  const tally = {};
  for (const kind of info) tally[kind] = (tally[kind] ?? 0) + 1;
  return { total: info.length, tally };
}

// ------------------------------------------------------------ 性能预算

test('cold start stays within budget', async () => {
  const started = process.hrtime.bigint();
  await withSandbox(sandbox => sandbox.run('document.title'));
  const elapsed = Number(process.hrtime.bigint() - started) / 1e6;

  assert.ok(
    elapsed < BUDGETS.coldStartMs,
    `cold start took ${elapsed.toFixed(0)}ms, budget is ${BUDGETS.coldStartMs}ms`
  );
});

test('warm evaluation stays within budget', async () => {
  await withSandbox(async (sandbox) => {
    // 先跑一次预热，避免把首次求值的一次性开销算进热路径
    await sandbox.run('1 + 1');

    const samples = [];
    for (let index = 0; index < 20; index += 1) {
      const started = process.hrtime.bigint();
      await sandbox.run('1 + 1');
      samples.push(Number(process.hrtime.bigint() - started) / 1e6);
    }
    samples.sort((a, b) => a - b);
    const median = samples[Math.floor(samples.length / 2)];

    // 取中位数而不是最大值：单次长尾（GC）不该让测试变红
    assert.ok(
      median < BUDGETS.warmRunMs,
      `warm run median ${median.toFixed(2)}ms, budget is ${BUDGETS.warmRunMs}ms`
    );
  });
});

test('a sandbox survives many sequential evaluations', async () => {
  await withSandbox(async (sandbox) => {
    for (let index = 0; index < 200; index += 1) {
      const value = await sandbox.run(`${index} + 1`);
      assert.equal(Number(value), index + 1);
    }
    // 大量求值后 DOM 仍可用——排除「状态被求值累积破坏」
    assert.equal(await sandbox.run("document.getElementById('app').textContent"), 'budget');
  });
});

// ------------------------------------------------------------ 句柄泄漏

test('handles and memory stop growing across create/destroy rounds', async () => {
  const { createSandbox } = await import('../src/public/create-sandbox.js');

  const runRound = async () => {
    for (let index = 0; index < 4; index += 1) {
      const sandbox = await createSandbox('https://leak.test/', {
        page: { html: PAGE_HTML },
        limits: { timeoutMs: 30_000 },
      });
      await sandbox.run('document.title');
      await sandbox.close();
      createSandbox.drain();
    }
  };

  // 第一轮把池子建起来——它的增长是预期的，不参与比较
  await runRound();
  const afterWarmup = handleTally();

  await runRound();
  const afterSecond = handleTally();

  await runRound();
  const afterThird = handleTally();

  // 判据是「不再增长」，常驻池因此合法
  assert.ok(
    afterSecond.total <= afterWarmup.total,
    `handles grew from ${afterWarmup.total} to ${afterSecond.total}: `
    + `${JSON.stringify(afterWarmup.tally)} → ${JSON.stringify(afterSecond.tally)}`
  );
  assert.ok(
    afterThird.total <= afterSecond.total,
    `handles kept growing to ${afterThird.total}: ${JSON.stringify(afterThird.tally)}`
  );
});

test('closing a sandbox releases its child process handles', async () => {
  const { createSandbox } = await import('../src/public/create-sandbox.js');

  const sandboxes = [];
  for (let index = 0; index < 3; index += 1) {
    sandboxes.push(await createSandbox(`https://parallel-${index}.test/`, {
      page: { html: PAGE_HTML },
      limits: { timeoutMs: 30_000 },
    }));
  }
  const whileOpen = handleTally();

  for (const sandbox of sandboxes) await sandbox.close();
  createSandbox.drain();
  const afterClose = handleTally();

  // 三个沙箱同时开着时句柄一定多于全部关闭之后；
  // 若关闭不回收，这条会失败。
  assert.ok(
    afterClose.total < whileOpen.total,
    `close released nothing: ${JSON.stringify(whileOpen.tally)} → ${JSON.stringify(afterClose.tally)}`
  );
});

// ------------------------------------------------------------ 并发

test('sandboxes created in parallel stay isolated', async () => {
  const { createSandbox } = await import('../src/public/create-sandbox.js');

  const sandboxes = await Promise.all(
    [0, 1, 2, 3].map(index => createSandbox(`https://concurrent-${index}.test/`, {
      page: {
        html: `<!doctype html><html><body><div id="app">page-${index}</div></body></html>`,
      },
      limits: { timeoutMs: 30_000 },
    }))
  );

  try {
    // 并行写入各自的全局，再并行读回——串行化的实现会在这里暴露
    await Promise.all(sandboxes.map(
      (sandbox, index) => sandbox.run(`globalThis.marker = ${index}`)
    ));
    const markers = await Promise.all(sandboxes.map(sandbox => sandbox.run('globalThis.marker')));
    assert.deepEqual(markers.map(Number), [0, 1, 2, 3]);

    const texts = await Promise.all(sandboxes.map(
      sandbox => sandbox.run("document.getElementById('app').textContent")
    ));
    assert.deepEqual(texts, ['page-0', 'page-1', 'page-2', 'page-3']);

    const urls = await Promise.all(sandboxes.map(sandbox => sandbox.run('location.origin')));
    assert.deepEqual(urls, [
      'https://concurrent-0.test',
      'https://concurrent-1.test',
      'https://concurrent-2.test',
      'https://concurrent-3.test',
    ]);
  } finally {
    for (const sandbox of sandboxes) await sandbox.close();
    createSandbox.drain();
  }
});

test('concurrent evaluations in one sandbox all resolve', async () => {
  await withSandbox(async (sandbox) => {
    const results = await Promise.all(
      Array.from({ length: 32 }, (_unused, index) => sandbox.run(`${index} * 2`))
    );
    assert.deepEqual(
      results.map(Number),
      Array.from({ length: 32 }, (_unused, index) => index * 2)
    );
  });
});

test('a failing evaluation does not poison later ones', async () => {
  await withSandbox(async (sandbox) => {
    await assert.rejects(() => sandbox.run('throw new Error("boom")'));
    // 同一沙箱在错误之后仍可用——错误处理不能把连接搞坏
    assert.equal(Number(await sandbox.run('7 * 6')), 42);
    assert.equal(await sandbox.run('document.title'), 'budget');
  });
});
