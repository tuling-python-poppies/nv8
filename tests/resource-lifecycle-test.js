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

for (const backend of ['child-process', 'worker-thread']) {
  test(`failed Worker construction releases its resource record on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      page: { url: 'https://example.test/' },
      limits: { timeoutMs: 3_000 },
    });
    try {
      const result = await sandbox.evaluate(`new Promise(resolve => {
        const worker = new Worker('/missing-worker.js');
        worker.onerror = event => resolve(
          (event.error?.name ?? 'unknown') + ':' + (event.message ?? ''),
        );
      })`);
      assert.equal(result.type, 'string');
      assert.match(result.value, /^TypeError:/);
      const resources = await sandbox.resources();
      assert.equal(resources.root.workers, 0);
      assert.equal(resources.childRealms, 0);
    } finally {
      await sandbox.close();
    }
  });
}

for (const backend of ['child-process', 'worker-thread']) {
  test(`failed SharedWorker construction releases its graph on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      page: { url: 'https://example.test/' },
      limits: { timeoutMs: 3_000 },
    });
    try {
      const result = await sandbox.evaluate(`new Promise(resolve => {
        const worker = new SharedWorker('/missing-shared-worker.js');
        worker.onerror = event => resolve(
          (event.error?.name ?? 'unknown') + ':' + (event.message ?? ''),
        );
      })`);
      assert.equal(result.type, 'string');
      assert.match(result.value, /^TypeError:/);
      const resources = await sandbox.resources();
      assert.equal(resources.root.sharedWorkers, 0);
      assert.equal(resources.sharedWorkerGraphs, 0);
      assert.equal(resources.childRealms, 0);
    } finally {
      await sandbox.close();
    }
  });
}

for (const backend of ['child-process', 'worker-thread']) {
  test(`failed ServiceWorker registration releases its Realm on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      page: { url: 'https://example.test/' },
      limits: { timeoutMs: 3_000 },
    });
    try {
      const result = await sandbox.evaluate(`navigator.serviceWorker.register('/missing-service-worker.js')
        .then(() => 'resolved', error => error.name)`);
      assert.equal(result.type, 'string');
      assert.equal(result.value, 'TypeError');
      const resources = await sandbox.resources();
      assert.equal(resources.root.serviceWorkers, 0);
      assert.equal(resources.childRealms, 0);
      const registrations = await sandbox.evaluate(
        'navigator.serviceWorker.getRegistrations().then(values => values.length)',
      );
      assert.equal(registrations.type, 'number');
      assert.equal(registrations.value, 0);
    } finally {
      await sandbox.close();
    }
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
