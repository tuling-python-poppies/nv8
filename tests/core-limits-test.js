import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, minimalPreset } from '../src/index.js';

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
