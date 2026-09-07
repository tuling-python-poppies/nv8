import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';
import { streamsPlugin } from '../src/plugins/streams/index.js';
import { fetchPlugin } from '../src/plugins/fetch/index.js';
import { navigatorPlugin } from '../src/plugins/navigator/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { workerPlugin } from '../src/plugins/worker/index.js';
import { serviceWorkerPlugin } from '../src/plugins/service-worker/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };
const plugins = [
  ...domPreset,
  streamsPlugin,
  fetchPlugin,
  navigatorPlugin,
  messagingPlugin,
  workerPlugin,
  serviceWorkerPlugin,
];

function createRuntime(script) {
  return createNv8({
    plugins,
    profile: { id: 'service-worker-test', version: '1.0.0', name: 'Test Profile', url: 'https://example.test/app/page' },
    replay: [{
      method: 'GET',
      url: 'https://example.test/sw-clients.js',
      repeat: 'unlimited',
      body: script,
    }],
    logger,
  });
}

test('ServiceWorker registration resolves ready with active metadata', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));`);
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const result = await realm.evaluate(`(async () => {
      const readyPromise = navigator.serviceWorker.ready;
      const registration = await navigator.serviceWorker.register('/sw-clients.js', {
        scope: '/app/', updateViaCache: 'none',
      });
      const ready = await readyPromise;
      return JSON.stringify([
        ready === registration,
        registration.scope,
        registration.updateViaCache,
        registration.installing === null,
        registration.waiting === null,
        registration.active.state,
        navigator.serviceWorker.controller.scriptURL,
      ]);
    })()`);
    assert.deepEqual(JSON.parse(result), [
      true,
      'https://example.test/app/',
      'none',
      true,
      true,
      'activated',
      'https://example.test/sw-clients.js',
    ]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('ServiceWorker messages complete asynchronously and preserve source identity', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
    self.onmessage = event => self.postMessage(JSON.stringify([
      event.data,
      event.source !== null,
    ]));`);
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const result = await realm.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw-clients.js', { scope: '/app/' });
      const response = new Promise(resolve => {
        navigator.serviceWorker.onmessage = event => resolve([
          JSON.parse(event.data),
          event.source === navigator.serviceWorker.controller,
        ]);
      });
      navigator.serviceWorker.controller.postMessage({ kind: 'roundtrip', value: 7 });
      return JSON.stringify(await response);
    })()`);
    assert.deepEqual(JSON.parse(result), [[{ kind: 'roundtrip', value: 7 }, true], true]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('ServiceWorker WindowClient filters and operations use Realm-scoped clients', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
    self.onmessage = async event => {
      const all = await self.clients.matchAll({ type: 'window' });
      const top = await self.clients.matchAll({ windowType: 'top-level' });
      const nested = await self.clients.matchAll({ windowType: 'nested' });
      const workers = await self.clients.matchAll({ type: 'worker' });
      nested[0].postMessage('from-client');
      const focused = await nested[0].focus();
      const navigated = await nested[0].navigate('/app/moved');
      self.postMessage(JSON.stringify([
        all.length, top.length, nested.length, workers.length,
        focused.focused, navigated.url,
      ]));
    };`);
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const result = await realm.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw-clients.js', { scope: '/app/' });
      const clientMessage = new Promise(resolve => {
        navigator.serviceWorker.onmessage = event => resolve(event.data);
      });
      const frame = document.createElement('iframe');
      await new Promise(resolve => {
        frame.srcdoc = '<!doctype html><html><body>child</body></html>';
        frame.addEventListener('load', resolve, { once: true });
        document.body.appendChild(frame);
      });
      const oldWindow = frame.contentWindow;
      oldWindow.navigator.serviceWorker.onmessage = event => {
        if (event.data === 'from-client') {
          oldWindow.__clientSource = event.source
            === oldWindow.navigator.serviceWorker.controller;
        }
      };
      navigator.serviceWorker.controller.postMessage('query');
      const summary = await clientMessage;
      // 多轮让位：单轮 0ms 在高负载下不一定足够排完所有已入队回调
      for (let round = 0; round < 8; round += 1) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      return JSON.stringify([JSON.parse(summary), oldWindow.__clientSource]);
    })()`);
    assert.deepEqual(JSON.parse(result), [[2, 1, 1, 0, true, 'https://example.test/app/moved'], true]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('includeUncontrolled extends ServiceWorker client matching', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
    self.onmessage = async () => {
      const controlled = await self.clients.matchAll();
      const all = await self.clients.matchAll({ includeUncontrolled: true, type: 'all' });
      self.postMessage(JSON.stringify([controlled.length, all.length]));
    };`);
  try {
    const root = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const outside = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/outside' });
    const result = await root.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw-clients.js', { scope: '/app/' });
      return new Promise(resolve => {
        navigator.serviceWorker.onmessage = event => resolve(event.data);
        navigator.serviceWorker.controller.postMessage('counts');
      });
    })()`);
    assert.deepEqual(JSON.parse(result), [1, 2]);
    await nv8.sandbox.destroyRealm(outside.id);
    await nv8.sandbox.destroyRealm(root.id);
  } finally {
    await nv8.destroy();
  }
});

test('ServiceWorker unregister broadcasts controllerchange to controlled root and iframe', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));`);
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const result = await realm.evaluate(`(async () => {
      const registration = await navigator.serviceWorker.register('/sw-clients.js', { scope: '/app/' });
      const frame = document.createElement('iframe');
      await new Promise(resolve => {
        frame.srcdoc = '<!doctype html><html><body>child</body></html>';
        frame.addEventListener('load', resolve, { once: true });
        document.body.appendChild(frame);
      });
      let rootChanges = 0;
      let childChanges = 0;
      navigator.serviceWorker.oncontrollerchange = () => { rootChanges += 1; };
      frame.contentWindow.navigator.serviceWorker.oncontrollerchange = () => { childChanges += 1; };
      await registration.unregister();
      // 多轮让位：单轮 0ms 在高负载下不一定足够排完所有已入队回调
      for (let round = 0; round < 8; round += 1) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      return JSON.stringify([
        rootChanges,
        childChanges,
        navigator.serviceWorker.controller === null,
        frame.contentWindow.navigator.serviceWorker.controller === null,
      ]);
    })()`);
    assert.deepEqual(JSON.parse(result), [1, 1, true, true]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('ServiceWorker update broadcasts controllerchange to controlled root and iframe', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));`);
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const result = await realm.evaluate(`(async () => {
      const registration = await navigator.serviceWorker.register('/sw-clients.js', {
        scope: '/app/', updateViaCache: 'none',
      });
      const frame = document.createElement('iframe');
      await new Promise(resolve => {
        frame.srcdoc = '<!doctype html><html><body>child</body></html>';
        frame.addEventListener('load', resolve, { once: true });
        document.body.appendChild(frame);
      });
      let rootChanges = 0;
      let childChanges = 0;
      navigator.serviceWorker.oncontrollerchange = () => { rootChanges += 1; };
      frame.contentWindow.navigator.serviceWorker.oncontrollerchange = () => { childChanges += 1; };
      await registration.update();
      // 多轮让位：单轮 0ms 在高负载下不一定足够排完所有已入队回调
      for (let round = 0; round < 8; round += 1) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      return JSON.stringify([rootChanges, childChanges]);
    })()`);
    assert.deepEqual(JSON.parse(result), [1, 1]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
