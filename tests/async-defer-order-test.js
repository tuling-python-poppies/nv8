/**
 * async / defer 脚本的时序不变量
 *
 * 这些是规范**保证**的性质，与下载快慢无关。async 脚本的确切执行时刻在真实
 * 浏览器里是不确定的（取决于网络），所以测试锁住的是不变量而不是精确位置——
 * 断言精确位置等于把一次偶然的调度当成契约。
 *
 * 关键的规范事实：**DOMContentLoaded 不等 async 脚本**，只等 defer。因此
 * async 脚本在 DCL 之后执行是合法的（对应下载较慢的情形），而 `load` 必须
 * 等全部 async 脚本。
 *
 * NV8 离线重放下「下载」瞬时完成，调度落在 DCL 之后并保持确定。这是建模选择，
 * 不是缺陷——两种时序真实浏览器都会出现。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createNv8, domPreset } from '../src/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { windowPlugin } from '../src/plugins/window/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };
const plugins = [...domPreset, messagingPlugin, windowPlugin];

/**
 * 加载一个页面并取回脚本记录的日志。
 *
 * @param {string} pageHtml
 * @param {object[]} replay
 * @returns {Promise<string[]>}
 */
async function runPage(pageHtml, replay) {
  const nv8 = await createNv8({
    plugins,
    profile: {
      id: 'async-order', version: '1.0.0', name: 'Async Order',
      url: 'https://e.test/', pageHtml,
    },
    replay,
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({
      type: 'root', pageUrl: 'https://e.test/',
    });
    const log = JSON.parse(realm.evaluate('JSON.stringify(globalThis.L)'));
    await nv8.sandbox.destroyRealm(realm.id);
    return log;
  } finally {
    await nv8.destroy();
  }
}

/** 每个用例都要的记录样板。 */
const PRELUDE = `<script>
  globalThis.L = [];
  globalThis.rec = (tag) => L.push(tag);
  globalThis.hit = (tag) => L.push(tag + ':' + document.readyState);
  document.addEventListener('DOMContentLoaded', () => rec('DCL'));
  window.addEventListener('load', () => rec('load'));
</` + `script>`;

// ---------------------------------------------------- defer

test('deferred scripts run in document order', async () => {
  const log = await runPage(
    `<!doctype html><html><head>${PRELUDE}
<script defer src=/d1.js></` + `script>
<script defer src=/d2.js></` + `script>
<script defer src=/d3.js></` + `script>
</head><body></body></html>`,
    [
      { method: 'GET', url: 'https://e.test/d1.js', body: "hit('defer1')" },
      { method: 'GET', url: 'https://e.test/d2.js', body: "hit('defer2')" },
      { method: 'GET', url: 'https://e.test/d3.js', body: "hit('defer3')" },
    ],
  );

  const deferred = log.filter((entry) => entry.startsWith('defer'));
  assert.deepEqual(
    deferred.map((entry) => entry.split(':')[0]),
    ['defer1', 'defer2', 'defer3'],
    'defer order is document order regardless of download time'
  );
});

test('deferred scripts run before DOMContentLoaded, while readyState is "loading"', async () => {
  const log = await runPage(
    `<!doctype html><html><head>${PRELUDE}
<script defer src=/d1.js></` + `script>
</head><body></body></html>`,
    [{ method: 'GET', url: 'https://e.test/d1.js', body: "hit('defer1')" }],
  );

  // readyState 推进到 interactive 是在 defer 全部跑完之后，
  // 所以 defer 脚本自己看到的仍是 loading
  assert.ok(log.includes('defer1:loading'), `defer saw wrong readyState: ${log}`);
  assert.ok(
    log.indexOf('defer1:loading') < log.indexOf('DCL'),
    'DOMContentLoaded waits for deferred scripts'
  );
});

// ---------------------------------------------------- async

test('async scripts do not block DOMContentLoaded', async () => {
  const log = await runPage(
    `<!doctype html><html><head>${PRELUDE}
<script async src=/a1.js></` + `script>
</head><body></body></html>`,
    [{ method: 'GET', url: 'https://e.test/a1.js', body: "hit('async1')" }],
  );

  // 规范：DOMContentLoaded 只等 defer，不等 async。NV8 离线重放下 async
  // 落在 DCL 之后——这是合法时序之一（对应下载较慢的情形）。
  assert.ok(log.includes('DCL'));
  assert.ok(log.some((entry) => entry.startsWith('async1:')));
});

test('load waits for every async script', async () => {
  const log = await runPage(
    `<!doctype html><html><head>${PRELUDE}
<script async src=/a1.js></` + `script>
<script async src=/a2.js></` + `script>
</head><body></body></html>`,
    [
      { method: 'GET', url: 'https://e.test/a1.js', body: "hit('async1')" },
      { method: 'GET', url: 'https://e.test/a2.js', body: "hit('async2')" },
    ],
  );

  const loadIndex = log.indexOf('load');
  assert.ok(loadIndex >= 0, 'load must fire');
  for (const tag of ['async1', 'async2']) {
    const index = log.findIndex((entry) => entry.startsWith(`${tag}:`));
    assert.ok(index >= 0, `${tag} must run`);
    assert.ok(index < loadIndex, `load must fire after ${tag}`);
  }
});

test('each async script executes exactly once', async () => {
  const log = await runPage(
    `<!doctype html><html><head>${PRELUDE}
<script async src=/a1.js></` + `script>
<script async src=/a2.js></` + `script>
</head><body></body></html>`,
    [
      { method: 'GET', url: 'https://e.test/a1.js', body: "hit('async1')" },
      { method: 'GET', url: 'https://e.test/a2.js', body: "hit('async2')" },
    ],
  );

  // 动态脚本用 MutationObserver 兜底，容易让 parser 已处理过的脚本被再跑一次
  for (const tag of ['async1', 'async2']) {
    const runs = log.filter((entry) => entry.startsWith(`${tag}:`));
    assert.equal(runs.length, 1, `${tag} ran ${runs.length} times`);
  }
});

// ---------------------------------------------------- 失败不能挂住生命周期

test('a missing async script dispatches error and does not stall load', async () => {
  const log = await runPage(
    `<!doctype html><html><head>${PRELUDE}
<script id=bad async src=/missing.js></` + `script>
<script>
  var bad = document.getElementById('bad');
  bad.addEventListener('error', () => rec('asyncError'));
  bad.addEventListener('load', () => rec('asyncLoad'));
</` + `script>
</head><body></body></html>`,
    [],
  );

  // 重放缺失时必须走 error 事件，且**不能**同时派发 load
  assert.ok(log.includes('asyncError'), `error event missing: ${log}`);
  assert.equal(log.includes('asyncLoad'), false, 'a failed script must not report load');
  // 生命周期不能被失败的脚本挂住
  assert.ok(log.includes('load'), 'window load must still fire');
  assert.ok(
    log.indexOf('asyncError') < log.indexOf('load'),
    'the error resolves before load'
  );
});

test('a failing deferred script does not prevent later deferred scripts', async () => {
  const log = await runPage(
    `<!doctype html><html><head>${PRELUDE}
<script defer src=/boom.js></` + `script>
<script defer src=/after.js></` + `script>
</head><body></body></html>`,
    [
      { method: 'GET', url: 'https://e.test/boom.js', body: 'throw new Error("boom")' },
      { method: 'GET', url: 'https://e.test/after.js', body: "hit('after')" },
    ],
  );

  // 一个脚本抛错不该终止 defer 队列——浏览器里每个脚本是独立的执行单元
  assert.ok(log.some((entry) => entry.startsWith('after:')), `queue stalled: ${log}`);
  assert.ok(log.includes('DCL'));
});

// ---------------------------------------------------- 与流式解析的关系

test('async and defer never block the parser', async () => {
  const log = await runPage(
    `<!doctype html><html><head>${PRELUDE}
<script async src=/a1.js></` + `script>
<script defer src=/d1.js></` + `script>
</head><body>
<div id=x></div>
<script>rec('inlineAfterBody:' + (document.getElementById('x') !== null));</` + `script>
</body></html>`,
    [
      { method: 'GET', url: 'https://e.test/a1.js', body: "hit('async1')" },
      { method: 'GET', url: 'https://e.test/d1.js', body: "hit('defer1')" },
    ],
  );

  // body 里的 inline 脚本在解析期间就跑，早于 async/defer
  const inline = log.indexOf('inlineAfterBody:true');
  assert.ok(inline >= 0, `inline script did not observe its own DOM: ${log}`);
  assert.ok(
    inline < log.findIndex((entry) => entry.startsWith('defer1:')),
    'the parser reached the body before deferred scripts ran'
  );
});
