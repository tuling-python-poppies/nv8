import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
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

for (const backend of ['child-process', 'worker-thread']) {
  test(`Worker connection limit is enforced and accounted on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      limits: { timeoutMs: 3_000, maxWorkerConnections: 1 },
    });
    try {
      const result = await sandbox.evaluate(`new Promise(resolve => {
        const first = new Worker('data:text/javascript,');
        const second = new Worker('data:text/javascript,');
        second.onerror = event => resolve(event.error?.code || event.error?.name);
        first.onerror = event => resolve(event.error?.code || event.error?.name);
      })`);
      assert.equal(result.type, 'string');
      assert.equal(result.value, 'LIMIT_WORKER_CONNECTIONS');
      const resources = await sandbox.resources();
      assert.equal(resources.workerConnections, 1);
    } finally {
      await sandbox.close();
    }
  });

  test(`Worker realm limit is enforced on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      limits: { timeoutMs: 3_000, maxWorkerRealms: 1 },
    });
    try {
      const result = await sandbox.evaluate(`new Promise(resolve => {
        const first = new Worker('data:text/javascript,');
        const second = new Worker('data:text/javascript,');
        second.onerror = event => resolve(event.error?.code || event.error?.name);
        first.onerror = event => resolve(event.error?.code || event.error?.name);
      })`);
      assert.equal(result.type, 'string');
      assert.equal(result.value, 'LIMIT_WORKER_REALMS');
    } finally {
      await sandbox.close();
    }
  });

  test(`nested Worker depth limit is enforced on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      limits: { timeoutMs: 3_000, maxWorkerDepth: 1 },
    });
    try {
      const nestedSource = Buffer.from(
        "const child = new Worker('data:text/javascript,');"
        + "child.onerror = event => postMessage(event.error?.code || event.error?.name);",
      ).toString('base64');
      const result = await sandbox.evaluate(`new Promise(resolve => {
        const worker = new Worker('data:text/javascript;base64,${nestedSource}');
        worker.onmessage = event => resolve(event.data);
        worker.onerror = event => resolve(event.error?.code || event.error?.name);
      })`);
      assert.equal(result.type, 'string');
      assert.equal(result.value, 'LIMIT_WORKER_DEPTH');
    } finally {
      await sandbox.close();
    }
  });
}
