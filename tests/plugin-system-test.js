/**
 * 插件系统基础测试
 */

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

async function testMinimalPreset() {
  console.log('\n=== Testing Minimal Preset ===');
  
  const nv8 = await createNv8({
    plugins: minimalPreset,
    trace: true,
  });
  
  console.log('Sandbox info:', nv8.inspect());
  
  // 测试基础功能
  const result = await nv8.eval(`
    console.log('Hello from Nv8!');
    const arr = [1, 2, 3, 4, 5];
    arr.reduce((sum, n) => sum + n, 0);
  `);
  
  console.log('Eval result:', result);
  
  await nv8.destroy();
  console.log('✓ Minimal preset test passed');
}

async function testBasicPreset() {
  console.log('\n=== Testing Basic Preset ===');
  
  const nv8 = await createNv8({
    plugins: basicPreset,
    trace: true,
  });
  
  console.log('Sandbox info:', nv8.inspect());
  
  // 测试 URL API
  const result = await nv8.eval(`
    const url = new URL('https://example.com/path?foo=bar');
    url.searchParams.get('foo');
  `);
  
  console.log('URL result:', result);
  
  // 测试 TextEncoder
  const encodeResult = await nv8.eval(`
    const encoder = new TextEncoder();
    const data = encoder.encode('Hello');
    Array.from(data);
  `);
  
  console.log('Encode result:', encodeResult);
  
  await nv8.destroy();
  console.log('✓ Basic preset test passed');
}

async function testRealmPluginActivation() {
  console.log('\n=== Testing Realm Plugin Activation ===');
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
    logger: { info() {}, warn() {}, error() {}, trace() {} },
  });
  assertEqual(await nv8.eval('globalThis.activationValue'), nv8.sandbox.id);
  await nv8.destroy();
  console.log('✓ Realm plugin activation test passed');
}

function assertEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}`);
  }
}

async function testDomCoreActivation() {
  console.log('\\n=== Testing DOM Core Activation ===');
  const nv8 = await createNv8({
    plugins: domPreset,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/',
      pageHtml: '<!doctype html><html><head><title>Core</title></head><body><p id="boot">page-ok</p></body></html>',
    },
    trace: false,
    logger: { info() {}, warn() {}, error() {}, trace() {} },
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
  console.log('✓ DOM Core activation test passed');
}

async function testWebSocketRealmActivation() {
  console.log('\\n=== Testing WebSocket Realm Activation ===');
  const nv8 = await createNv8({
    plugins: [...basicPreset, websocketPlugin],
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/' },
    trace: false,
    logger: { info() {}, warn() {}, error() {}, trace() {} },
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
  console.log('✓ WebSocket Realm activation test passed');
}

async function testCryptoRealmActivation() {
  console.log('\\n=== Testing Crypto Realm Activation ===');
  const nv8 = await createNv8({
    plugins: basicPreset,
    trace: false,
    logger: { info() {}, warn() {}, error() {}, trace() {} },
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
  console.log('✓ Crypto Realm activation test passed');
}

async function testPerformanceRealmActivation() {
  console.log('\\n=== Testing Performance Realm Activation ===');
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
    logger: { info() {}, warn() {}, error() {}, trace() {} },
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
  console.log('✓ Performance Realm activation test passed');
}

async function testNavigatorRealmActivation() {
  console.log('\\n=== Testing Navigator Realm Activation ===');
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
    logger: { info() {}, warn() {}, error() {}, trace() {} },
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
  console.log('✓ Navigator Realm activation test passed');
}

async function testNetworkRealmActivation() {
  console.log('\\n=== Testing Network Realm Activation ===');
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
    logger: { info() {}, warn() {}, error() {}, trace() {} },
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
  console.log('✓ Network Realm activation test passed');
}

async function testNavigationRealmActivation() {
  console.log('\\n=== Testing Navigation Realm Activation ===');
  const nv8 = await createNv8({
    plugins: [...basicPreset, locationPlugin, historyPlugin],
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/start?source=fixture' },
    trace: false,
    logger: { info() {}, warn() {}, error() {}, trace() {} },
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
  console.log('✓ Navigation Realm activation test passed');
}

async function testStorageRealmActivation() {
  console.log('\\n=== Testing Storage Realm Activation ===');
  const nv8 = await createNv8({
    plugins: [...basicPreset, storagePlugin],
    trace: false,
    logger: { info() {}, warn() {}, error() {}, trace() {} },
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
  console.log('✓ Storage Realm activation test passed');
}

async function testFullPresetResolution() {
  console.log('\n=== Testing Full Preset Resolution ===');
  const quietLogger = {
    info() {},
    warn() {},
    error() {},
    trace() {},
  };
  const nv8 = await createNv8({
    plugins: fullPreset,
    trace: false,
    logger: quietLogger,
  });
  const info = nv8.inspect();
  if (info.plugins.length !== fullPreset.length) {
    throw new Error(`Expected ${fullPreset.length} plugins, got ${info.plugins.length}`);
  }
  if (!info.capabilities.includes('dom.base')) {
    throw new Error('Full preset did not resolve dom.base capability');
  }
  await nv8.destroy();
  console.log('✓ Full preset resolution test passed');
}

async function testPluginCapabilities() {
  console.log('\n=== Testing Plugin Capabilities ===');
  
  const nv8 = await createNv8({
    plugins: basicPreset,
  });
  
  // 检查能力
  console.log('Available capabilities:', nv8.sandbox.getAllCapabilities());
  console.log('Has console capability:', nv8.sandbox.hasCapability('console.base'));
  console.log('Has URL capability:', nv8.sandbox.hasCapability('url.base'));
  
  await nv8.destroy();
  console.log('✓ Plugin capabilities test passed');
}

async function testMultipleRealms() {
  console.log('\n=== Testing Multiple Realms ===');
  
  const nv8 = await createNv8({
    plugins: basicPreset,
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
  
  console.log('Realm 1 message:', msg1);
  console.log('Realm 2 message:', msg2);
  console.log('Realms are isolated:', msg1 !== msg2);
  
  await nv8.destroy();
  console.log('✓ Multiple realms test passed');
}

async function testQuickEval() {
  console.log('\n=== Testing Quick Eval ===');
  
  const result = await nv8Eval(`
    const now = Date.now();
    const arr = Array.from({ length: 5 }, (_, i) => i * 2);
    arr.reduce((sum, n) => sum + n, 0);
  `, {
    plugins: minimalPreset,
  });
  
  console.log('Quick eval result:', result);
  console.log('✓ Quick eval test passed');
}

// 运行所有测试
async function runTests() {
  console.log('Starting plugin system tests...\n');
  
  try {
    await testMinimalPreset();
    await testBasicPreset();
    await testRealmPluginActivation();
    await testDomCoreActivation();
    await testWebSocketRealmActivation();
    await testCryptoRealmActivation();
    await testPerformanceRealmActivation();
    await testNavigatorRealmActivation();
    await testNetworkRealmActivation();
    await testNavigationRealmActivation();
    await testStorageRealmActivation();
    await testFullPresetResolution();
    await testPluginCapabilities();
    await testMultipleRealms();
    await testQuickEval();
    
    console.log('\n✓ All tests passed!');
  } catch (error) {
    console.error('\n✗ Test failed:', error);
    process.exit(1);
  }
}

runTests();
