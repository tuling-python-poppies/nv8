import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';
import { streamsPlugin } from '../src/plugins/streams/index.js';
import { fetchPlugin } from '../src/plugins/fetch/index.js';
import { navigatorPlugin } from '../src/plugins/navigator/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { workerPlugin } from '../src/plugins/worker/index.js';
import { serviceWorkerPlugin } from '../src/plugins/service-worker/index.js';
import { locationPlugin } from '../src/plugins/location/index.js';
import { drainTasks, waitUntil } from './helpers/async-wait.js';

/** 等待出现一个与 `previousId` 不同的 root Realm */
async function waitForRootRealmReplacement(nv8, previousId) {
  await waitUntil(
    () => nv8.sandbox.getAllRealms()
      .some(realm => realm.type === 'root' && realm.id !== previousId),
    { label: `root realm replacing ${previousId}` },
  );
}

const logger = { info() {}, warn() {}, error() {}, trace() {} };
const plugins = [
  ...domPreset,
  streamsPlugin,
  fetchPlugin,
  navigatorPlugin,
  messagingPlugin,
  workerPlugin,
  serviceWorkerPlugin,
  locationPlugin,
];

test('WindowClient.navigate replaces the root Realm and preserves its client identity', async () => {
  const nv8 = await createNv8({
    plugins,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/app/page' },
    replay: [{
      method: 'GET',
      url: 'https://example.test/sw.js',
      repeat: 'unlimited',
      body: `self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
        self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
        self.addEventListener('fetch', event => {
          if (event.request.url.endsWith('/app/replaced')) {
            event.respondWith(new Response('<!doctype html><html><body><main id="served">replacement</main></body></html>'));
          }
        });
        self.onmessage = async () => {
          const [client] = await self.clients.matchAll({ windowType: 'top-level' });
          await client.navigate('/app/replaced');
        };`,
    }],
    logger,
  });
  try {
    const oldRealm = await nv8.sandbox.createRealm({
      type: 'root',
      pageUrl: 'https://example.test/app/page',
    });
    // pagehide/unload 在 **window** 上派发，不在 document。真实 Edge 实测确认
    // document 监听器一个都不触发。
    //
    // 监听器在 Realm **内部**注册：宿主侧的 `realm.global` 与 Realm 内的
    // `globalThis` 不是同一个 EventTarget 接收者，从宿主调
    // `realm.global.addEventListener` 会抛 Illegal invocation。
    const oldDocument = oldRealm.global.document;
    oldRealm.evaluate(`
      globalThis.__events = [];
      window.addEventListener('pagehide', () => globalThis.__events.push('pagehide'));
      window.addEventListener('unload', () => globalThis.__events.push('unload'));
    `);
    await oldRealm.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' });
      navigator.serviceWorker.controller.postMessage('navigate');
    })()`);
    await waitForRootRealmReplacement(nv8, oldRealm.id);
    const realms = nv8.sandbox.getAllRealms();
    const rootRealms = realms.filter(realm => realm.type === 'root');
    assert.equal(rootRealms.length, 1);
    const replacement = rootRealms[0];
    assert.notEqual(replacement.id, oldRealm.id);
    assert.equal(replacement.evaluate('document.URL'), 'https://example.test/app/replaced');
    assert.equal(replacement.evaluate('document.querySelector("#served").textContent'), 'replacement');
    assert.deepEqual(
      JSON.parse(oldRealm.evaluate('JSON.stringify(globalThis.__events)')),
      ['pagehide', 'unload'],
    );
    assert.equal(replacement.evaluate('navigator.serviceWorker.controller !== null'), true);
    await nv8.sandbox.destroyRealm(replacement.id);
  } finally {
    await nv8.destroy();
  }
});

test('parser-time location navigation is replayed after root WindowClient registration', async () => {
  const nv8 = await createNv8({
    plugins,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/app/page',
      pageHtml: '<!doctype html><html><body><script>location.assign("/app/parser-target")</script></body></html>',
    },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    assert.equal(realm.type, 'root');
    assert.equal(realm.evaluate('location.href'), 'https://example.test/app/parser-target');
    assert.equal(realm.evaluate('document.URL'), 'https://example.test/app/parser-target');
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('location.assign replaces the root Realm through the navigation callback', async () => {
  const nv8 = await createNv8({
    plugins,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/app/page' },
    logger,
  });
  try {
    const oldRealm = await nv8.sandbox.createRealm({ type: 'root' });
    oldRealm.evaluate("location.assign('/app/location-target')");
    await waitForRootRealmReplacement(nv8, oldRealm.id);
    const replacement = nv8.sandbox.getAllRealms()
      .find(realm => realm.type === 'root');
    assert.notEqual(replacement.id, oldRealm.id);
    assert.equal(replacement.evaluate('location.href'), 'https://example.test/app/location-target');
    await nv8.sandbox.destroyRealm(replacement.id);
  } finally {
    await nv8.destroy();
  }
});

test('location.replace replaces the root Realm through the navigation callback', async () => {
  const nv8 = await createNv8({
    plugins,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/app/page' },
    logger,
  });
  try {
    const oldRealm = await nv8.sandbox.createRealm({ type: 'root' });
    oldRealm.evaluate("location.replace('/app/replacement-target')");
    await waitForRootRealmReplacement(nv8, oldRealm.id);
    const replacement = nv8.sandbox.getAllRealms()
      .find(realm => realm.type === 'root');
    assert.notEqual(replacement.id, oldRealm.id);
    assert.equal(replacement.evaluate('location.href'), 'https://example.test/app/replacement-target');
    await nv8.sandbox.destroyRealm(replacement.id);
  } finally {
    await nv8.destroy();
  }
});

test('fragment location navigation keeps the current root Realm', async () => {
  const nv8 = await createNv8({
    plugins,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/app/page' },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    realm.evaluate("location.href = '#section'");
    // 断言“不应发生替换”：没有可等的正向条件，只能让已排队的回调跑完
    await drainTasks();
    const roots = nv8.sandbox.getAllRealms().filter(item => item.type === 'root');
    assert.deepEqual(roots.map(item => item.id), [realm.id]);
    assert.equal(realm.evaluate('location.href'), 'https://example.test/app/page#section');
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('beforeunload cancellation prevents root location navigation', async () => {
  const nv8 = await createNv8({
    plugins,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/app/page' },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    realm.evaluate(`globalThis.addEventListener('beforeunload', event => event.preventDefault());
      location.assign('/app/blocked');`);
    // 同上：验证取消生效属于“不发生”断言
    await drainTasks();
    const roots = nv8.sandbox.getAllRealms().filter(item => item.type === 'root');
    assert.deepEqual(roots.map(item => item.id), [realm.id]);
    assert.equal(realm.evaluate('location.href'), 'https://example.test/app/page');
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

/**
 * `beforeunload` 的三条异议路径 —— 只有 `preventDefault()` 能在这里端到端验证。
 *
 * 另两条（`event.returnValue = '非空'`、`onbeforeunload` 返回字符串）需要
 * `BeforeUnloadEvent` 与 `onbeforeunload` 同时存在，而：
 *
 * - **plugin 模式**（含 `fullPreset`）不提供这两个 API，`dispatchBeforeUnload()`
 *   降级到普通 `Event`，此时 `returnValue` 是旧 IE 的**布尔**语义
 *   （赋 falsy 值 = preventDefault），与 beforeunload 的字符串语义相反。
 * - **legacy 模式**两个 API 都有，但导航**根本不触发 beforeunload**：
 *   `create-realm.js` 走 `bootstrapRoot` 时没有接任何导航钩子，
 *   `location.assign()` 只更新 URL 记录，既不派发 beforeunload 也不替换文档。
 *   接上它需要让 legacy 子 Realm 能回调宿主替换文档，是独立的架构工作。
 *
 * 这两条路径的单元级验证在 `dispatchBeforeUnload()` 的实现里有注释记录实测值；
 * 端到端验证等 legacy 导航接上钩子后再补。
 */
test('beforeunload preventDefault is the only end-to-end verifiable path here', async () => {
  const nv8 = await createNv8({
    plugins,
    profile: {
      id: 'test-profile', version: '1.0.0', name: 'Test Profile',
      url: 'https://example.test/app/page',
    },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    // 确认前提：这个插件集里确实没有 BeforeUnloadEvent，
    // 所以上面注释里的降级说明是当前事实而不是猜测
    assert.equal(realm.evaluate('typeof BeforeUnloadEvent'), 'undefined');
    assert.equal(realm.evaluate("'onbeforeunload' in globalThis"), false);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
