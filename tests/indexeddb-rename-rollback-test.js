import test from 'node:test';
import assert from 'node:assert/strict';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';
import { drainWorkerThreadPool } from '../src/backend/controller/worker-thread-pool.js';

for (const backend of ['child-process', 'worker-thread']) {
  test(`aborted renames restore metadata, aliases and the next upgrade (${backend})`, { timeout: 20000 }, async () => {
    const sandbox = await EdgeSandbox.create({ execution: { backend }, page: { url: 'https://idb.test/' }, limits: { timeoutMs: 15000 } });
    try {
      const result = await sandbox.evaluate(`(async () => {
        const requestResult = request => new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        const open = (version, upgrade) => {
          const request = indexedDB.open('rename-rollback', version);
          request.onupgradeneeded = () => upgrade(request.result, request.transaction);
          return requestResult(request);
        };
        let db = await open(1, db => {
          db.createObjectStore('original').createIndex('original-index', 'x');
        });
        await requestResult(db.transaction('original', 'readwrite').objectStore('original').put({x:'saved'}, 1));
        db.close();
        let heldStore, aliasStore, heldIndex, aliasIndex, during;
        const aborted = await open(2, (db, transaction) => {
          heldStore = transaction.objectStore('original');
          aliasStore = transaction.objectStore('original');
          heldIndex = heldStore.index('original-index');
          aliasIndex = aliasStore.index('original-index');
          heldStore.name = 'intermediate';
          aliasStore.name = 'renamed';
          heldIndex.name = 'intermediate-index';
          aliasIndex.name = 'renamed-index';
          during = [heldStore.name, aliasStore.name, heldIndex.name, aliasIndex.name];
          // 重用旧名字并建新表/索引后也必须回到原对象，不能只把名字列表改回来。
          db.createObjectStore('original');
          heldStore.createIndex('original-index', 'different');
          transaction.abort();
        }).then(() => 'unexpected-success', error => error.name);
        const heldAfter = [heldStore.name, aliasStore.name, heldIndex.name, aliasIndex.name];
        db = await open(1, () => {});
        const store = db.transaction('original').objectStore('original');
        const index = store.index('original-index');
        const reopened = {version:db.version, stores:[...db.objectStoreNames], name:store.name,
          indexName:index.name, keyPath:index.keyPath, indexes:[...store.indexNames],
          value:await requestResult(store.get(1))};
        db.close();
        db = await open(2, (db, transaction) => {
          const store = transaction.objectStore('original');
          store.name = 'committed';
          store.index('original-index').name = 'committed-index';
        });
        const committedStore = db.transaction('committed').objectStore('committed');
        const committed = {version:db.version, stores:[...db.objectStoreNames], name:committedStore.name,
          indexName:committedStore.index('committed-index').name};
        db.close();
        return JSON.stringify({aborted, during, heldAfter, reopened, committed});
      })()`);
      const value = JSON.parse(result.value);
      assert.equal(value.aborted, 'AbortError');
      assert.deepEqual(value.during, ['renamed', 'renamed', 'renamed-index', 'renamed-index']);
      assert.deepEqual(value.heldAfter, ['original', 'original', 'original-index', 'original-index']);
      assert.deepEqual(value.reopened, {version:1, stores:['original'], name:'original', indexName:'original-index', keyPath:'x', indexes:['original-index'], value:{x:'saved'}});
      assert.deepEqual(value.committed, {version:2, stores:['committed'], name:'committed', indexName:'committed-index'});
    } finally { await sandbox.close(); drainWorkerThreadPool(); }
  });
}
