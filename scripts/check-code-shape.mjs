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
 * 3. 相对 import / re-export 指向的文件不存在（悬空导入）——ESM 链接期才报，静态检查看不见
 * 4. `for (const [name, entry] of xxxTable)` 里的 xxxTable 在本文件里没有绑定
 *    ——运行时才 ReferenceError，`node --check` 与基线都发现不了
 *
 * 用法：`node scripts/check-code-shape.mjs`（不一致时非零退出）
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { countIdleLoops, findIndexedLiterals, maskSource } from './source-shape.mjs';
import { existsSync } from 'node:fs';

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

export function lexicalBindings(masked) {
  const root = { from: 0, to: masked.length, parent: null, names: new Set() };
  const scopes = [root];
  const stack = [root];
  for (let index = 0; index < masked.length; index += 1) {
    if (masked[index] === "{") {
      const scope = { from: index + 1, to: masked.length, parent: stack.at(-1), names: new Set() };
      scopes.push(scope);
      stack.push(scope);
    } else if (masked[index] === "}" && stack.length > 1) {
      stack.pop().to = index;
    }
  }

  const scopeAt = (position) => scopes
    .filter((scope) => scope.from <= position && position < scope.to)
    .sort((a, b) => b.from - a.from)[0] ?? root;
  const bind = (name, position) => scopeAt(position).names.add(name);

  for (const match of masked.matchAll(/import\s*\{([^}]*)\}/g)) {
    for (const item of match[1].split(",")) {
      const name = item.trim().split(/\s+as\s+/).at(-1);
      if (/^[\w$]+$/.test(name)) bind(name, 0);
    }
  }
  for (const match of masked.matchAll(/import\s*\*\s*as\s+([\w$]+)/g)) bind(match[1], 0);
  for (const match of masked.matchAll(/\b(?:const|let|var|function|class)\s+([\w$]+)/g)) {
    bind(match[1], match.index);
  }

  const hasBinding = (name, position) => {
    let scope = scopeAt(position);
    while (scope !== null) {
      if (scope.names.has(name)) return true;
      scope = scope.parent;
    }
    return false;
  };
  return { hasBinding };
}

async function main() {
  const files = await collectFiles(SRC);
  const idleLoops = [];
  const indexedLiterals = [];
  const danglingImports = [];
  const unboundTables = [];

  for (const file of files) {
    const original = await readFile(file, 'utf8');
    const masked = maskSource(original);
    const loops = countIdleLoops(masked);
    if (loops > 0) idleLoops.push({ file, count: loops });
    const indexed = findIndexedLiterals(masked);
    if (indexed.length > 0) indexedLiterals.push({ file, count: indexed.length });

    // 规则 3：相对 import / re-export 的目标必须存在（ESM 链接期才报，静态检查看不见）。
    // 必须在**原文**上找：挖空后的文本把字符串内容抹掉了，路径本身就没法看见了。
    for (const line of original.split('\n')) {
      const trimmed = line.trim();
      if (!/^(?:import|export)\b/.test(trimmed)) continue;
      const match = /from\s*["'](\.[^"']+)["']/.exec(trimmed);
      if (match === null) continue;
      if (!existsSync(path.resolve(path.dirname(file), match[1]))) {
        danglingImports.push({ file, specifier: match[1] });
      }
    }

    // 规则 4：引用必须在自己的词法作用域或其父作用域里有绑定。
    // 仅按文件收集会把另一个函数里的同名表误当成当前函数可见，漏掉真实的 ReferenceError。
    const bindings = lexicalBindings(masked);
    for (const match of masked.matchAll(/of\s+((?:[\w$]+\.)?[\w$]*Table)\s*\)/g)) {
      const base = match[1].includes('.') ? match[1].split('.')[0] : match[1];
      if (!bindings.hasBinding(base, match.index)) {
        unboundTables.push({ file, reference: match[1] });
      }
    }
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

  if (danglingImports.length > 0) {
    failed = true;
    console.error(`\n悬空导入（指向不存在的文件）：${danglingImports.length} 处`);
    for (const entry of danglingImports.slice(0, REPORT_LIMIT)) {
      console.error(`  ${path.relative(ROOT, entry.file)} -> ${entry.specifier}`);
    }
  }

  if (unboundTables.length > 0) {
    failed = true;
    console.error(`\n表引用没有绑定（运行时 ReferenceError）：${unboundTables.length} 处`);
    for (const entry of unboundTables.slice(0, REPORT_LIMIT)) {
      console.error(`  ${path.relative(ROOT, entry.file)}  未绑定: ${entry.reference}`);
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
