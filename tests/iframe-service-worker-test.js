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

test('iframe receives the active ServiceWorker controller for its matching scope', async () => {
  const nv8 = await createNv8({
    plugins,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/app/page' },
    replay: [{
      method: 'GET',
      url: 'https://example.test/sw.js',
      repeat: 'unlimited',
      body: 'self.addEventListener("install", event => event.waitUntil(self.skipWaiting())); self.addEventListener("activate", event => event.waitUntil(self.clients.claim())); self.onmessage = async event => { const clients = await self.clients.matchAll(); self.postMessage("sw:" + event.data + ":" + clients.length); };',
    }],
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({
      type: 'root',
      pageUrl: 'https://example.test/app/page',
    });
    const result = await realm.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' });
      const parentController = navigator.serviceWorker.controller !== null;
      const message = await new Promise(resolve => {
        navigator.serviceWorker.onmessage = event => resolve(event.data);
        navigator.serviceWorker.controller.postMessage('clients');
      });
      const child = await new Promise(resolve => {
        const frame = document.createElement('iframe');
        frame.addEventListener('load', () => resolve(frame.contentWindow), { once: true });
        frame.addEventListener('error', event => resolve({ error: event.error?.message ?? event.message ?? 'iframe error' }), { once: true });
        frame.srcdoc = '<!doctype html><html><body>child</body></html>';
        document.body.appendChild(frame);
      });
      if (child?.error) return JSON.stringify(child);
      return JSON.stringify([
        parentController,
        message,
        child.navigator.serviceWorker.controller !== null,
        child.navigator.serviceWorker.controller?.scriptURL ?? null,
        child.navigator.serviceWorker.controller?.state ?? null,
      ]);
    })()`);
    assert.deepEqual(JSON.parse(result), [
      true,
      'sw:clients:1',
      true,
      'https://example.test/sw.js',
      'activated',
    ]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
