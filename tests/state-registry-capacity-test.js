import test from 'node:test';
import assert from 'node:assert/strict';

import { createStateRegistry } from '../src/engine/core/state-registry.js';
import { createNv8, minimalPreset } from '../src/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

test('StateRegistry validates positive capacity limits', () => {
  for (const option of [
    { maxContexts: 0 },
    { maxKeysPerStore: 0 },
    { maxTotalKeys: 0 },
    { maxContexts: 1.5 },
  ]) {
    assert.throws(
      () => createStateRegistry(option),
      /must be a positive integer/,
    );
  }
});

test('StateRegistry bounds keys per store without rejecting overwrites', () => {
  const registry = createStateRegistry({ maxKeysPerStore: 1, maxTotalKeys: 4 });
  registry.set('one', 1, 'sandbox', 'sandbox-1');
  registry.set('one', 2, 'sandbox', 'sandbox-1');
  assert.equal(registry.get('one', 'sandbox', 'sandbox-1'), 2);
  assert.throws(
    () => registry.set('two', 2, 'sandbox', 'sandbox-1'),
    error => error.code === 'ERR_NV8_STATE_KEY_LIMIT' && error.scope === 'sandbox',
  );
  assert.deepEqual(registry.stats(), {
    sandboxKeys: 1,
    realmContexts: 0,
    realmKeys: 0,
    totalKeys: 1,
  });
});

test('StateRegistry enforces total keys across sandbox and Realm stores', () => {
  const registry = createStateRegistry({ maxContexts: 4, maxKeysPerStore: 4, maxTotalKeys: 2 });
  registry.set('sandbox-key', true, 'sandbox', 'sandbox-1');
  registry.set('realm-key', true, 'realm', 'realm-1');
  assert.throws(
    () => registry.set('another', true, 'realm', 'realm-2'),
    error => error.code === 'ERR_NV8_STATE_KEY_LIMIT',
  );
  assert.equal(registry.stats().realmContexts, 1);
  assert.equal(registry.stats().totalKeys, 2);
});

test('a rejected Realm insertion does not consume a context slot', () => {
  const registry = createStateRegistry({ maxContexts: 1, maxKeysPerStore: 1, maxTotalKeys: 1 });
  registry.set('first', true, 'sandbox', 'sandbox-1');
  assert.throws(() => registry.set('rejected', true, 'realm', 'realm-1'));
  registry.delete('first', 'sandbox', 'sandbox-1');
  registry.set('accepted', true, 'realm', 'realm-1');
  assert.equal(registry.stats().realmContexts, 1);
});

test('destroyRealm and clear reclaim empty Realm buckets', () => {
  const registry = createStateRegistry({ maxContexts: 1 });
  registry.set('key', true, 'realm', 'realm-1');
  assert.equal(registry.destroyRealm('realm-1'), true);
  assert.equal(registry.stats().realmContexts, 0);
  registry.set('key', true, 'realm', 'realm-2');
  registry.clear('realm', 'realm-2');
  assert.equal(registry.stats().realmContexts, 0);
  registry.set('key', true, 'realm', 'realm-3');
  assert.equal(registry.stats().realmContexts, 1);
});

test('clear all Realm state releases every context at once', () => {
  const registry = createStateRegistry({ maxContexts: 2 });
  registry.set('one', 1, 'realm', 'realm-1');
  registry.set('two', 2, 'realm', 'realm-2');
  registry.clear('realm');
  assert.deepEqual(registry.stats(), {
    sandboxKeys: 0,
    realmContexts: 0,
    realmKeys: 0,
    totalKeys: 0,
  });
});

test('capacity limits are exposed as immutable diagnostics', () => {
  const registry = createStateRegistry({ maxContexts: 3, maxKeysPerStore: 5, maxTotalKeys: 7 });
  const limits = registry.limits();
  assert.deepEqual(limits, { maxContexts: 3, maxKeysPerStore: 5, maxTotalKeys: 7 });
  assert.throws(() => { limits.maxContexts = 99; }, TypeError);
  assert.equal(registry.limits().maxContexts, 3);
});

test('createNv8 routes state capacity options into the Sandbox registry', async () => {
  const nv8 = await createNv8({
    plugins: minimalPreset,
    limits: {
      maxStateKeysPerStore: 1,
      maxStateTotalKeys: 1,
    },
    logger,
  });
  try {
    nv8.sandbox.setState('first', true);
    assert.throws(
      () => nv8.sandbox.setState('second', true),
      error => error.code === 'ERR_NV8_STATE_KEY_LIMIT',
    );
  } finally {
    await nv8.destroy();
  }
});
