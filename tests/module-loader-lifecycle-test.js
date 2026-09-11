import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';

import { RealmModuleLoader } from '../src/engine/realm/module-loader.js';

const MODULE_URL = new URL('../src/engine/realm/destroy-realm.js', import.meta.url);

test('RealmModuleLoader clears its per-Realm module cache on dispose', async () => {
  const loader = new RealmModuleLoader(vm.createContext({}));
  const first = await loader.importUrlAsync(MODULE_URL);
  const second = await loader.importUrlAsync(MODULE_URL);

  assert.equal(first, second);
  assert.deepEqual(loader.cacheStats(), {
    entries: 1,
    pending: 0,
    closed: false,
  });

  loader.dispose();

  assert.deepEqual(loader.cacheStats(), {
    entries: 0,
    pending: 0,
    closed: true,
  });
  await assert.rejects(
    () => loader.importUrlAsync(MODULE_URL),
    error => error.code === 'ERR_NV8_MODULE_EVALUATION_CANCELLED',
  );
});

test('RealmModuleLoader rejects synchronous access after disposal', () => {
  const loader = new RealmModuleLoader(vm.createContext({}));
  loader.dispose();

  assert.throws(
    () => loader.importUrlSyncCached(MODULE_URL),
    error => error.code === 'ERR_NV8_MODULE_EVALUATION_CANCELLED',
  );
});
