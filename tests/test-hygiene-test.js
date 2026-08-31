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
