import assert from 'node:assert/strict';
import test from 'node:test';
import { Collector } from '../src/collection/collector/collector.js';
import { createCollectorResponse } from '../src/collection/collector/transport.js';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';
import { drainWorkerThreadPool } from '../src/backend/controller/worker-thread-pool.js';

// Deterministic local transport; these tests never open an external socket.
test('explicit credentials cannot reappear after crossing origins', async () => {
  const requests = [];
  const locations = ['https://b.test/one', 'https://b.test/two', 'https://a.test/end'];
  const collector = new Collector({
    policy: { enabled: true, allowedOrigins: ['https://a.test', 'https://b.test'], followRedirects: true, allowCrossOriginRedirect: true },
    retry: { maxAttempts: 1 },
    transport: { async send(request) {
      requests.push(request);
      const location = locations[requests.length - 1];
      return createCollectorResponse({ status: location ? 302 : 200, headers: location ? { location } : {} });
    } },
  });
  try {
    await collector.send({ method: 'GET', url: 'https://a.test/start', headers: { 'x-review-marker': 'test' }, cookies: { review_marker: 'test' } });
    assert.equal(requests.length, 4);
    assert.ok(requests[0].headers.some(h => h.name === 'x-review-marker'));
    for (const request of requests.slice(1)) {
      assert.equal(request.headers.some(h => h.name === 'x-review-marker'), false);
      assert.equal(request.cookies.some(c => c.name === 'review_marker'), false);
    }
  } finally { await collector.dispose(); }
});

test('POST to GET redirects permanently discard body and body headers', async () => {
  const requests = [];
  const collector = new Collector({
    policy: { enabled: true, allowedOrigins: ['https://fixture.test'], followRedirects: true },
    retry: { maxAttempts: 1 },
    transport: { async send(request) {
      requests.push(request);
      return createCollectorResponse({ status: requests.length === 1 ? 302 : requests.length === 2 ? 307 : 200,
        headers: requests.length < 3 ? { location: `/hop${requests.length}` } : {} });
    } },
  });
  try {
    await collector.send({ method: 'POST', url: 'https://fixture.test/start', body: 'test', headers: { 'content-length': '4', 'content-type': 'text/plain' } });
    assert.deepEqual(requests.map(r => r.method), ['POST', 'GET', 'GET']);
    for (const request of requests.slice(1)) {
      assert.equal(request.body.encoding, 'none');
      assert.equal(request.headers.some(h => h.name === 'content-type' || h.name === 'content-length'), false);
    }
  } finally { await collector.dispose(); }
});

for (const backend of ['child-process', 'worker-thread']) {
  test(`all blocked deleteDatabase requests finish in order (${backend})`, { timeout: 15000 }, async () => {
    const sandbox = await EdgeSandbox.create({ execution: { backend }, page: { url: 'https://idb.test/' }, limits: { timeoutMs: 10000 } });
    try {
      const result = await sandbox.evaluate(`(async () => {
        const db = await new Promise((resolve, reject) => {
          const r = indexedDB.open('queued-delete', 1);
          r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
        });
        const order = [];
        const first = indexedDB.deleteDatabase('queued-delete');
        const second = indexedDB.deleteDatabase('queued-delete');
        const complete = (r, tag) => new Promise((resolve, reject) => {
          r.onsuccess = () => { order.push(tag); resolve(); }; r.onerror = () => reject(r.error);
        });
        const done = Promise.all([complete(first, 'first'), complete(second, 'second')]);
        await Promise.resolve(); await Promise.resolve();
        if (first.readyState !== 'pending' || second.readyState !== 'pending') throw new Error('deletion was not blocked');
        db.close();
        await done;
        return JSON.stringify({order, first:first.readyState, second:second.readyState, databases:await indexedDB.databases()});
      })()`);
      assert.deepEqual(JSON.parse(result.value), { order: ['first', 'second'], first: 'done', second: 'done', databases: [] });
    } finally { await sandbox.close(); drainWorkerThreadPool(); }
  });
}
