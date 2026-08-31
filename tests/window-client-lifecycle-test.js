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

async function createRuntime(body) {
  return createNv8({
    plugins,
    profile: { id: 'window-client-test', version: '1.0.0', name: 'Test Profile', url: 'https://example.test/app/page' },
    replay: [{
      method: 'GET',
      url: 'https://example.test/sw.js',
      repeat: 'unlimited',
      body,
    }],
    logger,
  });
}

test('removing an iframe removes its WindowClient snapshot', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
    self.onmessage = async () => {
      self.postMessage(String((await self.clients.matchAll()).length));
    };`);
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const result = await realm.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' });
      const frame = document.createElement('iframe');
      await new Promise(resolve => {
        frame.srcdoc = '<!doctype html><html><body>child</body></html>';
        frame.addEventListener('load', resolve, { once: true });
        document.body.appendChild(frame);
      });
      frame.remove();
      // 多轮让位：单轮 0ms 在高负载下不一定足够排完所有已入队回调
      for (let round = 0; round < 8; round += 1) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      return new Promise(resolve => {
        navigator.serviceWorker.onmessage = event => resolve(event.data);
        navigator.serviceWorker.controller.postMessage('count');
      });
    })()`);
    assert.equal(result, '1');
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('cross-origin iframe navigation leaves the originating ServiceWorker client set', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
    self.onmessage = async () => {
      const controlled = await self.clients.matchAll();
      const all = await self.clients.matchAll({ includeUncontrolled: true });
      self.postMessage(JSON.stringify([
        controlled.map(client => client.url),
        all.map(client => client.url),
      ]));
    };`);
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const result = await realm.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' });
      const frame = document.createElement('iframe');
      await new Promise(resolve => {
        frame.srcdoc = '<!doctype html><html><body>child</body></html>';
        frame.addEventListener('load', resolve, { once: true });
        document.body.appendChild(frame);
      });
      frame.removeAttribute('srcdoc');
      await new Promise(resolve => {
        frame.addEventListener('load', resolve, { once: true });
        frame.src = 'https://other.example.test/frame';
      });
      // 多轮让位：单轮 0ms 在高负载下不一定足够排完所有已入队回调
      for (let round = 0; round < 8; round += 1) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      const response = new Promise(resolve => {
        navigator.serviceWorker.onmessage = event => resolve(event.data);
      });
      navigator.serviceWorker.controller.postMessage('clients');
      return JSON.stringify([
        JSON.parse(await response),
        frame.contentDocument === null,
      ]);
    })()`);
    assert.deepEqual(JSON.parse(result), [[
      ['https://example.test/app/page'],
      ['https://example.test/app/page'],
    ], true]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('WindowClient navigate replaces iframe Realm while preserving client identity', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
    self.onmessage = async () => {
      const client = (await self.clients.matchAll({ windowType: 'nested' }))[0];
      const before = client.id;
      const next = await client.navigate('/app/replaced');
      const current = (await self.clients.matchAll({ windowType: 'nested' }))[0];
      self.postMessage(JSON.stringify([before, next.id, next.url, current.id]));
    };`);
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const result = await realm.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' });
      const frame = document.createElement('iframe');
      await new Promise(resolve => {
        frame.srcdoc = '<!doctype html><html><body>before</body></html>';
        frame.addEventListener('load', resolve, { once: true });
        document.body.appendChild(frame);
      });
      const oldWindow = frame.contentWindow;
      const response = new Promise(resolve => {
        navigator.serviceWorker.onmessage = event => resolve(event.data);
      });
      navigator.serviceWorker.controller.postMessage('navigate');
      const value = JSON.parse(await response);
      // 多轮让位：单轮 0ms 在高负载下不一定足够排完所有已入队回调
      for (let round = 0; round < 8; round += 1) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      return JSON.stringify([
        value,
        oldWindow !== frame.contentWindow,
        frame.contentDocument.URL,
      ]);
    })()`);
    const parsed = JSON.parse(result);
    assert.equal(parsed[0][0], parsed[0][1]);
    assert.equal(parsed[0][1], parsed[0][3]);
    assert.equal(parsed[0][2], 'https://example.test/app/replaced');
    assert.equal(parsed[1], true);
    assert.equal(parsed[2], 'https://example.test/app/replaced');
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('iframe replacement dispatches old Document pagehide and unload', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
    self.onmessage = async () => {
      const client = (await self.clients.matchAll({ windowType: 'nested' }))[0];
      await client.navigate('/app/lifecycle');
      self.postMessage('done');
    };`);
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const result = await realm.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' });
      const frame = document.createElement('iframe');
      await new Promise(resolve => {
        frame.srcdoc = '<!doctype html><html><body>before</body></html>';
        frame.addEventListener('load', resolve, { once: true });
        document.body.appendChild(frame);
      });
      const oldDocument = frame.contentDocument;
      // pagehide/unload 在 **window** 上派发。真实 Edge 实测（iframe 内导航）：
      //   ["window:beforeunload", "window:pagehide", "window:unload"]
      // document 监听器一个都不触发。
      const oldWindow = frame.contentWindow;
      oldDocument.__events = [];
      oldWindow.addEventListener('pagehide', () => oldDocument.__events.push('pagehide'));
      oldWindow.addEventListener('unload', () => oldDocument.__events.push('unload'));
      const response = new Promise(resolve => {
        navigator.serviceWorker.onmessage = event => resolve(event.data);
      });
      navigator.serviceWorker.controller.postMessage('navigate');
      await response;
      return JSON.stringify([
        oldDocument.__events,
        frame.contentDocument !== oldDocument,
      ]);
    })()`);
    assert.deepEqual(JSON.parse(result), [['pagehide', 'unload'], true]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('iframe WindowClient navigation uses ServiceWorker navigation response', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
    self.addEventListener('fetch', event => {
      if (event.request.url.endsWith('/app/sw-navigation')) {
        event.respondWith(new Response('<!doctype html><html><body><h1 id="served">intercepted</h1></body></html>'));
      }
    });
    self.onmessage = async () => {
      const client = (await self.clients.matchAll({ windowType: 'nested' }))[0];
      await client.navigate('/app/sw-navigation');
      self.postMessage('navigated');
    };`);
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const result = await realm.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' });
      const frame = document.createElement('iframe');
      await new Promise(resolve => {
        frame.srcdoc = '<!doctype html><html><body>before</body></html>';
        frame.addEventListener('load', resolve, { once: true });
        document.body.appendChild(frame);
      });
      const response = new Promise(resolve => {
        navigator.serviceWorker.onmessage = event => resolve(event.data);
      });
      navigator.serviceWorker.controller.postMessage('navigate');
      await response;
      // 多轮让位：单轮 0ms 在高负载下不一定足够排完所有已入队回调
      for (let round = 0; round < 8; round += 1) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      return JSON.stringify([
        frame.contentDocument.URL,
        frame.contentDocument.querySelector('#served')?.textContent ?? null,
      ]);
    })()`);
    assert.deepEqual(JSON.parse(result), [
      'https://example.test/app/sw-navigation',
      'intercepted',
    ]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('WindowClient navigate updates URL and clears out-of-scope controller', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
    self.onmessage = async () => {
      const clients = await self.clients.matchAll({ windowType: 'nested' });
      const client = await clients[0].navigate('/outside');
      self.postMessage(JSON.stringify([client.url, client.controlled]));
    };`);
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const result = await realm.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' });
      const frame = document.createElement('iframe');
      await new Promise(resolve => {
        frame.srcdoc = '<!doctype html><html><body>child</body></html>';
        frame.addEventListener('load', resolve, { once: true });
        document.body.appendChild(frame);
      });
      const response = new Promise(resolve => {
        navigator.serviceWorker.onmessage = event => resolve(event.data);
      });
      navigator.serviceWorker.controller.postMessage('navigate');
      const value = JSON.parse(await response);
      return JSON.stringify([
        value,
        frame.contentWindow.navigator.serviceWorker.controller === null,
      ]);
    })()`);
    assert.deepEqual(JSON.parse(result), [[
      'https://example.test/outside',
      false,
    ], true]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('beforeunload cancellation keeps the iframe Realm and WindowClient URL', async () => {
  const nv8 = await createRuntime(`self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
    self.onmessage = async () => {
      const [client] = await self.clients.matchAll({ windowType: 'nested' });
      const result = await client.navigate('/app/blocked');
      self.postMessage(JSON.stringify([result.url, result.controlled]));
    };`);
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/app/page' });
    const result = await realm.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' });
      const frame = document.createElement('iframe');
      await new Promise(resolve => {
        frame.srcdoc = '<!doctype html><html><body><main id="before">before</main></body></html>';
        frame.addEventListener('load', resolve, { once: true });
        document.body.appendChild(frame);
      });
      const oldWindow = frame.contentWindow;
      frame.contentWindow.addEventListener('beforeunload', event => event.preventDefault());
      const response = new Promise(resolve => {
        navigator.serviceWorker.onmessage = event => resolve(event.data);
      });
      navigator.serviceWorker.controller.postMessage('navigate');
      return JSON.stringify([
        JSON.parse(await response),
        oldWindow === frame.contentWindow,
        frame.contentDocument.querySelector('#before')?.textContent ?? null,
      ]);
    })()`);
    assert.deepEqual(JSON.parse(result), [[
      'https://example.test/app/page',
      true,
    ], true, 'before']);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
