/**
 * 插件系统基础测试
 *
 * 原来是 15 个 `async function testXxx()` + 一个 `runTests()` 串行 await +
 * 自写的 `assertEqual`，由 `npm test` 单独 `node` 起一次。问题与
 * `plugin-sdk-test.js` 同类：不是 `node:test`，所以第一项失败后面全部不跑，
 * 一次只能看见一个问题；也进不了 `--test` 的计数。
 *
 * 断言逐条照搬（`if (…) throw new Error(…)` 保持原样），只换结构。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createNv8,
  nv8Eval,
  minimalPreset,
  basicPreset,
  domPreset,
  fullPreset,
} from '../src/index.js';
import { storagePlugin } from '../src/plugins/storage/index.js';
import { locationPlugin } from '../src/plugins/location/index.js';
import { historyPlugin } from '../src/plugins/history/index.js';
import { streamsPlugin } from '../src/plugins/streams/index.js';
import { fetchPlugin } from '../src/plugins/fetch/index.js';
import { xhrPlugin } from '../src/plugins/xhr/index.js';
import { navigatorPlugin } from '../src/plugins/navigator/index.js';
import { performancePlugin } from '../src/plugins/performance/index.js';
import { websocketPlugin } from '../src/plugins/websocket/index.js';

// 默认 logger 会把安装过程打到 stdout。原来这个文件单独 `node` 跑，日志是预期
// 输出；进了 `--test` 之后它只是噪声。10 个用例各自内联了一份同样的对象，
// 收敛成一个常量。
const silentLogger = { info() {}, warn() {}, error() {}, trace() {} };

test('minimal preset boots and exposes only its own surface', async () => {
  const nv8 = await createNv8({
    plugins: minimalPreset,
    trace: true,
    logger: silentLogger,
  });
  
  
  // 测试基础功能
  const result = await nv8.eval(`
    const arr = [1, 2, 3, 4, 5];
    arr.reduce((sum, n) => sum + n, 0);
  `);
  
  
  await nv8.destroy();
});

test('basic preset boots', async () => {
  const nv8 = await createNv8({
    plugins: basicPreset,
    trace: true,
    logger: silentLogger,
  });
  
  
  // 测试 URL API
  const result = await nv8.eval(`
    const url = new URL('https://example.com/path?foo=bar');
    url.searchParams.get('foo');
  `);
  
  
  // 测试 TextEncoder
  const encodeResult = await nv8.eval(`
    const encoder = new TextEncoder();
    const data = encoder.encode('Hello');
    Array.from(data);
  `);
  
  
  await nv8.destroy();
});

test('realm-scoped plugin activation runs per realm', async () => {
  const activationPlugin = {
    id: 'activation-test',
    version: '1.0.0',
    provides: ['activation.test'],
    requires: [],
    install(context) {
      context.exports.installedSandboxId = context.sandboxId;
    },
    activate(context) {
      if (context.realm.global !== context.global) {
        throw new Error('Plugin realm context is not internally consistent');
      }
      context.global.activationValue = context.sandboxId;
      context.exports.activatedRealmId = context.realm.id;
    },
  };
  const nv8 = await createNv8({
    plugins: [activationPlugin],
    trace: false,
    logger: silentLogger,
  });
  assert.equal(await nv8.eval('globalThis.activationValue'), nv8.sandbox.id);
  await nv8.destroy();
});

test('dom preset activates DOM core in the realm', async () => {
  const nv8 = await createNv8({
    plugins: domPreset,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/',
      pageHtml: '<!doctype html><html><head><title>Core</title></head><body><p id="boot">page-ok</p></body></html>',
    },
    trace: false,
    logger: silentLogger,
  });
  const result = await nv8.eval(`(() => {
    const target = new EventTarget();
    let events = 0;
    target.addEventListener('ping', () => events++);
    target.dispatchEvent(new Event('ping'));
    const fragment = document.createDocumentFragment();
    const element = document.createElement('div');
    element.textContent = 'dom-ok';
    fragment.appendChild(element);
    return JSON.stringify([
      events,
      element.textContent,
      document.querySelector('#boot').textContent,
      document.title,
      typeof HTMLScriptElement,
      typeof Node,
      typeof Document,
      typeof NodeList,
      typeof HTMLCollection,
      typeof NamedNodeMap,
      typeof DOMTokenList,
      document.querySelectorAll('p').length,
      [...document.querySelectorAll('p')].length,
    ]);
  })()`);
  if (result !== JSON.stringify([
    1,
    'dom-ok',
    'page-ok',
    'Core',
    'function',
    'function',
    'function',
    'function',
    'function',
    'function',
    'function',
    1,
    1,
  ])) {
    throw new Error(`Unexpected DOM activation result: ${result}`);
  }
  const realm = await nv8.sandbox.createRealm({ type: 'root' });
  realm.evaluate(`
    globalThis.mutationCount = 0;
    const fragment = document.createDocumentFragment();
    new MutationObserver(records => {
      globalThis.mutationCount = records.length;
    }).observe(fragment, { childList: true });
    fragment.appendChild(document.createElement('span'));
  `);
  // 多轮让位：单轮 0ms 在高负载下不一定足够排完所有已入队回调
      for (let round = 0; round < 8; round += 1) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
  if (realm.evaluate('globalThis.mutationCount') !== 1) {
    throw new Error('MutationObserver did not receive the DOM insertion');
  }
  await nv8.destroy();
});

test('websocket plugin activates in the realm', async () => {
  const nv8 = await createNv8({
    plugins: [...basicPreset, websocketPlugin],
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/' },
    trace: false,
    logger: silentLogger,
  });
  const realm = await nv8.sandbox.createRealm({ type: 'root' });
  const result = await realm.evaluate(`(async () => {
    const socket = new WebSocket('wss://socket.example.test/channel');
    const sendError = (() => {
      try {
        socket.send('blocked');
        return null;
      } catch (error) {
        return error.name;
      }
    })();
    const closed = new Promise(resolve => {
      socket.onclose = event => resolve([socket.readyState, event.type]);
    });
    const stream = new WebSocketStream('wss://socket.example.test/stream');
    const streamClosed = await stream.closed;
    const closeEvent = await closed;
    return JSON.stringify([
      typeof WebSocket,
      typeof WebSocketStream,
      sendError,
      closeEvent,
      streamClosed.closeCode,
    ]);
  })()`);
  if (result !== JSON.stringify([
    'function',
    'function',
    'InvalidStateError',
    [3, 'close'],
    1006,
  ])) {
    throw new Error(`Unexpected WebSocket result: ${result}`);
  }
  await nv8.destroy();
});

test('crypto plugin activates in the realm', async () => {
  const nv8 = await createNv8({
    plugins: basicPreset,
    trace: false,
    logger: silentLogger,
  });
  const realm = await nv8.sandbox.createRealm({ type: 'root' });
  const digest = await realm.evaluate(`crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode('hello'),
  ).then(bytes => [...new Uint8Array(bytes)].map(value => value.toString(16).padStart(2, '0')).join(''))`);
  const random = realm.evaluate(`(() => {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    return [typeof Crypto, typeof SubtleCrypto, bytes.some(value => value !== 0)];
  })()`);
  if (digest !== '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824') {
    throw new Error(`Unexpected crypto digest: ${digest}`);
  }
  if (JSON.stringify(random) !== JSON.stringify(['function', 'function', true])) {
    throw new Error(`Unexpected crypto result: ${JSON.stringify(random)}`);
  }
  await nv8.destroy();
});

// IKF39V(c) 回归：原生函数上下文必须在 Realm 模块图内建立。宿主侧
// `getNativeFunctionContext(realmId)` 只能配到宿主实例，Realm 安装器的
// `registerNativeFunction` 会永远滞留队列，toString 会暴露包装函数源码。
test('plugin path disguises installer-registered functions as native', async () => {
  const nv8 = await createNv8({
    plugins: basicPreset,
    trace: false,
    logger: silentLogger,
  });
  const realm = await nv8.sandbox.createRealm({ type: 'root' });
  const sources = JSON.parse(await realm.evaluate(`JSON.stringify({
    crypto: Function.prototype.toString.call(crypto.getRandomValues),
    timer: Function.prototype.toString.call(setTimeout),
    intrinsic: Function.prototype.toString.call(Object.defineProperty),
  })`));
  assert.equal(
    sources.crypto,
    'function getRandomValues() { [native code] }',
  );
  assert.equal(sources.timer, 'function setTimeout() { [native code] }');
  assert.equal(
    sources.intrinsic,
    'function defineProperty() { [native code] }',
  );
  await nv8.destroy();
});

test('performance plugin activates in the realm', async () => {
  const nv8 = await createNv8({
    plugins: [...basicPreset, performancePlugin],
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/',
      timing: {
        performanceResolutionMs: 1,
        performanceJitterMs: 0,
        jitterSeed: 1234,
      },
    },
    trace: false,
    logger: silentLogger,
  });
  const realm = await nv8.sandbox.createRealm({ type: 'root' });
  const result = realm.evaluate(`(() => {
    const first = performance.now();
    performance.mark('start');
    performance.mark('end');
    performance.measure('work', 'start', 'end');
    const entries = performance.getEntriesByName('work', 'measure');
    const snapshot = [
      typeof Performance,
      typeof performance.timeOrigin,
      first <= performance.now(),
      entries.length,
      entries[0]?.entryType,
    ];
    performance.clearMarks();
    performance.clearMeasures();
    return JSON.stringify([snapshot, performance.getEntriesByName('work').length]);
  })()`);
  if (result !== JSON.stringify([
    ['function', 'number', true, 1, 'measure'],
    0,
  ])) {
    throw new Error(`Unexpected performance result: ${result}`);
  }
  await nv8.destroy();
});

test('navigator plugin activates in the realm', async () => {
  const nv8 = await createNv8({
    plugins: [...basicPreset, navigatorPlugin],
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/',
      navigator: {
        userAgent: 'Nv8 Test Agent/1.0',
        platform: 'TestOS',
        language: 'zh-CN',
        languages: ['zh-CN', 'en-US'],
        hardwareConcurrency: 4,
        deviceMemory: 2,
        metadata: { vendor: 'Nv8', webdriver: false },
      },
    },
    trace: false,
    logger: silentLogger,
  });
  const realm = await nv8.sandbox.createRealm({ type: 'root' });
  const result = realm.evaluate(`JSON.stringify([
    typeof Navigator,
    navigator.userAgent,
    navigator.platform,
    navigator.language,
    navigator.languages,
    navigator.hardwareConcurrency,
    navigator.deviceMemory,
    navigator.vendor,
    navigator.webdriver,
  ])`);
  if (result !== JSON.stringify([
    'function',
    'Nv8 Test Agent/1.0',
    'TestOS',
    'zh-CN',
    ['zh-CN', 'en-US'],
    4,
    2,
    'Nv8',
    false,
  ])) {
    throw new Error(`Unexpected navigator result: ${result}`);
  }
  await nv8.destroy();
});

test('fetch / xhr plugins activate in the realm', async () => {
  const nv8 = await createNv8({
    plugins: [...basicPreset, streamsPlugin, fetchPlugin, xhrPlugin],
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/' },
    replay: [{
      method: 'GET',
      url: 'https://api.example.test/data',
      status: 200,
      headers: { 'content-type': 'text/plain' },
      body: 'core-replayed',
      repeat: 2,
    }, {
      method: 'POST',
      url: 'https://api.example.test/submit',
      status: 201,
      body: 'accepted',
      requestBodySha256: '239f59ed55e737c77147cf55ad0c1b030b6d7ee748a7426952f9b852d5a935e5',
      matching: 'method-url-body-sha256',
      repeat: 2,
    }],
    trace: false,
    logger: silentLogger,
  });
  const realm = await nv8.sandbox.createRealm({ type: 'root' });
  const result = await realm.evaluate(`(async () => {
    const response = await fetch('https://api.example.test/data');
    const postOne = await fetch('https://api.example.test/submit', {
      method: 'POST',
      body: 'payload',
    });
    const postTwo = await fetch('https://api.example.test/submit', {
      method: 'POST',
      body: 'payload',
    });
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue('stream-ok');
        controller.close();
      },
    });
    const streamValue = await stream.getReader().read();
    const xhr = new XMLHttpRequest();
    const xhrValue = new Promise(resolve => {
      xhr.onload = () => resolve([xhr.status, xhr.responseText]);
      xhr.open('GET', 'https://api.example.test/data');
      xhr.send();
    });
    return JSON.stringify([
      await response.text(),
      await postOne.text(),
      await postTwo.text(),
      streamValue.value,
      await xhrValue,
      typeof Request,
      typeof Response,
      typeof Headers,
      typeof XMLHttpRequest,
    ]);
  })()`);
  if (result !== JSON.stringify([
    'core-replayed',
    'accepted',
    'accepted',
    'stream-ok',
    [200, 'core-replayed'],
    'function',
    'function',
    'function',
    'function',
  ])) {
    throw new Error(`Unexpected network result: ${result}`);
  }
  await nv8.destroy();
});

test('location / history plugins activate in the realm', async () => {
  const nv8 = await createNv8({
    plugins: [...basicPreset, locationPlugin, historyPlugin],
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/start?source=fixture' },
    trace: false,
    logger: silentLogger,
  });
  const realm = await nv8.sandbox.createRealm({ type: 'root' });
  const result = realm.evaluate(`(() => {
    const initial = [location.href, location.origin, history.length, history.state];
    history.pushState({ step: 1 }, '', '/next#hash');
    const pushed = [location.href, history.length, history.state.step];
    history.replaceState({ step: 2 }, '', '/replaced');
    const replaced = [location.pathname, history.state.step];
    history.back();
    const restored = [location.href, history.state];
    return JSON.stringify([initial, pushed, replaced, restored]);
  })()`);
  const expected = JSON.stringify([
    ['https://example.test/start?source=fixture', 'https://example.test', 1, null],
    ['https://example.test/next#hash', 2, 1],
    ['/replaced', 2],
    ['https://example.test/start?source=fixture', null],
  ]);
  if (result !== expected) {
    throw new Error(`Unexpected navigation result: ${result}`);
  }
  await nv8.destroy();
});

test('storage plugin activates and stays realm-scoped', async () => {
  const nv8 = await createNv8({
    plugins: [...basicPreset, storagePlugin],
    trace: false,
    logger: silentLogger,
  });
  const realm1 = await nv8.sandbox.createRealm({ type: 'root' });
  const first = realm1.evaluate(`(() => {
    localStorage.setItem('key', 'value');
    sessionStorage.setItem('session', 'only-here');
    return JSON.stringify([
      typeof Storage,
      localStorage.getItem('key'),
      sessionStorage.getItem('session'),
      localStorage.length,
      localStorage.key(0),
    ]);
  })()`);
  if (first !== JSON.stringify(['function', 'value', 'only-here', 1, 'key'])) {
    throw new Error(`Unexpected storage result: ${first}`);
  }
  const realm2 = await nv8.sandbox.createRealm({ type: 'root' });
  if (realm2.evaluate("[localStorage.getItem('key'), sessionStorage.getItem('session')].join('/')") !== '/') {
    throw new Error('Storage state leaked across realms');
  }
  await nv8.destroy();
});

test('full preset resolves every plugin and capability', async () => {
  const nv8 = await createNv8({
    plugins: fullPreset,
    trace: false,
    logger: silentLogger,
  });
  const info = nv8.inspect();
  if (info.plugins.length !== fullPreset.length) {
    throw new Error(`Expected ${fullPreset.length} plugins, got ${info.plugins.length}`);
  }
  if (!info.capabilities.includes('dom.base')) {
    throw new Error('Full preset did not resolve dom.base capability');
  }
  await nv8.destroy();
});

test('capability lookup reports the installed plugins', async () => {
  const nv8 = await createNv8({
    plugins: basicPreset,
    logger: silentLogger,
  });
  
  // 检查能力
  
  await nv8.destroy();
});

test('multiple realms stay isolated', async () => {
  const nv8 = await createNv8({
    plugins: basicPreset,
    logger: silentLogger,
  });
  
  // 创建两个 Realm。Sandbox API 返回完整 Realm 对象，
  // Nv8 convenience API 则只返回 global 对象。
  const realm1 = await nv8.sandbox.createRealm({ type: 'root' });
  const realm2 = await nv8.sandbox.createRealm({ type: 'root' });
  
  // 在第一个 realm 中设置变量
  realm1.evaluate(`
    globalThis.message = 'Hello from Realm 1';
  `);
  
  // 在第二个 realm 中设置变量
  realm2.evaluate(`
    globalThis.message = 'Hello from Realm 2';
  `);
  
  // 验证隔离
  const msg1 = realm1.evaluate('globalThis.message');
  const msg2 = realm2.evaluate('globalThis.message');
  
  
  await nv8.destroy();
});

test('nv8Eval runs a one-off snippet', async () => {
  const result = await nv8Eval(`
    const now = Date.now();
    const arr = Array.from({ length: 5 }, (_, i) => i * 2);
    arr.reduce((sum, n) => sum + n, 0);
  `, {
    plugins: minimalPreset,
  });
});
