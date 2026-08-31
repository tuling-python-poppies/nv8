#!/usr/bin/env node
/**
 * 生成 / 校验完整 surface baseline fixture。
 *
 * 用法：
 *   node scripts/capture-full-surface.mjs           # 校验，差异则非零退出
 *   node scripts/capture-full-surface.mjs --write   # 写入 fixture
 *   node scripts/capture-full-surface.mjs --full    # 导出全量明细供人工 diff
 *
 * 设计取舍：fixture 按 Node major 分档存储。同一份 NV8 代码在 Node 18/20 与
 * 22/24 上暴露的 surface 确实不同（`Iterator` 等），把它们塞进同一份 fixture
 * 会导致跨版本必然误报。
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import {
  captureFullSurface,
  summarizeFullSurface,
  diffFullSurface,
} from '../src/baseline/full-surface.js';
import { expectedMissingForNode } from '../src/baseline/known-differences.js';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const FIXTURE_DIR = path.join(ROOT, 'fixtures', 'baseline');
const FIXTURE_PATH = path.join(FIXTURE_DIR, 'full-surface.json');

const silentLogger = { info() {}, warn() {}, error() {}, trace() {} };

/**
 * fixture 分档键。
 *
 * 按 Node major 逐档，而不是粗分「新/旧」两档：实测 18/20/22 三个版本的
 * V8 语言内建成员数各不相同（Array 36/40/40、ArrayBuffer 3/6/9、String
 * 50/52/52），合并任意两个都会造成误报。
 */
function surfaceTier(nodeVersion = process.versions.node) {
  const major = Number(/^(\d+)/.exec(nodeVersion)?.[1] ?? 0);
  return `node${major}`;
}

async function captureLegacy() {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://baseline.test/', {
    page: { html: '<!doctype html><html><head></head><body></body></html>' },
    // 全量 surface 快照约 240KB，超过默认 1MB 以内但预留余量；
    // 这是采集脚本而非运行时，放宽限额是合理的
    limits: { maxOutputBytes: 8 * 1024 * 1024 },
  });
  try {
    return await captureFullSurface((source) => sandbox.run(source));
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

async function capturePlugin() {
  const { createNv8, domPreset } = await import('../src/index.js');
  const { streamsPlugin } = await import('../src/plugins/streams/index.js');
  const { fetchPlugin } = await import('../src/plugins/fetch/index.js');
  const { storagePlugin } = await import('../src/plugins/storage/index.js');

  const nv8 = await createNv8({
    plugins: [...domPreset, streamsPlugin, fetchPlugin, storagePlugin],
    profile: {
      id: 'baseline-full-surface',
      version: '1.0.0',
      name: 'Baseline',
      url: 'https://baseline.test/',
    },
    logger: silentLogger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({
      type: 'root',
      pageUrl: 'https://baseline.test/',
    });
    return await captureFullSurface((source) => realm.evaluate(source));
  } finally {
    await nv8.destroy();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const tier = surfaceTier();

  const legacy = summarizeFullSurface(await captureLegacy());
  const plugin = summarizeFullSurface(await capturePlugin());

  if (args.includes('--full')) {
    console.log(JSON.stringify({ tier, legacy, plugin }, null, 2));
    return;
  }

  if (args.includes('--write')) {
    await mkdir(FIXTURE_DIR, { recursive: true });
    const existing = existsSync(FIXTURE_PATH)
      ? JSON.parse(await readFile(FIXTURE_PATH, 'utf8'))
      : { schema: 'nv8/baseline/full-surface@1', tiers: {} };
    existing.tiers[tier] = {
      capturedOnNode: process.versions.node,
      legacy,
      plugin,
    };
    await writeFile(FIXTURE_PATH, `${JSON.stringify(existing, null, 2)}\n`);
    console.log(`wrote ${path.relative(ROOT, FIXTURE_PATH)} tier=${tier}`);
    console.log(`  legacy: ${legacy.globalCount} globals, ${legacy.memberTotal} members`);
    console.log(`  plugin: ${plugin.globalCount} globals, ${plugin.memberTotal} members`);
    return;
  }

  if (!existsSync(FIXTURE_PATH)) {
    console.error('fixture 不存在，先运行 --write 生成');
    process.exit(2);
  }

  const fixture = JSON.parse(await readFile(FIXTURE_PATH, 'utf8'));
  const recorded = fixture.tiers?.[tier];
  if (recorded === undefined) {
    console.error(`fixture 缺少 tier=${tier}（Node ${process.versions.node}）；先运行 --write`);
    process.exit(2);
  }

  let failed = false;
  for (const [mode, actual] of [['legacy', legacy], ['plugin', plugin]]) {
    const diff = diffFullSurface(recorded[mode], actual);

    // Node 版本造成的缺失是预期的，不算回归
    const unexplainedMissing = diff.missing.filter(
      (name) => expectedMissingForNode(name) === null,
    );

    if (unexplainedMissing.length === 0 && diff.added.length === 0 && diff.changed.length === 0) {
      console.log(`${mode}: 与 baseline 一致`);
      continue;
    }

    failed = true;
    console.error(`\n${mode}: 与 baseline 存在差异`);
    if (unexplainedMissing.length > 0) {
      console.error(`  缺失: ${unexplainedMissing.join(', ')}`);
    }
    if (diff.added.length > 0) console.error(`  新增: ${diff.added.join(', ')}`);
    for (const entry of diff.changed) {
      console.error(
        `  变更: ${entry.name} `
        + `type ${entry.valueType[0]}→${entry.valueType[1]} `
        + `members ${entry.memberCount[0]}→${entry.memberCount[1]}`,
      );
    }
  }

  if (failed) {
    console.error(
      '\n差异必须先解释：登记到 src/baseline/known-differences.js，'
      + '或确认是预期变更后运行 --write 更新 fixture。',
    );
    process.exit(1);
  }
}

await main();
