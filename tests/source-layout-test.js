/**
 * 源码树结构的守卫
 *
 * 结构重构（26 个顶层目录 → 8 项容器）的价值全在**目录名就是职责名**这一点上。
 * 而这种价值的衰减方式是渐进的：某天有人为了省事在 `src/` 下新开一个目录，
 * 平铺就重新开始，一年后又是 26 个。
 *
 * 所以把「顶层只有这 8 项」写成断言。新增顶层目录不是不许，是**必须显式改这份
 * 名单**——那一刻会有人问「它属于哪个容器」。
 *
 * 同时守住分层方向：`engine/` 是运行时管道，不该反向依赖 `surface/` 的实现。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = new URL('../src/', import.meta.url);

/**
 * `src/` 顶层允许的条目。
 *
 * 每一项就是一个职责，注释说明它是什么——「这个目录是干什么的」不该只能靠读
 * 里面的文件反推。
 */
const TOP_LEVEL = Object.freeze({
  'index.js': 'createNv8 / nv8Eval 入口',
  'public/': '对外入口（EdgeSandbox、选项归一化）',
  'engine/': '运行时管道：core / realm / bootstrap / webidl / plugin-sdk / compat',
  'surface/': '浏览器表面：api 实现 + install 安装器',
  'plugins/': '装配策略：选哪些表面、依赖谁、声明什么能力',
  'config/': '身份与组合：profiles / presets',
  'backend/': '进程与线程边界：controller / child / thread / protocol',
  'collection/': '采集链路：collector / request-protocol / evidence',
  'infra/': '横向基础设施：baseline / fingerprint / navigation / network / scheduler / trace / utils',
});

/** 各容器允许的直接子目录。 */
const CONTAINERS = Object.freeze({
  engine: ['core', 'realm', 'bootstrap', 'webidl', 'plugin-sdk', 'compat'],
  surface: ['api', 'install'],
  config: ['profiles', 'presets'],
  backend: ['controller', 'child', 'thread', 'protocol'],
  collection: ['collector', 'request-protocol', 'evidence'],
  infra: ['baseline', 'fingerprint', 'navigation', 'network', 'scheduler', 'trace', 'utils'],
});

async function entriesOf(url) {
  const entries = await readdir(url, { withFileTypes: true });
  return entries
    // 本机产物（module-bundle.json）不算结构
    .filter((entry) => entry.name !== 'module-bundle.json')
    .map((entry) => (entry.isDirectory() ? `${entry.name}/` : entry.name))
    .sort();
}

test('src/ has exactly the declared top-level entries', async () => {
  assert.deepEqual(await entriesOf(SRC), Object.keys(TOP_LEVEL).sort());
});

test('every top-level entry carries a one-line purpose', () => {
  for (const [name, purpose] of Object.entries(TOP_LEVEL)) {
    assert.ok(purpose.length > 10, `${name} 需要说明它是什么`);
  }
});

test('each container holds exactly the declared subdirectories', async () => {
  for (const [container, expected] of Object.entries(CONTAINERS)) {
    const actual = (await entriesOf(new URL(`${container}/`, SRC)))
      .filter((name) => name.endsWith('/'))
      .map((name) => name.slice(0, -1));
    assert.deepEqual(actual, [...expected].sort(), `src/${container}/`);
  }
});

/** 收集一个目录下所有 js 文件里的相对 import 目标（仓库相对路径）。 */
async function importTargets(dir, prefix) {
  const targets = [];
  const stack = [{ url: dir, rel: prefix }];
  while (stack.length > 0) {
    const { url, rel } = stack.pop();
    for (const entry of await readdir(url, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        stack.push({ url: new URL(`${entry.name}/`, url), rel: `${rel}${entry.name}/` });
        continue;
      }
      if (!entry.name.endsWith('.js')) continue;
      const source = await readFile(new URL(entry.name, url), 'utf8');
      for (const [, spec] of source.matchAll(/from\s*['"](\.[^'"]+)['"]/g)) {
        const resolved = path.posix.normalize(path.posix.join(`${rel}`, spec));
        targets.push({ from: `${rel}${entry.name}`, to: resolved });
      }
    }
  }
  return targets;
}

test('engine/ does not statically import surface implementations', async () => {
  // Core 层引用表面**只能**通过 Realm 的 moduleLoader（见 sandbox.js 顶部那四个
  // URL 常量的注释）：那些模块操作 Realm 的 globalThis，静态 import 会把表面装到
  // 宿主进程。所以这条断言查的是 `from '...'`，不查 `new URL(...)`。
  const targets = await importTargets(new URL('engine/', SRC), 'src/engine/');
  const offenders = targets
    .filter((entry) => entry.to.startsWith('src/surface/'))
    .filter((entry) => !entry.from.startsWith('src/engine/bootstrap/'))
    .map((entry) => `${entry.from} → ${entry.to}`)
    .sort();
  // bootstrap/ 是例外且**必须**是例外：它就是「把表面装进 Realm」这件事本身，
  // 而它自己是由 moduleLoader 在 Realm 内加载的。
  assert.deepEqual(
    offenders,
    [],
    'engine/（bootstrap 之外）不应静态 import surface：\n' + offenders.join('\n')
  );
});

test('surface/ does not import backend or collection', async () => {
  // 表面层只该依赖 engine（webidl / trace 之类）与自身。反过来依赖进程后端或
  // 采集链路，说明职责串了。
  const targets = await importTargets(new URL('surface/', SRC), 'src/surface/');
  const offenders = targets
    .filter((entry) => entry.to.startsWith('src/backend/')
      || entry.to.startsWith('src/collection/'))
    .map((entry) => `${entry.from} → ${entry.to}`)
    .sort();
  assert.deepEqual(offenders, [], offenders.join('\n'));
});
