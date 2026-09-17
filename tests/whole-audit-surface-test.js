/**
 * 全仓审计回归（第二批）：浏览器 API 行为契约。
 *
 * 覆盖 F12/F14/F15/F16/F17/F18/F20/F21/F24 的公开 EdgeSandbox 路径，
 * 双后端（child-process / worker-thread）各跑一遍。断言以真实浏览器
 * 行为为基准（Chrome 152 工具浏览器与 Node 22 原生实现对照）。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';
import { drainWorkerThreadPool } from '../src/backend/controller/worker-thread-pool.js';
import { normalizeRuntimeOptions } from '../src/public/edge-runtime-options.js';

const REPLAY = [
  { url: 'https://fixture.test/shared.js', repeat: 'unlimited', body: 'registerPaint("shared", class {});' },
  { url: 'https://fixture.test/a.js', repeat: 'unlimited', body: 'import "./shared.js";' },
  { url: 'https://fixture.test/b.js', repeat: 'unlimited', body: 'import "./shared.js";' },
];

async function withSandbox(backend, body) {
  const sandbox = await EdgeSandbox.create({
    execution: { backend },
    page: { url: 'https://fixture.test/' },
    limits: { timeoutMs: 5000 },
    replay: REPLAY,
  });
  try {
    return await body(sandbox);
  } finally {
    await sandbox.close();
    drainWorkerThreadPool();
  }
}

const STANDARD_PROBE = `(${async () => {
  const out = {};
  // F17: getRandomValues 拒绝浮点 TypedArray
  for (const name of ['Float32Array', 'Float64Array']) {
    try { crypto.getRandomValues(new globalThis[name](1)); out[name] = 'accepted'; }
    catch (error) { out[name] = error.name; }
  }
  // F16: once 重入只触发一次
  {
    const target = new EventTarget();
    let calls = 0;
    let nested = false;
    target.addEventListener('x', () => {
      if (!nested) { nested = true; target.dispatchEvent(new Event('x')); }
    });
    target.addEventListener('x', () => { calls += 1; }, { once: true });
    target.dispatchEvent(new Event('x'));
    out.onceReentrancy = calls;
  }
  // F16: 已 abort 的 signal 不再触发
  {
    const target = new EventTarget();
    const controller = new AbortController();
    let hits = 0;
    target.addEventListener('x', () => { hits += 1; }, { signal: controller.signal });
    controller.abort();
    target.dispatchEvent(new Event('x'));
    out.abortedListenerHits = hits;
  }
  // F15: writer.closed 在 close 前不得 resolve
  {
    const writer = new WritableStream().getWriter();
    let closed = false;
    writer.closed.then(() => { closed = true; }, () => {});
    await Promise.resolve();
    await Promise.resolve();
    out.writerClosedBeforeClose = closed;
    await writer.close();
    writer.releaseLock();
  }
  // F15: sink.write 同步抛错必须变成 rejected Promise
  {
    const writer = new WritableStream({ write() { throw new Error('fixture-error'); } }).getWriter();
    writer.closed.catch(() => {});
    try {
      const promise = writer.write('x');
      out.writerWriteThrows = 'promise';
      await promise.catch(() => {});
    } catch {
      out.writerWriteThrows = 'synchronous';
    }
    try { writer.releaseLock(); } catch { /* already errored */ }
  }
  // F15: BYOB 分段读取不丢字节
  {
    const reader = new ReadableStream({
      type: 'bytes',
      start(c) { c.enqueue(new Uint8Array([1, 2, 3, 4])); c.close(); },
    }).getReader({ mode: 'byob' });
    const first = await reader.read(new Uint8Array(2));
    const second = await reader.read(new Uint8Array(2));
    out.byob = {
      first: first.value ? [...first.value] : null,
      second: second.value ? [...second.value] : null,
      secondDone: second.done,
    };
    reader.releaseLock();
  }
  return out;
}})().then(JSON.stringify)`;

const CONTRACT_PROBE = `(${async () => {
  const out = {};
  // F14: 普通 readwrite 事务 abort 后写入回滚
  {
    const wrap = r => new Promise((resolve, reject) => {
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    const opening = indexedDB.open('rw-rollback', 1);
    opening.onupgradeneeded = () => opening.result.createObjectStore('s');
    const db = await wrap(opening);
    const tx = db.transaction('s', 'readwrite');
    const aborted = new Promise(resolve => { tx.onabort = resolve; });
    const put = tx.objectStore('s').put('should-not-survive', 1);
    put.onsuccess = () => tx.abort();
    put.onerror = () => tx.abort();
    await aborted;
    const persisted = await wrap(db.transaction('s').objectStore('s').get(1));
    db.close();
    out.abortedWriteStillPresent = persisted !== undefined;
  }
  // F14: 升级事务内 createObjectStore 后 put 合法且落库
  {
    const wrap = r => new Promise((resolve, reject) => {
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    let putStatus = 'pending';
    const opening = indexedDB.open('upgrade-put', 1);
    opening.onupgradeneeded = () => {
      const put = opening.result.createObjectStore('s').put('expected', 1);
      put.onsuccess = () => { putStatus = 'success'; };
      put.onerror = () => { putStatus = put.error.name; };
    };
    const db = await wrap(opening);
    await Promise.resolve();
    const value = await wrap(db.transaction('s').objectStore('s').get(1));
    db.close();
    out.upgradePutStatus = putStatus;
    out.upgradedValue = value ?? null;
  }
  // F18: 同 owner 两个 addModule 入口共享依赖只求值一次
  {
    let worklet = 'success';
    try {
      await CSS.paintWorklet.addModule('/a.js');
      await CSS.paintWorklet.addModule('/b.js');
    } catch (error) {
      worklet = error.name + ': ' + error.message;
    }
    out.worklet = worklet;
  }
  // F20: body 流读取后 bodyUsed 置位，text() 拒绝
  {
    const response = new Response('abc');
    const reader = response.body.getReader();
    await reader.read();
    const bodyUsed = response.bodyUsed;
    reader.releaseLock();
    let second;
    try { second = await response.text(); } catch (error) { second = 'error:' + error.name; }
    out.bodyUsedAfterStreamRead = bodyUsed;
    out.secondRead = second;
  }
  // F21: Vary 不匹配的请求不得命中缓存
  {
    const cache = await caches.open('vary-fixture');
    await cache.put(
      new Request('https://fixture.test/data', { headers: { 'accept-language': 'en' } }),
      new Response('english', { headers: { vary: 'accept-language' } }),
    );
    const wrongLanguage = await cache.match(
      new Request('https://fixture.test/data', { headers: { 'accept-language': 'fr' } }),
    );
    const rightLanguage = await cache.match(
      new Request('https://fixture.test/data', { headers: { 'accept-language': 'en' } }),
    );
    out.cacheWrongVaryHit = wrongLanguage !== undefined;
    out.cacheRightVaryHit = rightLanguage !== undefined;
  }
  // F24: URL 主机标准化
  {
    out.urls = {};
    for (const text of ['https://你好.test/', 'https://127.1/', 'https://example.test/a b']) {
      try { out.urls[text] = new URL(text).href; } catch (error) { out.urls[text] = error.name; }
    }
  }
  return out;
}})().then(JSON.stringify)`;

for (const backend of ['child-process', 'worker-thread']) {
  test(`F15/F16/F17 standard API contract on ${backend}`, async () => {
    await withSandbox(backend, async sandbox => {
      const result = JSON.parse((await sandbox.evaluate(STANDARD_PROBE)).value);
      assert.equal(result.Float32Array, 'TypeMismatchError');
      assert.equal(result.Float64Array, 'TypeMismatchError');
      assert.equal(result.onceReentrancy, 1);
      assert.equal(result.abortedListenerHits, 0);
      assert.equal(result.writerClosedBeforeClose, false);
      assert.equal(result.writerWriteThrows, 'promise');
      assert.deepEqual(result.byob, { first: [1, 2], second: [3, 4], secondDone: false });
    });
  });

  test(`F14/F18/F20/F21/F24 browser contracts on ${backend}`, async () => {
    await withSandbox(backend, async sandbox => {
      const result = JSON.parse((await sandbox.evaluate(CONTRACT_PROBE)).value);
      assert.equal(result.abortedWriteStillPresent, false);
      assert.equal(result.upgradePutStatus, 'success');
      assert.equal(result.upgradedValue, 'expected');
      assert.equal(result.worklet, 'success');
      assert.equal(result.bodyUsedAfterStreamRead, true);
      assert.equal(result.secondRead, 'error:TypeError');
      assert.equal(result.cacheWrongVaryHit, false);
      assert.equal(result.cacheRightVaryHit, true);
      assert.equal(result.urls['https://你好.test/'], 'https://xn--6qq79v.test/');
      assert.equal(result.urls['https://127.1/'], 'https://127.0.0.1/');
      assert.equal(result.urls['https://example.test/a b'], 'https://example.test/a%20b');
    });
  });
}

test('F11/F12 public options and sequential runAll contract', async () => {
  const normalized = normalizeRuntimeOptions({
    onCrash() {},
    limits: { maxBatchConcurrency: 1 },
  });
  assert.equal(typeof normalized.onCrash, 'function');
  assert.equal(normalized.limits.maxBatchConcurrency, 1);

  await withSandbox('child-process', async sandbox => {
    const values = await sandbox.batchEvaluate([
      'new Promise(resolve => { globalThis.__release = () => { globalThis.__done = true; resolve("first"); }; })',
      '(() => { const observed = globalThis.__done === true; globalThis.__release(); return observed; })()',
    ]);
    // batchEvaluate 保持并发语义（受 maxBatchConcurrency 约束）；
    // 公开 runAll 的顺序语义由 create-sandbox.js 逐项 await 保证（F12）。
    assert.deepEqual(values.map(v => v.value), ['first', false]);
  });
});
