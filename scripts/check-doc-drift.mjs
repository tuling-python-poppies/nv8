#!/usr/bin/env node
//
// 文档对账：把文档里可验证的具体断言抽出来，跟仓库现状比。
//
// README 自己写着「文档失步要靠断言，不靠 review」——这个脚本就是那条断言的落点。
// 检查四类：
//   1. markdown 链接与行内代码里的仓库路径是否存在（相对路径按文档自身目录解析）
//   2. 文档里点名的 `npm run X` 是否在 package.json 的 scripts 里
//   3. 文档里点名的 `scripts/*.mjs` 与 `tests/*-test.js` 是否还在
//   4. 目录树片段里的目录是否存在
//
// 不检查数字：`4030 个模块` 这类要么随机器与版本变，要么写在过去时的叙述里，
// 误报比漏报贵，交给 review。
//
// 历史叙述里的路径会命中——ADR 引用「曾经画错的路径」、迁移记录引用已删除的目录，
// 这些都是有意为之，登记在下面的 ALLOWED 里，每条都要写清理由。
//
// 用法：`node scripts/check-doc-drift.mjs`

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// 允许存在的「不指向任何东西」的路径：历史叙述。
// 每条都必须能让读者看出来是历史，而不是文档失修。
const ALLOWED = [
  {
    file: 'docs/adr/0001-plugin-surface-coverage.md',
    token: 'src/migration-targets/',
    reason: '该目录的 1465 个映射垫片已折叠为 docs/rust-migration-map.json（那份 JSON 里写明了目录已不存在）',
  },
  {
    file: 'docs/state-scope.md',
    token: 'src/migration-targets/',
    reason: '同上；此处是在纠正「把映射存根当成待迁移代码」这个误判',
  },
  {
    file: 'docs/adr/0008-source-layout-containers.md',
    token: 'src/core/plugin-sdk/',
    reason: '引用 README 曾把 plugin-sdk 画错的位置，原文紧接着写「那个位置从来不存在」',
  },
  {
    file: 'docs/backend-benchmark.md',
    token: 'src/engine/realm/module-bundle.json',
    reason: '该文件是 gitignore 的本机产物，默认不生成；文档是在描述它的位置与体积，不是引用已提交文件',
  },
];

const SKIP_DIRS = new Set(['.git', 'node_modules']);
const PATH_PREFIX = /^(?:src|docs|scripts|tests|fixtures|examples)\/[\w./-]+\/?$/;

async function collectDocs(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await collectDocs(path.join(dir, entry.name), out);
      continue;
    }
    if (entry.name.endsWith('.md')) out.push(path.join(dir, entry.name));
  }
  return out;
}

// 链接里的相对路径按文档自身目录解析，再退回仓库根
function resolves(target, fromFile) {
  const cleaned = target
    .replace(/[#?].*$/, '')
    .replace(/:\d+(?::\d+)?$/, '')
    .replace(/\\/g, '/')
    .trim();
  if (cleaned === '') return true;
  if (existsSync(path.resolve(path.dirname(fromFile), cleaned))) return true;
  return existsSync(path.resolve(ROOT, cleaned));
}

function isAllowed(relativeFile, token) {
  return ALLOWED.some((entry) => entry.file === relativeFile && entry.token === token);
}

async function main() {
  const docs = await collectDocs(ROOT);
  const pkg = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8'));
  const problems = [];

  for (const file of docs) {
    const relativeFile = path.relative(ROOT, file).split(path.sep).join('/');
    const source = await readFile(file, 'utf8');
    const report = (kind, detail) => problems.push({ file: relativeFile, kind, detail });

    for (const match of source.matchAll(/\]\(([^)\s]+)\)/g)) {
      const target = match[1];
      if (target.startsWith('http') || target.startsWith('#')) continue;
      if (!resolves(target, file)) report('链接指向不存在的路径', target);
    }

    for (const match of source.matchAll(/`([^`\n]+)`/g)) {
      const token = match[1].trim();
      const bare = token.replace(/:\d+(?::\d+)?$/, '');
      // 跳出示意写法（`src/api/...`、`scripts/*.mjs`）——它们本来就不指向具体文件
      if (token.includes('*') || token.includes('{') || token.includes('...')) continue;
      if (!PATH_PREFIX.test(bare)) continue;
      if (resolves(token, file) || isAllowed(relativeFile, token)) continue;
      report('代码路径不存在', token);
    }

    for (const match of source.matchAll(/npm run ([\w:.-]+)/g)) {
      const script = match[1];
      const after = source.slice(match.index + match[0].length, match.index + match[0].length + 1);
      if (after === '*') continue;
      if (!(script in pkg.scripts)) report('package.json 里没有这个脚本', `npm run ${script}`);
    }

    for (const match of source.matchAll(/node\s+(?:--[\w-]+\s+)*scripts\/([\w.-]+\.mjs)/g)) {
      if (!existsSync(path.join(ROOT, 'scripts', match[1]))) report('scripts 下没有这个文件', match[1]);
    }

    for (const match of source.matchAll(/\btests\/[\w./-]+-test\.js\b/g)) {
      if (!existsSync(path.join(ROOT, match[0]))) report('测试文件不存在', match[0]);
    }

    for (const match of source.matchAll(/^\s*[│├└─\s]*((?:src|docs|scripts|tests)\/[\w./-]+\/)\s/gm)) {
      if (!existsSync(path.join(ROOT, match[1]))) report('目录不存在', match[1]);
    }
  }

  if (problems.length === 0) {
    console.log(`文档对账通过（${docs.length} 个文档；${ALLOWED.length} 条历史引用白名单）`);
    return;
  }

  console.error(`\n文档与仓库对不上：${problems.length} 处`);
  for (const problem of problems) {
    console.error(`  ${problem.file}  ${problem.kind}: ${problem.detail}`);
  }
  console.error('\n要么改正文档，要么确实是历史叙述——后者请登记到本脚本的 ALLOWED 并写清理由。');
  process.exit(1);
}

await main();
