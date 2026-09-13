/**
 * 性能预算、句柄泄漏、并发压力
 *
 * ## 预算为什么这么宽松
 *
 * 这些断言的目标是抓**数量级**退化，不是把噪声当失败。实测冷启动中位数
 * 约 490ms，但 CI 机器负载波动能轻易造成 2–3 倍差异——预算卡在 1.5 倍只会
 * 制造假警报，然后大家开始习惯性忽略红灯。
 *
 * 光放宽预算不够：冷启动那条原来只采**一次**样，在并行跑整套测试时它测的是
 * 「此刻机器有多忙」，实测两次越过 3000ms 而单独跑只要几百毫秒。现在取
 * 多次采样的最小值——竞争只会让采样变大，所以最小值是受污染最少的估计。
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

/**
 * 预算上限，单位毫秒。只允许在有实测依据时调整。
 *
 * ## 按后端分开标定（IKF3A6）
 *
 * 实测条件：Node 22.22.2 / Windows，同一台机器上每个后端各跑 3 次冷启动取
 * **最小值**、20 次热求值取**中位数**：
 *
 * | 后端 | 冷启动最小值 | 热求值中位数 |
 * |---|---|---|
 * | child-process | ≈ 857ms | ≈ 0.42ms |
 * | worker-thread | ≈ 1252ms | ≈ 0.27ms |
 *
 * worker-thread 冷启动更慢（线程池初始化 + 消息往返），所以它的冷启动预算
 * 单独放宽到 6000ms：本机实测 1252ms，但「Windows runner + 全量并行测试」
 * 这个组合没有历史数据，按最大约 4.8 倍余量给，宁可放宽也不制造新 flake。
 * child-process 沿用 3000ms——它已在 Node 18/20/24 的 CI 矩阵上长期全绿。
 *
 * ## 版本维度
 *
 * 开发机 nvm 只有 Node 22 一档，无法逐版本实测；Node 18 是支持矩阵里最慢的
 * 版本，旧预算 3000ms 在 Node 18 CI 上全绿。因此版本维度不细分，统一按
 * 「最慢支持版本」取余量——有新的实测数据再拆。
 */
const BUDGETS = Object.freeze({
  'child-process': Object.freeze({
    coldStartMs: 3_000,
    warmRunMs: 50,
  }),
  'worker-thread': Object.freeze({
    coldStartMs: 6_000,
    warmRunMs: 50,
  }),
});

const BUDGET_BACKENDS = Object.freeze(Object.keys(BUDGETS));

async function withSandbox(body, backend = 'child-process') {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://budget.test/', {
    backend,
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

/**
 * 冷启动取**多次采样的最小值**，不是单次。
 *
 * 单次采样在并行跑整套测试时测的是「此刻机器有多忙」，不是「启动能有多快」。
 * 实测这条断言以 3977ms / 3260ms 两次越过 3000ms 预算，而单独跑同一条只要
 * 几百毫秒——放大预算等于把噪声正当化，本项目已经因为固定 sleep 吃过这个教训。
 *
 * 取最小值而不是中位数：这里断言的是**上界**（"启动不该慢于 X"），而竞争只会
 * 让采样变大、不会变小。所以最小值是受污染最少的估计。
 *
 * 另有一个具体原因：**第一次采样包含宿主 ESM 图的加载**（约 1700 个模块，
 * 每个进程一次），那不是每次建沙箱都要付的成本。README 里 ~490ms 的数字来自
 * `npm run benchmark` 的重复采样，同样是在宿主图已加载之后测的。用第一次采样
 * 去比那个预算，比的是两件不同的事。
 */
const COLD_START_SAMPLES = 3;

for (const backend of BUDGET_BACKENDS) {
  test(`cold start stays within budget (${backend})`, async () => {
    const samples = [];
    for (let index = 0; index < COLD_START_SAMPLES; index += 1) {
      const started = process.hrtime.bigint();
      await withSandbox(sandbox => sandbox.run('document.title'), backend);
      samples.push(Number(process.hrtime.bigint() - started) / 1e6);
    }
    const fastest = Math.min(...samples);

    assert.ok(
      fastest < BUDGETS[backend].coldStartMs,
      `fastest ${backend} cold start took ${fastest.toFixed(0)}ms, budget is `
      + `${BUDGETS[backend].coldStartMs}ms (samples: ${samples.map(v => v.toFixed(0)).join(', ')})`
    );
  });

  test(`warm evaluation stays within budget (${backend})`, async () => {
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
        median < BUDGETS[backend].warmRunMs,
        `${backend} warm run median ${median.toFixed(2)}ms, budget is `
        + `${BUDGETS[backend].warmRunMs}ms`
      );
    }, backend);
  });
}

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
