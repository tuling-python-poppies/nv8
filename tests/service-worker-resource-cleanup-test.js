import assert from 'node:assert/strict';
import test from 'node:test';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';

for (const backend of ['child-process', 'worker-thread']) {
  test(`ServiceWorker registrations are released on reset for ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      page: { url: 'https://example.test/' },
      replay: [{
        method: 'GET',
        url: 'https://example.test/sw.js',
        repeat: 'unlimited',
        body: 'self.addEventListener("install", event => event.waitUntil(self.skipWaiting())); self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));',
      }],
      limits: { timeoutMs: 3_000 },
    });
    try {
      const result = await sandbox.evaluate(`navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      }).then(() => 'registered')`);
      assert.equal(result.value, 'registered');
      const before = await sandbox.resources();
      assert.equal(before.root.serviceWorkers, 1);
      await sandbox.setPage({ url: 'https://example.test/clean/' });
      const after = await sandbox.resources();
      assert.equal(after.root.serviceWorkers, 0);
    } finally {
      await sandbox.close();
    }
  });
}
