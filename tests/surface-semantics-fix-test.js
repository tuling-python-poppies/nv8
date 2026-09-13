/**
 * Gitee IKFDA6 回归（消息 / Observer / live collection / history）。
 *
 * - `window.onmessage` 赋值即注册监听器，与 addEventListener 按注册顺序触发
 * - `MutationObserver.disconnect()` 后不再收到回调，内部注册表立即收缩
 * - live collection 用 WeakRef 跟踪（计数接口 + 可选 GC 断言）
 * - history 超过 50 条时从最旧一端裁剪
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { createNv8, domPreset } from '../src/index.js';
import { windowPlugin } from '../src/plugins/window/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { historyPlugin } from '../src/plugins/history/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

const MUTATION_STATE_URL = new URL(
  '../src/surface/api/dom/mutation-observer-state.js',
  import.meta.url,
);
const COLLECTION_STATE_URL = new URL(
  '../src/surface/api/dom/html-collection-state.js',
  import.meta.url,
);

async function withRealm(callback) {
  const nv8 = await createNv8({
    plugins: [...domPreset, windowPlugin, messagingPlugin, historyPlugin],
    profile: { id: 'surface-semantics', url: 'https://semantics.test/' },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    try {
      return await callback(realm);
    } finally {
      await nv8.sandbox.destroyRealm(realm.id);
    }
  } finally {
    await nv8.destroy();
  }
}

function realmNamespace(realm, url) {
  const namespace = realm.moduleLoader?.importUrlSyncCached(url)?.namespace;
  assert.ok(namespace, 'realm module namespace: ' + url.href);
  return namespace;
}

test('window.onmessage is registered at assignment time', async () => {
  const order = JSON.parse(await withRealm(realm => realm.evaluate(`(async () => {
    const log = [];
    const addFirst = () => log.push('add');
    addEventListener('message', addFirst);
    window.onmessage = () => log.push('on');
    window.postMessage('a');
    await Promise.resolve();
    await Promise.resolve();

    removeEventListener('message', addFirst);
    window.onmessage = null;
    window.onmessage = () => log.push('on2');
    addEventListener('message', () => log.push('add2'));
    window.postMessage('b');
    await Promise.resolve();
    await Promise.resolve();
    return JSON.stringify(log);
  })()`)));
  assert.deepEqual(
    order,
    ['add', 'on', 'on2', 'add2'],
    'onmessage 必须在赋值时注册，且重新赋值保持位置',
  );
});

test('MutationObserver stops firing and drops out of the registry on disconnect', async () => {
  await withRealm(async realm => {
    const namespace = realmNamespace(realm, MUTATION_STATE_URL);
    const result = JSON.parse(await realm.evaluate(`(async () => {
      const target = document.createElement('div');
      let hits = 0;
      const observer = new MutationObserver(() => { hits += 1; });
      observer.observe(target, { childList: true });
      target.appendChild(document.createElement('span'));
      await Promise.resolve();
      await Promise.resolve();
      const afterFirst = hits;
      observer.disconnect();
      target.appendChild(document.createElement('span'));
      await Promise.resolve();
      await Promise.resolve();
      return JSON.stringify({ afterFirst, afterDisconnect: hits });
    })()`));
    assert.equal(result.afterFirst, 1, '注册后应收到一次回调');
    assert.equal(result.afterDisconnect, 1, 'disconnect 后不得再收到回调');
    const count = namespace.liveMutationObserverCount();
    assert.equal(typeof count, 'number');
  });
});

test('disconnect removes the observer from the live registry immediately', async () => {
  await withRealm(realm => {
    const namespace = realmNamespace(realm, MUTATION_STATE_URL);
    const before = namespace.liveMutationObserverCount();
    const after = realm.evaluate(`(() => {
      const observers = [];
      for (let index = 0; index < 3; index += 1) {
        const observer = new MutationObserver(() => {});
        observer.observe(document.createElement('div'), { childList: true });
        observers.push(observer);
      }
      observers[0].disconnect();
      return observers.length;
    })()`);
    assert.equal(after, 3);
    assert.equal(
      namespace.liveMutationObserverCount(),
      before + 2,
      'disconnect 掉的 observer 必须立即移出注册表',
    );
  });
});

test('live collections are tracked via WeakRef and pruned when collected', async () => {
  const result = await withRealm(async realm => {
    const namespace = realmNamespace(realm, COLLECTION_STATE_URL);
    const before = namespace.liveHTMLCollectionCount();
    // 集合强引用挂在 realm 的 globalThis 上：WeakRef 只跟踪，不阻止回收，
    // 强引用必须由测试自己保持，否则 200 个集合可能在断言前就被 GC。
    const tracked = await realm.evaluate(`(() => {
      window.__trackedCollections = [];
      const root = document.createElement('div');
      document.body.appendChild(root);
      // 每个唯一的 class key 创建一个独立 live collection
      for (let index = 0; index < 200; index += 1) {
        window.__trackedCollections.push(
          root.getElementsByClassName('churn-' + index),
        );
      }
      return window.__trackedCollections.length;
    })()`);
    assert.equal(tracked, 200);
    const registered = namespace.liveHTMLCollectionCount();
    // append 根元素本身会顺带创建一个 children 集合，所以是「至少 200 个新增」
    assert.ok(
      registered - before >= 200,
      `200 个集合都应被跟踪（新增 ${registered - before}）`,
    );

    // 释放强引用（集合被元素上的缓存 WeakMap 引用，元素也要从 DOM 摘掉），
    // 验证 WeakRef 注册表在回收后收缩（需要 --expose-gc）。
    realm.evaluate(`(() => {
      window.__trackedCollections.length = 0;
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
    })()`);
    if (typeof global.gc === 'function') {
      global.gc();
      await new Promise(resolve => setImmediate(resolve));
      assert.ok(
        namespace.liveHTMLCollectionCount() < registered,
        'GC 后失活集合必须从注册表移除',
      );
      return { gc: true };
    }
    return { gc: false };
  });
  assert.equal(typeof result.gc, 'boolean');
});

test('history is capped at 50 entries and stays consistent after go()', async () => {
  const result = JSON.parse(await withRealm(realm => realm.evaluate(`(() => {
    for (let index = 0; index < 120; index += 1) {
      history.pushState(index, '', '/page-' + index);
    }
    const length = history.length;
    const current = history.state;
    history.go(-10);
    return JSON.stringify({ length, current, afterGo: history.state });
  })()`)));
  assert.equal(result.length, 50, 'history.length 必须是 50');
  assert.equal(result.current, 119, '当前条目是最新一条');
  assert.equal(result.afterGo, 109, 'go(-10) 必须落在保留窗口内');
});
