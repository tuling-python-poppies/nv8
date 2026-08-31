/**
 * 页面生命周期事件的规范一致性测试
 *
 * 这些行为此前有三个真实偏差，且都没被现有测试抓到——因为现有测试统一用
 * `document.addEventListener`，而失效的恰好是 `window.addEventListener`
 * 这条最主流的写法。把对照场景固化在这里防止回退。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createNv8, domPreset } from '../src/index.js';
import { streamsPlugin } from '../src/plugins/streams/index.js';
import { drainTasks } from './helpers/async-wait.js';

const silentLogger = { info() {}, warn() {}, error() {}, trace() {} };

/**
 * 在给定 HTML 下创建 Realm 并等生命周期跑完。
 *
 * @param {string} html
 * @param {string} [id]
 */
async function withPage(html, id = 'lifecycle') {
  const nv8 = await createNv8({
    plugins: [...domPreset, streamsPlugin],
    profile: {
      id,
      version: '1.0.0',
      name: 'Lifecycle',
      url: 'https://lifecycle.test/',
      pageHtml: html,
    },
    logger: silentLogger,
  });

  const realm = await nv8.sandbox.createRealm({
    type: 'root',
    pageUrl: 'https://lifecycle.test/',
    pageHtml: html,
  });
  await realm.pageScriptAsyncComplete;
  await drainTasks();

  return {
    realm,
    log: () => JSON.parse(realm.evaluate('JSON.stringify(globalThis.log ?? [])')),
    read: (expression) => realm.evaluate(expression),
    dispose: () => nv8.destroy(),
  };
}

const RECORDER = `
  globalThis.log = [];
  globalThis.probes = {};
  globalThis.probes.addEventListenerType = typeof globalThis.addEventListener;
  document.addEventListener('DOMContentLoaded', () => globalThis.log.push('doc:DOMContentLoaded'));
  globalThis.addEventListener('DOMContentLoaded', () => globalThis.log.push('win:DOMContentLoaded'));
  globalThis.addEventListener('load', () => globalThis.log.push('win:load'));
  // 真实 Edge 实测 document 上的 load 监听器从不触发；
  // 这里保留它，用于断言 doc:load 不会出现在 log 里。
  document.addEventListener('load', () => globalThis.log.push('doc:load'));
`;

// ------------------------------- window EventTarget 在 inline 脚本前就绪

test('window.addEventListener exists while inline parser scripts run', async () => {
  // 此前它由 executePageScripts() 首行安装，而 parser 阶段的 inline 脚本
  // 在 HTML 解析中就执行了——那时 addEventListener 是 undefined，
  // 脚本在第一次调用它时整段中断。
  const page = await withPage(
    `<!doctype html><html><head><script>${RECORDER}</script></head><body></body></html>`,
    'lifecycle-window-target'
  );

  try {
    assert.equal(
      page.read('globalThis.probes.addEventListenerType'),
      'function',
      'window.addEventListener must be available to the very first inline script'
    );
  } finally {
    await page.dispose();
  }
});

test('an inline script that registers window listeners runs to completion', async () => {
  const page = await withPage(
    `<!doctype html><html><head><script>${RECORDER}
      globalThis.probes.reachedEnd = true;
    </script></head><body></body></html>`,
    'lifecycle-script-completes'
  );

  try {
    // 偏差的可见症状就是脚本中断：末尾赋值不会执行
    assert.equal(page.read('globalThis.probes.reachedEnd'), true);
  } finally {
    await page.dispose();
  }
});

// -------------------------------------------------- 事件派发目标与冒泡

test('DOMContentLoaded reaches both document and window listeners', async () => {
  const page = await withPage(
    `<!doctype html><html><head><script>${RECORDER}</script></head><body></body></html>`,
    'lifecycle-dcl'
  );

  try {
    const log = page.log();
    assert.ok(log.includes('doc:DOMContentLoaded'), 'document listener must fire');
    assert.ok(
      log.includes('win:DOMContentLoaded'),
      'window listener must fire via bubbling — the most common ready hook'
    );
  } finally {
    await page.dispose();
  }
});

test('DOMContentLoaded fires exactly once per target', async () => {
  const page = await withPage(
    `<!doctype html><html><head><script>${RECORDER}</script></head><body></body></html>`,
    'lifecycle-dcl-once'
  );

  try {
    const log = page.log();
    // 第一版修复在 document 和 window 上各派发一次，导致 window 监听器
    // 被触发两次。靠冒泡送达即可，不能再补派发。
    assert.equal(
      log.filter((entry) => entry === 'win:DOMContentLoaded').length,
      1,
      'bubbling already delivers to window; an extra dispatch double-fires'
    );
    assert.equal(
      log.filter((entry) => entry === 'doc:DOMContentLoaded').length,
      1
    );
  } finally {
    await page.dispose();
  }
});

