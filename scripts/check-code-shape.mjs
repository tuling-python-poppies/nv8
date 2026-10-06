#!/usr/bin/env node
/**
 * 形态护栏：挡住两类已经清理过的形态回潮。
 *
 * 1. 空转循环 `do { … } while (false)` —— 清理前出现在 70 个 install 文件里、
 *    共 5280 行，纯粹是机械摊平的残留。
 * 2. 内联数组字面量被常量下标取值，如 `([A, B, C])[1]` —— 循环被摊平后把同一张
 *    表抄了 N 遍、每次只换下标的特征，典型如 `install-crypto.js`。
 *
 * 两条规则都不需要新依赖，判定逻辑在 `scripts/source-shape.mjs`。
 * 规则 2 只针对「内联 + 常量下标」这个组合，声明式的成员表重复出现不会误报。
 *
 * 用法：`node scripts/check-code-shape.mjs`（不一致时非零退出）
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { countIdleLoops, findIndexedLiterals, maskSource } from './source-shape.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');

const REPORT_LIMIT = 10;

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

async function main() {
  const files = await collectFiles(SRC);
  const idleLoops = [];
  const indexedLiterals = [];

  for (const file of files) {
    const masked = maskSource(await readFile(file, 'utf8'));
    const loops = countIdleLoops(masked);
    if (loops > 0) idleLoops.push({ file, count: loops });
    const indexed = findIndexedLiterals(masked);
    if (indexed.length > 0) indexedLiterals.push({ file, count: indexed.length });
  }

  let failed = false;

  if (idleLoops.length > 0) {
    failed = true;
    const total = idleLoops.reduce((sum, entry) => sum + entry.count, 0);
    console.error(`\n空转循环 \`do { … } while (false)\`：${idleLoops.length} 个文件、${total} 处`);
    for (const entry of idleLoops.slice(0, REPORT_LIMIT)) {
      console.error(`  ${String(entry.count).padStart(5)}  ${path.relative(ROOT, entry.file)}`);
    }
  }

  if (indexedLiterals.length > 0) {
    failed = true;
    const total = indexedLiterals.reduce((sum, entry) => sum + entry.count, 0);
    console.error(`\n内联数组字面量被常量下标取值：${indexedLiterals.length} 个文件、${total} 处`);
    for (const entry of indexedLiterals.slice(0, REPORT_LIMIT)) {
      console.error(`  ${String(entry.count).padStart(5)}  ${path.relative(ROOT, entry.file)}`);
    }
  }

  if (failed) {
    console.error('\n把重复的数组字面量提成 const，把 do{…}while(false) 还原成普通语句或循环。');
    console.error('批量还原：node scripts/deflatten-install-surface.mjs --write');
    process.exit(1);
  }

  console.log(`代码形态检查通过（${files.length} 个文件）`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
