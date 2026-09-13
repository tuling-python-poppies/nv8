/**
 * Gitee IKFD9X 回归：IndexedDB 升级事务 abort 与 deleteDatabase blocked。
 *
 * 1. `upgradeneeded` 里调用 `transaction.abort()` 后，版本号与 schema 必须回滚，
 *    open request 以 AbortError 结束；abort 之后的 createObjectStore 不得生效。
 * 2. 存在活动连接时 `deleteDatabase()` 先派发 versionchange + blocked，等连接
 *    全部关闭后才真正删除并 success。
 *
 * 这两个场景走 legacy bootstrap（IndexedDB 只在那里安装）。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

let sandboxPromise = null;

function sandbox() {
  sandboxPromise ??= (async () => {
    const { createSandbox } = await import('../src/public/create-sandbox.js');
    return createSandbox('https://idb.test/', {
      page: { html: '<!doctype html><html><head></head><body></body></html>' },
      limits: { timeoutMs: 30_000 },
    });
  })();
  return sandboxPromise;
}

async function evaluate(source) {
  const instance = await sandbox();
  const raw = await instance.run(source);
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

test.after(async () => {
  if (sandboxPromise === null) return;
  const instance = await sandboxPromise;
  await instance.close();
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  createSandbox.drain();
});

test('aborting an upgrade rolls back version and schema', async () => {
  const result = await evaluate(`(async () => {
    const openAborted = new Promise(resolve => {
      const request = indexedDB.open('idb-abort-new', 1);
      let lateStore = null;
      request.onupgradeneeded = event => {
        const database = event.target.result;
        database.createObjectStore('kept');
        event.target.transaction.abort();
        // abort 之后同一事件处理器里再次建表必须抛 InvalidStateError，
        // 且不能真的写进 schema。
        try {
          database.createObjectStore('late');
          lateStore = 'allowed';
        } catch (error) {
          lateStore = error.name;
        }
      };
      request.onsuccess = () => resolve('success');
      request.onerror = () => resolve('error:' + request.error.name);
    });
    const abortedOpen = await openAborted;
    const listedAfterAbort = (await indexedDB.databases())
      .some(entry => entry.name === 'idb-abort-new');
    // 全新库 abort 后应当不存在；再次 open 应重新触发 upgradeneeded
    const reopened = await new Promise(resolve => {
      const request = indexedDB.open('idb-abort-new');
      let upgraded = false;
      request.onupgradeneeded = event => {
        upgraded = true;
        event.target.result.createObjectStore('second');
      };
      request.onsuccess = () => {
        const database = request.result;
        const info = {
          upgraded,
          version: database.version,
          hasSecond: database.objectStoreNames.contains('second'),
        };
        database.close();
        resolve(info);
      };
      request.onerror = () => resolve({ error: request.error.name });
    });
    return JSON.stringify({ abortedOpen, listedAfterAbort, reopened });
  })()`);

  assert.equal(result.abortedOpen, 'error:AbortError', 'abort 后 open 必须报 AbortError');
  assert.equal(result.listedAfterAbort, false, 'abort 的新库不应出现在 databases()');
  assert.equal(result.reopened.upgraded, true, '重开应视为全新库');
  assert.equal(result.reopened.version, 1);
  assert.equal(result.reopened.hasSecond, true);
});

test('aborting an existing upgrade keeps the old version and stores', async () => {
  const result = await evaluate(`(async () => {
    await new Promise(resolve => {
      const request = indexedDB.open('idb-abort-existing', 1);
      request.onupgradeneeded = event => {
        event.target.result.createObjectStore('base');
      };
      request.onsuccess = () => {
        request.result.close();
        resolve();
      };
      request.onerror = () => resolve();
    });
    const aborted = await new Promise(resolve => {
      const request = indexedDB.open('idb-abort-existing', 2);
      request.onupgradeneeded = event => {
        const database = event.target.result;
        database.deleteObjectStore('base');
        database.createObjectStore('upgrade');
        event.target.transaction.abort();
      };
      request.onsuccess = () => resolve('success');
      request.onerror = () => resolve('error:' + request.error.name);
    });
    const check = await new Promise(resolve => {
      const request = indexedDB.open('idb-abort-existing');
      request.onsuccess = () => {
        const database = request.result;
        const info = {
          version: database.version,
          hasBase: database.objectStoreNames.contains('base'),
          hasUpgrade: database.objectStoreNames.contains('upgrade'),
        };
        database.close();
        resolve(info);
      };
      request.onerror = () => resolve({ error: request.error.name });
    });
    return JSON.stringify({ aborted, check });
  })()`);

  assert.equal(result.aborted, 'error:AbortError');
  assert.equal(result.check.version, 1, '版本必须回滚到 1');
  assert.equal(result.check.hasBase, true, '被 deleteObjectStore 删掉的原表必须回来');
  assert.equal(result.check.hasUpgrade, false, '升级中新建的表必须回滚');
});

test('IDB request on* handlers register at assignment position', async () => {
  const result = await evaluate(`(async () => {
    const firstOrder = [];
    await new Promise(resolve => {
      let hits = 0;
      const done = () => { if ((hits += 1) === 2) resolve(); };
      const request = indexedDB.open('idb-handler-order', 1);
      request.onupgradeneeded = event => {
        event.target.result.createObjectStore('s');
      };
      // 先 on*、后 addEventListener，再重新赋 on*：代理位置必须保持，
      // 触发顺序是 on*（位置 0）→ addEventListener（位置 1）。
      request.onsuccess = () => { firstOrder.push('on'); request.result.close(); done(); };
      request.addEventListener('success', () => { firstOrder.push('add'); done(); });
      request.onsuccess = () => { firstOrder.push('on2'); request.result.close(); done(); };
    });

    const secondOrder = [];
    await new Promise(resolve => {
      let hits = 0;
      const done = () => { if ((hits += 1) === 2) resolve(); };
      const request = indexedDB.open('idb-handler-order-2', 1);
      request.onupgradeneeded = event => {
        event.target.result.createObjectStore('s');
      };
      // 先 addEventListener 后 on*：on* 在赋值时才注册，位置在后。
      request.addEventListener('success', () => { secondOrder.push('add'); done(); });
      request.onsuccess = () => { secondOrder.push('on'); request.result.close(); done(); };
    });

    return JSON.stringify({ firstOrder, secondOrder });
  })()`);

  assert.deepEqual(result.firstOrder, ['on2', 'add'], 'on* 重新赋值不改变注册位置');
  assert.deepEqual(result.secondOrder, ['add', 'on'], 'on* 在赋值时注册，顺序按赋值先后');
});

test('deleteDatabase fires blocked while a connection stays open', async () => {
  const result = await evaluate(`(async () => {
    const database = await new Promise(resolve => {
      const request = indexedDB.open('idb-delete', 1);
      request.onupgradeneeded = event => {
        event.target.result.createObjectStore('s');
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
    const order = [];
    const versionChanges = [];
    database.onversionchange = event => {
      versionChanges.push([event.oldVersion, event.newVersion]);
    };
    const deletion = indexedDB.deleteDatabase('idb-delete');
    deletion.onblocked = () => order.push('blocked');
    deletion.onsuccess = () => order.push('success');
    deletion.onerror = () => order.push('error:' + deletion.error.name);
    // delete 的实现会先排一个微任务再派发 versionchange/blocked
    await Promise.resolve();
    await Promise.resolve();
    const blockedBeforeClose = [...order];
    const listedWhileBlocked = (await indexedDB.databases())
      .some(entry => entry.name === 'idb-delete');
    database.close();
    await Promise.resolve();
    await Promise.resolve();
    const listedAfterClose = (await indexedDB.databases())
      .some(entry => entry.name === 'idb-delete');
    return JSON.stringify({
      blockedBeforeClose,
      versionChanges,
      listedWhileBlocked,
      listedAfterClose,
      order,
    });
  })()`);

  assert.deepEqual(result.blockedBeforeClose, ['blocked'], '连接未关闭时必须只 blocked');
  assert.deepEqual(result.versionChanges, [[1, null]], '连接必须收到 versionchange（newVersion=null）');
  assert.equal(result.listedWhileBlocked, true, 'blocked 期间数据库仍存在');
  assert.deepEqual(result.order, ['blocked', 'success'], '关闭连接后删除完成');
  assert.equal(result.listedAfterClose, false, '删除后 databases() 不再列出');
});
