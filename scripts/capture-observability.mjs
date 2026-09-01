#!/usr/bin/env node
/**
 * 生成 / 校验 trace / network / navigation golden fixture。
 *
 * 场景固定：同一段 HTML、同一组 replay、同一串操作。这样任何差异都来自
 * 实现变化，而不是输入变化。
 *
 * 用法：
 *   node scripts/capture-observability.mjs           # 校验
 *   node scripts/capture-observability.mjs --write    # 写入 fixture
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  diffObservability,
  summarizeObservability,
} from '../src/baseline/observability.js';
import { baselineScenario } from '../src/baseline/baseline.js';

// fileURLToPath 而不是 `.pathname`：后者在 Windows 上是 `/C:/...`，
// `path.resolve` 会拼成 `C:\C:\...`。
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const FIXTURE_PATH = path.join(ROOT, 'fixtures', 'baseline', 'observability.json');

/**
 * 固定操作序列。
 *
 * 刻意避开 `Date.now()`、随机数和任何依赖真实时间的调用——它们会让 trace
 * 的参数类型稳定但值不稳定，虽然归一化已剔除值，但仍会影响调用条数。
 */
const TRACE_STEPS = [
  'document.title',
  'document.querySelector("#app")',
  'document.querySelector("#app").textContent',
  'navigator.userAgent',
  'location.href',
];

const NETWORK_STEP =
  'fetch("https://api.example.test/baseline").then(response => response.json())';

async function capture() {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const scenario = baselineScenario();

  const sandbox = await createSandbox(scenario.url, {
    page: { html: scenario.html },
    replay: scenario.replay,
  });

  try {
    const inner = sandbox._inner;
    await inner.enableProxyTrace();

    for (const step of TRACE_STEPS) {
      await sandbox.run(step);
    }
    await sandbox.run(NETWORK_STEP);

    // 触发一次同文档导航，产生 navigation 条目
    await sandbox.run('history.pushState({ step: 1 }, "", "/baseline/next")');

    const trace = await inner.proxyTrace();
    const requests = typeof inner.networkRequests === 'function'
      ? await inner.networkRequests()
      : [];
    const navigation = JSON.parse(await sandbox.run(
      'JSON.stringify(typeof navigation === "object" && navigation !== null'
      + ' ? navigation.entries().map(entry => ({ url: entry.url, index: entry.index,'
      + ' state: entry.getState?.() ?? null })) : [])',
    ));

    return summarizeObservability({ trace, requests, navigation });
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

const snapshot = await capture();
const args = process.argv.slice(2);

if (args.includes('--write')) {
  await writeFile(FIXTURE_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`wrote ${path.relative(ROOT, FIXTURE_PATH)}`);
  console.log(`  trace:      ${snapshot.trace.count} entries (${snapshot.trace.digest})`);
  console.log(`  requests:   ${snapshot.requests.count} entries (${snapshot.requests.digest})`);
  console.log(`  navigation: ${snapshot.navigation.count} entries (${snapshot.navigation.digest})`);
  process.exit(0);
}

if (!existsSync(FIXTURE_PATH)) {
  console.error('fixture 不存在，先运行 --write');
  process.exit(2);
}

const fixture = JSON.parse(await readFile(FIXTURE_PATH, 'utf8'));
const differences = diffObservability(fixture, snapshot);

if (differences.length === 0) {
  console.log(
    `observability 一致：trace ${snapshot.trace.count}, `
    + `requests ${snapshot.requests.count}, navigation ${snapshot.navigation.count}`,
  );
  process.exit(0);
}

console.error('observability 与 baseline 存在差异：\n');
for (const difference of differences.slice(0, 12)) {
  if (difference.kind === 'count') {
    console.error(
      `  ${difference.section}: 条数 ${difference.expected} → ${difference.actual}`,
    );
  } else {
    console.error(`  ${difference.section}[${difference.index}]:`);
    console.error(`    期望 ${JSON.stringify(difference.expected)}`);
    console.error(`    实际 ${JSON.stringify(difference.actual)}`);
  }
}
if (differences.length > 12) {
  console.error(`  ...另有 ${differences.length - 12} 处差异`);
}
console.error('\n确认变更有意后运行 --write 更新 fixture。');
process.exit(1);
