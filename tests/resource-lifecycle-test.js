import assert from 'node:assert/strict';
import test from 'node:test';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';

for (const backend of ['child-process', 'worker-thread']) {
  test(`timeout terminates ${backend} and close remains idempotent`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      limits: { timeoutMs: 25 },
    });
    await assert.rejects(
      () => sandbox.evaluate('while (true) {}'),
      error => error.code === 'ERR_EDGE_SANDBOX_TIMEOUT',
    );
    const connection = sandbox.controller.connection;
    assert.equal(backend === 'child-process' ? connection.child : connection.worker, null);
    await sandbox.close();
    await sandbox.close();
  });
}

for (const [backend, limits, expectedCode] of [
  ['child-process', { maxHeapBytes: 64 * 1024 * 1024 }, 'LIMIT_HEAP_BYTES'],
  ['worker-thread', { maxRealms: 1 }, 'LIMIT_REALM_CAPACITY'],
]) {
  test(`realm guard returns a structured error on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      limits,
    });
    try {
      const result = await sandbox.evaluate(`new Promise(resolve => {
        const worker = new Worker(
          'data:text/javascript,self.onmessage=()=>{}',
        );
        worker.onerror = event => resolve(event.error?.code || event.error?.name);
      })`);
      assert.equal(result.type, 'string');
      assert.equal(result.value, expectedCode);
    } finally {
      await sandbox.close();
    }
  });
}
