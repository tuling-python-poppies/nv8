import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';
import { storagePlugin } from '../src/plugins/storage/index.js';

test('Baseline Core isolates Realm storage and releases Realm handles', async () => {
  const nv8 = await createNv8({
    plugins: [...domPreset, storagePlugin],
    profile: { id: 'baseline-isolation', version: '1.0.0', name: 'Baseline Isolation', url: 'https://example.test/' },
    logger: { info() {}, warn() {}, error() {}, trace() {} },
  });
  let first;
  let second;
  try {
    first = await nv8.sandbox.createRealm({ type: 'root' });
    second = await nv8.sandbox.createRealm({ type: 'root' });
    first.evaluate("localStorage.setItem('isolated', 'first')");
    assert.equal(second.evaluate("localStorage.getItem('isolated')"), null);
    await nv8.sandbox.destroyRealm(first.id);
    first = null;
    assert.equal(nv8.sandbox.inspect().realms.length, 1);
    await nv8.sandbox.destroyRealm(second.id);
    second = null;
    assert.equal(nv8.sandbox.inspect().realms.length, 0);
  } finally {
    if (first) await nv8.sandbox.destroyRealm(first.id);
    if (second) await nv8.sandbox.destroyRealm(second.id);
    await nv8.destroy();
  }
});