test('load is dispatched on window, not only on document', async () => {
  const page = await withPage(
    `<!doctype html><html><head><script>${RECORDER}</script></head><body></body></html>`,
    'lifecycle-load'
  );

  try {
    const log = page.log();
    // load 规范上 bubbles: false，只在 document 派发会让
    // window.addEventListener('load') 永远收不到。
    assert.ok(log.includes('win:load'), 'window load listener must fire');
    assert.equal(page.read('document.readyState'), 'complete');
  } finally {
    await page.dispose();
  }
});

test('DOMContentLoaded precedes load', async () => {
  const page = await withPage(
    `<!doctype html><html><head><script>${RECORDER}</script></head><body></body></html>`,
    'lifecycle-order'
  );

  try {
    const log = page.log();
    const dcl = log.indexOf('win:DOMContentLoaded');
    const load = log.indexOf('win:load');
    assert.ok(dcl !== -1 && load !== -1, 'both events must fire');
    assert.ok(dcl < load, 'DOMContentLoaded must precede load');
  } finally {
    await page.dispose();
  }
});

// ------------------------------------------------ inline defer / async

test('inline defer and async scripts execute — the attributes are ignored', async () => {
  // 浏览器只对**外部**脚本应用 defer/async；inline 脚本带这些属性时按普通
  // parser-blocking 脚本立即执行。此前两处逻辑都跳过它们，脚本被丢弃。
  const page = await withPage(
    `<!doctype html><html><head>
      <script>globalThis.log = [];</script>
      <script defer>globalThis.log.push('inline-defer');</script>
      <script async>globalThis.log.push('inline-async');</script>
    </head><body></body></html>`,
    'lifecycle-inline-defer'
  );

  try {
    const log = page.log();
    assert.ok(log.includes('inline-defer'), 'inline defer script must run');
    assert.ok(log.includes('inline-async'), 'inline async script must run');
    assert.deepEqual(
      log,
      ['inline-defer', 'inline-async'],
      'inline scripts run in document order, immediately'
    );
  } finally {
    await page.dispose();
  }
});

test('inline scripts run before DOMContentLoaded', async () => {
  const page = await withPage(
    `<!doctype html><html><head>
      <script>${RECORDER}</script>
      <script defer>globalThis.log.push('inline-defer');</script>
    </head><body></body></html>`,
    'lifecycle-inline-before-dcl'
  );

  try {
    const log = page.log();
    assert.ok(
      log.indexOf('inline-defer') < log.indexOf('doc:DOMContentLoaded'),
      'inline scripts are parser-blocking, so they precede DOMContentLoaded'
    );
  } finally {
    await page.dispose();
  }
});

// ------------------------------------------------ module 的 defer 语义

test('inline module scripts are deferred until after parsing', async () => {
  const page = await withPage(
    `<!doctype html><html><head>
      <script>globalThis.log = []; globalThis.log.push('classic');</script>
      <script type="module">globalThis.log.push('module');</script>
      <script>globalThis.log.push('classic-after');</script>
    </head><body></body></html>`,
    'lifecycle-module-defer'
  );

  try {
    assert.deepEqual(
      page.log(),
      ['classic', 'classic-after', 'module'],
      'module has defer semantics: it runs after all parser-blocking scripts'
    );
  } finally {
    await page.dispose();
  }
});

test('module scripts complete before DOMContentLoaded', async () => {
  const page = await withPage(
    `<!doctype html><html><head>
      <script>${RECORDER}</script>
      <script type="module">globalThis.log.push('module');</script>
    </head><body></body></html>`,
    'lifecycle-module-before-dcl'
  );

  try {
    const log = page.log();
    assert.ok(
      log.indexOf('module') < log.indexOf('doc:DOMContentLoaded'),
      'deferred scripts must finish before DOMContentLoaded'
    );
  } finally {
    await page.dispose();
  }
});

test('the full lifecycle order matches the browser', async () => {
  const page = await withPage(
    `<!doctype html><html><head>
      <script>${RECORDER}</script>
      <script type="module">globalThis.log.push('module');</script>
      <script defer>globalThis.log.push('inline-defer');</script>
    </head><body></body></html>`,
    'lifecycle-full-order'
  );

  try {
    assert.deepEqual(page.log(), [
      'inline-defer',
      'module',
      'doc:DOMContentLoaded',
      'win:DOMContentLoaded',
      'win:load',
    ]);
    // load 只在 window 上派发。真实 Edge 实测：
    //   ["document:DCL", "window:DCL", "window:load"]
    assert.equal(page.log().includes('doc:load'), false,
      'document load listeners must never fire');
  } finally {
    await page.dispose();
  }
});
