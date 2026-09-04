/**
 * 测试套件自身的卫生检查
 *
 * 为什么需要：把一个固定毫秒数交给定时器再继续断言，等于在赌「这段时间内
 * 那件事一定发生」。并行跑整套测试或多 Node 版本连跑时，机器负载会让这个
 * 赌注失效，产生与被测实现完全无关的偶发失败。
 *
 * 这类抖动的代价很高：它会让人怀疑实现有并发问题，实际只是测试写法不对。
 * 所以用一条测试把规则固化下来，而不是靠 review 记住。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const TESTS_DIR = new URL('./', import.meta.url);
const REPO_ROOT = new URL('../', import.meta.url);

/** 允许出现固定延时的文件——助手模块自身实现轮询，必须能用 setTimeout */
const EXEMPT_PATHS = new Set([
  'helpers/async-wait.js',
]);

/**
 * 轮询间隔上限。<= 该值视为“让位/轮询间隔”，超过则视为“固定等待赌注”。
 *
 * 2ms 足够做轮询间隔，又明显小于任何真实的“等它做完”所需时长，
 * 因此这个阈值能把两种用法分开。
 */
const MAX_POLL_INTERVAL_MS = 2;

async function collectTestFiles(dir = TESTS_DIR, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      files.push(...await collectTestFiles(
        new URL(`${entry.name}/`, dir),
        `${prefix}${entry.name}/`,
      ));
    } else if (entry.name.endsWith('.js')) {
      files.push({ path: `${prefix}${entry.name}`, url: new URL(entry.name, dir) });
    }
  }
  return files;
}

test('test suite contains no fixed-duration sleep bets', async () => {
  const files = await collectTestFiles();
  assert.ok(files.length > 30, 'expected to scan the whole test suite');

  const offenders = [];

  for (const file of files) {
    if (EXEMPT_PATHS.has(file.path)) continue;
    const source = await readFile(file.url, 'utf8');

    source.split('\n').forEach((line, index) => {
      // 匹配 setTimeout(resolve, N) / setTimeout(r, N) 形式的延时
      for (const match of line.matchAll(/setTimeout\(\s*\w+\s*,\s*(\d+)\s*\)/g)) {
        const delay = Number(match[1]);
        if (delay > MAX_POLL_INTERVAL_MS) {
          offenders.push(`${file.path}:${index + 1}  setTimeout(..., ${delay})`);
        }
      }
    });
  }

  assert.deepEqual(
    offenders,
    [],
    'use waitUntil/waitForValue/drainTasks from tests/helpers/async-wait.js '
    + `instead of a fixed sleep:\n  ${offenders.join('\n  ')}`
  );
});

test('async-wait helpers are actually adopted by the suite', async () => {
  const files = await collectTestFiles();
  let importers = 0;
  for (const file of files) {
    if (EXEMPT_PATHS.has(file.path)) continue;
    const source = await readFile(file.url, 'utf8');
    if (/from '\.\/helpers\/async-wait\.js'/.test(source)) importers += 1;
  }
  assert.ok(
    importers >= 4,
    `expected multiple suites to use the shared helpers, found ${importers}`
  );
});

/**
 * Node 默认的测试文件名模式。`node --test`（不带参数）按这些模式递归发现。
 *
 * 参见 Node 文档 “Test runner execution model”。只列当前仓库会用到的那几种。
 */
function looksLikeTestFile(name) {
  return /(^|[.\-_])test\.(js|mjs|cjs)$/.test(name)
    || /^test-.*\.(js|mjs|cjs)$/.test(name);
}

async function collectStrayTestFiles(dir, prefix = '') {
  const skip = new Set(['node_modules', '.git', 'tests', '.tmp-probe', 'fixtures']);
  const entries = await readdir(dir, { withFileTypes: true });
  const strays = [];
  for (const entry of entries) {
    if (skip.has(entry.name)) continue;
    if (entry.isDirectory()) {
      strays.push(...await collectStrayTestFiles(
        new URL(`${entry.name}/`, dir),
        `${prefix}${entry.name}/`,
      ));
    } else if (looksLikeTestFile(entry.name)) {
      strays.push(`${prefix}${entry.name}`);
    }
  }
  return strays;
}

test('no test file lives outside tests/', async () => {
  // `npm test` 现在是 `node --experimental-vm-modules --test`，不再手写 80 条
  // 路径——新增测试不用注册就能跑（原来不注册就静默不跑，与「修掉沉默失效的
  // 36 项测试」同类隐患）。
  //
  // 代价是发现范围变成了整个仓库：产品树里任何一个叫 `*-test.js` /
  // `test.js` / `test-*.js` 的文件都会被当测试跑。`src/core/plugin-sdk/test.js`
  // 就是这样一份：住在 `src/`、用 `console.log` 手写断言、不在 `--test` 的计数
  // 里（已移到 `tests/plugin-sdk-test.js` 并改用 `node:test`）。
  //
  // 这条断言把「测试只住在 tests/」从约定变成强制。
  const strays = await collectStrayTestFiles(REPO_ROOT);
  assert.deepEqual(
    strays,
    [],
    '这些文件会被 `node --test` 自动当成测试跑，但不在 tests/ 下：'
    + strays.join(', ')
  );
});
