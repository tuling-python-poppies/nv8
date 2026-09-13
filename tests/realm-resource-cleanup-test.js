import assert from 'node:assert/strict';
import test from 'node:test';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';
import { waitUntil } from './helpers/async-wait.js';

const replay = [
  {
    method: 'GET',
    url: 'https://example.test/worker.js',
    repeat: 'unlimited',
    body: 'self.onmessage = event => self.postMessage(event.data);',
  },
  {
    method: 'GET',
    url: 'https://example.test/shared.js',
    repeat: 'unlimited',
    body: 'self.onconnect = event => event.ports[0].start();',
  },
];

for (const backend of ['child-process', 'worker-thread']) {
  test(`Realm resources are released on reset for ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      limits: { timeoutMs: 3_000 },
      page: { url: 'https://example.test/' },
      replay,
    });
    try {
      // 只负责创建资源，不赌它们何时注册完成；注册完成由宿主侧轮询正向信号。
      const result = await sandbox.evaluate(`(() => {
        const worker = new Worker('/worker.js');
        const shared = new SharedWorker('/shared.js');
        const frame = document.createElement('iframe');
        frame.srcdoc = '<!doctype html><html><body>frame</body></html>';
        document.body.appendChild(frame);
        return 'ready';
      })()`);
      assert.equal(result.value, 'ready');
      await waitUntil(async () => {
        const resources = await sandbox.resources();
        return resources.childRealms >= 1
          && resources.root.workers >= 1
          && resources.root.sharedWorkers >= 1;
      }, { label: 'worker, shared worker and iframe resources registered' });
      const before = await sandbox.resources();
      assert.ok(before.childRealms >= 1);
      assert.ok(before.root.workers >= 1);
      assert.ok(before.root.sharedWorkers >= 1);

      await sandbox.setPage({ url: 'https://example.test/clean/' });
      const after = await sandbox.resources();
      assert.equal(after.childRealms, 0);
      assert.equal(after.sharedWorkerGraphs, 0);
      assert.equal(after.root.workers, 0);
      assert.equal(after.root.sharedWorkers, 0);
      assert.equal(after.root.serviceWorkers, 0);
    } finally {
      await sandbox.close();
    }
  });
}
