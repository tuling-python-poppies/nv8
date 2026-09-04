#!/usr/bin/env node
/**
 * 生成 / 校验 bootstrap 安装顺序 fixture。
 *
 * 与旧版 fixture 的关键区别：存**完整调用序列**而非只存 sha256。
 * 只存摘要时，序列变化只能得到「digest 不一致」，无法定位到哪一步变了。
 *
 * 另一个设计取舍：`sourceSha256` 和行号被归为**信息性字段**，不参与校验。
 * 理由是它们对任何注释改动、代码位移都敏感，会让 baseline 因无关变更而失败，
 * 失败信息也无助于判断安装行为是否真的变了。baseline 要守的是**安装顺序**。
 *
 * 用法：
 *   node scripts/capture-bootstrap-order.mjs          # 校验
 *   node scripts/capture-bootstrap-order.mjs --write   # 写入 fixture
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  captureBootstrapOrderSnapshot,
  diffBootstrapSequence,
} from '../src/infra/baseline/bootstrap-order.js';

// fileURLToPath 而不是 `.pathname`：后者在 Windows 上是 `/C:/...`，
// `path.resolve` 会拼成 `C:\C:\...`。
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const FIXTURE_PATH = path.join(ROOT, 'fixtures', 'baseline', 'bootstrap-order.json');

function toFixture(snapshot) {
  const entries = {};
  for (const [name, entry] of Object.entries(snapshot.entries)) {
    entries[name] = {
      file: entry.file,
      function: entry.function,
      callCount: entry.callCount,
      callSequenceSha256: entry.callSequenceSha256,
      firstCall: entry.firstCall,
      lastCall: entry.lastCall,
      sequence: [...entry.sequence],
      // 记录但不参与校验：对无关改动敏感，仅用于人工定位
      informational: {
        sourceSha256: entry.sourceSha256,
        functionStartLine: entry.functionStartLine,
        functionEndLine: entry.functionEndLine,
      },
    };
  }
  return { schema: snapshot.schema, entries };
}

const snapshot = await captureBootstrapOrderSnapshot();
const args = process.argv.slice(2);

if (args.includes('--write')) {
  await writeFile(FIXTURE_PATH, `${JSON.stringify(toFixture(snapshot), null, 2)}\n`);
  console.log(`wrote ${path.relative(ROOT, FIXTURE_PATH)}`);
  for (const [name, entry] of Object.entries(snapshot.entries)) {
    console.log(`  ${name}: ${entry.callCount} calls, ${entry.firstCall} → ${entry.lastCall}`);
  }
  process.exit(0);
}

if (!existsSync(FIXTURE_PATH)) {
  console.error('fixture 不存在，先运行 --write');
  process.exit(2);
}

const fixture = JSON.parse(await readFile(FIXTURE_PATH, 'utf8'));
let failed = false;

for (const [name, entry] of Object.entries(snapshot.entries)) {
  const recorded = fixture.entries?.[name];
  if (recorded === undefined) {
    console.error(`${name}: fixture 缺少该 bootstrap`);
    failed = true;
    continue;
  }

  const expected = recorded.sequence ?? [];
  const diff = diffBootstrapSequence(expected, entry.sequence);

  if (diff.removed.length === 0 && diff.added.length === 0 && diff.reordered.length === 0) {
    console.log(`${name}: 安装顺序一致（${entry.callCount} 步）`);
    continue;
  }

  failed = true;
  console.error(`\n${name}: 安装顺序变化`);
  if (diff.removed.length > 0) console.error(`  移除: ${diff.removed.join(', ')}`);
  if (diff.added.length > 0) console.error(`  新增: ${diff.added.join(', ')}`);
  for (const entryDiff of diff.reordered.slice(0, 10)) {
    console.error(
      `  位序 ${entryDiff.index}: 期望 ${entryDiff.expected}，实际 ${entryDiff.actual}`,
    );
  }
  if (diff.reordered.length > 10) {
    console.error(`  ...另有 ${diff.reordered.length - 10} 处位序差异`);
  }
}

if (failed) {
  console.error(
    '\n安装顺序是行为契约。确认变更是有意的之后运行 --write 更新 fixture。',
  );
  process.exit(1);
}
