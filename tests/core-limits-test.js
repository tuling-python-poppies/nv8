import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, minimalPreset } from '../src/index.js';
import { eventsPlugin } from '../src/plugins/events/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { workerPlugin } from '../src/plugins/worker/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

test('Core enforces Realm capacity and records lifecycle events', async () => {
  const nv8 = await createNv8({
    plugins: minimalPreset,
    limits: { maxRealms: 1, timeoutMs: 25, maxLifecycleEntries: 8 },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    await assert.rejects(
      () => nv8.sandbox.createRealm({ type: 'root' }),
      error => error.code === 'LIMIT_REALM_CAPACITY' && error.limit === 1,
    );
    const diagnosis = nv8.sandbox.diagnose();
    assert.equal(diagnosis.limits.maxRealms, 1);
    assert.ok(diagnosis.lifecycle.some(event => event.name === 'realm.created'));
    await nv8.sandbox.destroyRealm(realm.id);
    assert.ok(nv8.sandbox.diagnose().lifecycle.some(
      event => event.name === 'realm.dispose.completed',
    ));
  } finally {
    await nv8.destroy();
  }
});

test('Plugin Sandbox enforces Worker connection limits and cleans up', async () => {
  const nv8 = await createNv8({
    runtimeMode: 'plugin',
    plugins: [...minimalPreset, eventsPlugin, messagingPlugin, workerPlugin],
    limits: { maxWorkerConnections: 1, timeoutMs: 3_000 },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = await realm.evaluate(`new Promise(resolve => {
      const first = new Worker('data:text/javascript,');
      const second = new Worker('data:text/javascript,');
      second.onerror = event => resolve(event.error?.code || event.error?.name);
    })`);
    assert.equal(result, 'LIMIT_WORKER_CONNECTIONS');
    assert.equal(nv8.sandbox.diagnose().workerConnections, 1);
    await nv8.sandbox.reset();
    assert.equal(nv8.sandbox.diagnose().workerConnections, 0);
    assert.equal(nv8.sandbox.diagnose().workerRealms, 0);
  } finally {
    await nv8.destroy();
  }
});

test('Core Realm evaluate uses the configured timeout', async () => {
  const nv8 = await createNv8({
    plugins: minimalPreset,
    limits: { timeoutMs: 5 },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    assert.throws(
      () => realm.evaluate('while (true) {}'),
      error => error.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT'
        || /Script execution timed out/.test(error.message),
    );
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
