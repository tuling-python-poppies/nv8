import assert from 'node:assert/strict';
import test from 'node:test';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';
import { waitUntil } from './helpers/async-wait.js';

const replay = [
  {
    method: 'GET',
    url: 'https://example.test/shared.js',
    repeat: 'unlimited',
    body: 'self.onconnect = event => event.ports[0].start();',
  },
  {
    method: 'GET',
    url: 'https://example.test/sw.js',
    repeat: 'unlimited',
    body: 'self.addEventListener("install", event => event.waitUntil(self.skipWaiting())); self.addEventListener("activate", event => event.waitUntil(self.clients.claim())); self.onmessage = event => event.source?.postMessage("ok");',
  },
];

for (const backend of ['child-process', 'worker-thread']) {
  test(`SharedWorker multi-owner graph is released on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      page: { url: 'https://example.test/' },
      replay,
      limits: { timeoutMs: 10_000, maxRealms: 32 },
    });
    try {
      // 子帧里再构造一个同名 SharedWorker 后立即收口；是否形成多 owner 图
      // 由宿主侧轮询 resources() 的正向信号确认。
      const result = await sandbox.evaluate(`new Promise(resolve => {
        const first = new SharedWorker('/shared.js', { name: 'shared-owner' });
        const frame = document.createElement('iframe');
        frame.srcdoc = '<!doctype html><html><body></body></html>';
        frame.addEventListener('load', () => {
          frame.contentWindow.owner = new SharedWorker('/shared.js', { name: 'shared-owner' });
          resolve('connected');
        });
        document.body.appendChild(frame);
      })`);
      assert.equal(result.value, 'connected');
      await waitUntil(async () => {
        const resources = await sandbox.resources();
        return resources.sharedWorkerGraphs === 1 && resources.childRealms >= 1;
      }, { label: 'SharedWorker multi-owner graph registration' });
      const before = await sandbox.resources();
      assert.equal(before.sharedWorkerGraphs, 1);
      assert.ok(before.childRealms >= 1);
      await sandbox.setPage({ url: 'https://example.test/after/' });
      const after = await sandbox.resources();
      assert.equal(after.sharedWorkerGraphs, 0);
      assert.equal(after.childRealms, 0);
      assert.equal(after.pendingRealmCreations, 0);
    } finally {
      await sandbox.close();
    }
  });
}

for (const backend of ['child-process', 'worker-thread']) {
  test(`controlled root and iframe clients are cleared on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      page: { url: 'https://example.test/' },
      replay,
      limits: { timeoutMs: 10_000, maxRealms: 32 },
    });
    try {
      const result = await sandbox.evaluate(`navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(() => 'registered')`);
      assert.equal(result.value, 'registered');
      const frame = await sandbox.evaluate(`new Promise(resolve => {
        const frame = document.createElement('iframe');
        frame.srcdoc = '<!doctype html><html><body>child</body></html>';
        frame.addEventListener('load', () => resolve('loaded'));
        document.body.appendChild(frame);
      })`);
      assert.equal(frame.value, 'loaded');
      const before = await sandbox.resources();
      assert.equal(before.root.serviceWorkers, 1);
      await sandbox.setPage({ url: 'https://example.test/after/' });
      const after = await sandbox.resources();
      assert.equal(after.root.serviceWorkers, 0);
      assert.equal(after.childRealms, 0);
    } finally {
      await sandbox.close();
    }
  });
}
