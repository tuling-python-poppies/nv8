import assert from 'node:assert/strict';
import test from 'node:test';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';

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
  test(`repeated reset does not accumulate Realm resources on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      page: { url: 'https://example.test/' },
      replay,
      limits: { timeoutMs: 3_000, maxRealms: 32 },
    });
    try {
      for (let index = 0; index < 4; index += 1) {
        const result = await sandbox.evaluate(`(() => {
          const worker = new Worker('/worker.js');
          const shared = new SharedWorker('/shared.js');
          const frame = document.createElement('iframe');
          frame.srcdoc = '<!doctype html><html><body>frame</body></html>';
          document.body.appendChild(frame);
          return ${index};
        })()`);
        assert.equal(result.value, index);
        await sandbox.setPage({
          url: `https://example.test/reset-${index}/`,
        });
        const resources = await sandbox.resources();
        assert.equal(resources.pendingRealmCreations, 0);
        assert.equal(resources.childRealms, 0);
        assert.equal(resources.sharedWorkerGraphs, 0);
        assert.equal(resources.root.workers, 0);
        assert.equal(resources.root.sharedWorkers, 0);
        assert.equal(resources.root.serviceWorkers, 0);
      }
    } finally {
      await sandbox.close();
    }
  });
}

for (const backend of ['child-process', 'worker-thread']) {
  test(`concurrent evaluation and reset cannot resurrect old resources on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      page: { url: 'https://example.test/' },
      replay,
      limits: { timeoutMs: 3_000, maxRealms: 32 },
    });
    try {
      const evaluation = sandbox.evaluate(`(() => {
        new Worker('/worker.js');
        new SharedWorker('/shared.js');
        const frame = document.createElement('iframe');
        frame.srcdoc = '<!doctype html><html><body>pending</body></html>';
        document.body.appendChild(frame);
        return 'started';
      })()`);
      const reset = sandbox.setPage({ url: 'https://example.test/concurrent/' });
      const outcomes = await Promise.allSettled([evaluation, reset]);
      assert.equal(outcomes[1].status, 'fulfilled');
      const resources = await sandbox.resources();
      assert.equal(resources.pendingRealmCreations, 0);
      assert.equal(resources.childRealms, 0);
      assert.equal(resources.sharedWorkerGraphs, 0);
      assert.equal(resources.root.workers, 0);
      assert.equal(resources.root.sharedWorkers, 0);
    } finally {
      await sandbox.close();
    }
  });
}
