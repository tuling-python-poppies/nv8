import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8 } from '../src/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };
function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

test('parallel root creation cannot exceed maxRealms', async () => {
  const instance = await createNv8({ plugins: [], logger, limits: { maxRealms: 1 } });
  try {
    const results = await Promise.allSettled([instance.sandbox.createRealm(), instance.sandbox.createRealm()]);
    assert.deepEqual(results.map(r => r.status), ['fulfilled', 'rejected']);
    assert.equal(results[1].reason.code, 'LIMIT_REALM_CAPACITY');
    assert.equal(instance.sandbox.getAllRealms().length, 1);
    assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
    await instance.sandbox.destroyRealm(results[0].value.id);
    await instance.sandbox.createRealm();
    assert.equal(instance.sandbox.getAllRealms().length, 1);
  } finally { await instance.destroy(); }
});

test('invalid URL and activation failure both release reserved capacity', async () => {
  let fail = true;
  const instance = await createNv8({ logger, limits: { maxRealms: 1 }, plugins: [{
    id: 'creation-reservation-probe', version: '1.0.0', install() {},
    activate() { if (fail) throw new Error('intentional activation failure'); },
  }] });
  try {
    await assert.rejects(instance.sandbox.createRealm({ pageUrl: ':invalid-url' }));
    assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
    await assert.rejects(instance.sandbox.createRealm(), /intentional activation failure/);
    assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
    fail = false;
    const realm = await instance.sandbox.createRealm();
    assert.equal(realm.evaluate('42'), 42);
    assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
  } finally { await instance.destroy(); }
});

for (const operation of ['reset', 'destroy']) {
  test(`in-flight creation releases its reservation after ${operation}`, { timeout: 10000 }, async () => {
    const entered = deferred();
    const release = deferred();
    let disposals = 0;
    const instance = await createNv8({ logger, limits: { maxRealms: 1 }, plugins: [{
      id: 'pending-reservation-probe', version: '1.0.0', install() {},
      async activate() { entered.resolve(); await release.promise; },
      dispose() { disposals += 1; },
    }] });
    const pending = instance.sandbox.createRealm();
    const cancelled = assert.rejects(pending, e => e.code === 'ERR_NV8_REALM_LIFECYCLE');
    try {
      await entered.promise;
      assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 1);
      await assert.rejects(instance.sandbox.createRealm(), e => e.code === 'LIMIT_REALM_CAPACITY');
      await instance.sandbox[operation]();
      release.resolve();
      await cancelled;
      assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
      assert.equal(instance.sandbox.getAllRealms().length, 0);
      assert.equal(disposals, 1);
      if (operation === 'reset') {
        const realm = await instance.sandbox.createRealm();
        assert.equal(realm.evaluate('21*2'), 42);
      }
    } finally {
      release.resolve();
      await cancelled;
      await instance.destroy();
    }
  });
}
