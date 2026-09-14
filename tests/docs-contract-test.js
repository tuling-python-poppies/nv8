/**
 * 文档与代码的契约检查
 *
 * 文档失步的典型症状不是「写得不好」，是**照着文档写出跑不通的代码**。
 * 已经踩到的实例：
 *
 * - `sandbox_manual.md` 用一整节介绍 `ExecutionCore` / `createExecutionCore` /
 *   `edgeCompatPlugins`，以及 `nv8/core`、`nv8/plugins`、`nv8/plugin-sdk`、
 *   `nv8/profiles` 四个子路径——**全部不存在**。
 * - 同一份手册的第 17 节描述了一套九阶段审计（`npm run audit`、
 *   `npm run audit:functions`、`npm run test:core`、`npm run test:phase1`、
 *   `npm run benchmark:ips-threads`），这些脚本一个都没有，还配了一句
 *   「不要伪造或清空 evidence 来绕过门禁」。
 * - `docs/evidence-contract.md` / `docs/node-compatibility.md` 的示例从
 *   `'nv8/core'` 导入，而 `exports` 里没有这个子路径。
 *
 * 这些都是「读一遍就能发现」的问题，但没人会为了 review 去逐条核对 1500 行手册。
 * 所以把它变成断言。
 *
 * 只查**可机械核对**的三类引用，不查语义：npm 脚本名、子路径导出、仓库内文件路径。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const REPO_ROOT = new URL('../', import.meta.url);

const packageJson = JSON.parse(
  await readFile(new URL('package.json', REPO_ROOT), 'utf8')
);
const SCRIPT_NAMES = new Set(Object.keys(packageJson.scripts));
const EXPORT_PATHS = new Set(Object.keys(packageJson.exports));

/**
 * 允许在文档里出现但不必存在的路径：本机产物（`.gitignore` 排除）。
 */
const PATH_EXEMPTIONS = new Set([
  'src/engine/realm/module-bundle.json', // 本机产物，见 .gitignore
]);

async function collectDocs() {
  const docs = ['README.md', 'sandbox_manual.md'];
  for (const entry of await readdir(new URL('docs/', REPO_ROOT), { withFileTypes: true })) {
    if (entry.isDirectory()) {
      for (const nested of await readdir(new URL(`docs/${entry.name}/`, REPO_ROOT))) {
        if (nested.endsWith('.md')) docs.push(`docs/${entry.name}/${nested}`);
      }
    } else if (entry.name.endsWith('.md')) {
      docs.push(`docs/${entry.name}`);
    }
  }
  const loaded = [];
  for (const path of docs) {
    loaded.push({ path, source: await readFile(new URL(path, REPO_ROOT), 'utf8') });
  }
  return loaded;
}

const docs = await collectDocs();

test('the doc set is actually being scanned', () => {
  assert.ok(docs.length >= 10, `expected the whole doc set, got ${docs.length}`);
  for (const name of ['README.md', 'sandbox_manual.md', 'docs/edge-parity.md', 'docs/api-reference.md']) {
    assert.ok(docs.some((doc) => doc.path === name), `${name} 没被扫到`);
  }
});

test('the public API reference covers every supported entry boundary', () => {
  const reference = docs.find((doc) => doc.path === 'docs/api-reference.md').source;
  for (const heading of ['## package root', '## Protocol API', '## Collector API', '## 错误和生命周期']) {
    assert.ok(reference.includes(heading), `api-reference.md 缺少 ${heading}`);
  }
  for (const exportPath of ['nv8/protocol', 'nv8/collector']) {
    assert.ok(reference.includes(exportPath), `api-reference.md 缺少 ${exportPath}`);
  }
  for (const safetyRule of ['网络未显式开启时全部拒绝', '凭据按精确 origin 绑定', 'Protocol 不接受相对 URL']) {
    assert.ok(reference.includes(safetyRule), `api-reference.md 缺少安全约束：${safetyRule}`);
  }
});

test('every `npm run <script>` in the docs exists', () => {
  const offenders = [];
  for (const doc of docs) {
    // 结尾是 `:` 或 `*` 的是通配写法（`npm run fingerprint:*`），不当具体脚本。
    for (const [, name] of doc.source.matchAll(/npm run ([a-z][a-z0-9:-]*[a-z0-9])(?![:*\w-])/g)) {
      if (!SCRIPT_NAMES.has(name)) offenders.push(`${doc.path}: npm run ${name}`);
    }
  }
  assert.deepEqual(offenders, [], offenders.join('\n'));
});

test('every `nv8/<subpath>` import in the docs is a real export', () => {
  const offenders = [];
  for (const doc of docs) {
    // 前面不能是 `@`、连字符或 `/`：`@nv8/plugin-dom-core` 是插件 id，
    // `node_modules/nv8/src/...` 是文件系统路径，都不是包导入子路径。
    for (const [, sub] of doc.source.matchAll(/(?<![@\w/-])nv8\/([a-z0-9][a-z0-9/-]*)/g)) {
      if (!EXPORT_PATHS.has(`./${sub}`)) offenders.push(`${doc.path}: nv8/${sub}`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    '这些子路径不在 package.json 的 exports 里：\n' + offenders.join('\n')
  );
});

test('every repo-relative file path in the docs exists', () => {
  const offenders = [];
  for (const doc of docs) {
    const pattern = /`((?:src|tests|scripts|docs|fixtures)\/[\w./-]+\.(?:js|mjs|json|md|sh))`/g;
    for (const [, relative] of doc.source.matchAll(pattern)) {
      if (PATH_EXEMPTIONS.has(relative)) continue;
      if (!existsSync(new URL(relative, REPO_ROOT))) {
        offenders.push(`${doc.path}: ${relative}`);
      }
    }
  }
  assert.deepEqual(offenders, [], offenders.join('\n'));
});

test('path exemptions stay justified', () => {
  // 豁免只对「不存在」有意义。一个豁免项如果其实存在，说明它已经过时——
  // 而过时的豁免会悄悄放过真问题。
  for (const relative of PATH_EXEMPTIONS) {
    if (relative === 'src/engine/realm/module-bundle.json') continue; // 本机产物，可能存在
    assert.equal(
      existsSync(new URL(relative, REPO_ROOT)),
      false,
      `${relative} 现在存在了，把它从 PATH_EXEMPTIONS 里删掉`
    );
  }
});
