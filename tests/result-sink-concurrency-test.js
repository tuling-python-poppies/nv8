import test from 'node:test';
import assert from 'node:assert/strict';
import { createBatchingResultSink } from '../src/collection/collector/result-sink.js';
import { CollectorErrorCode } from '../src/collection/collector/errors.js';
import { drainTasks } from './helpers/async-wait.js';

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

test('close waits for an accepted whole write, including its partial tail batch', async () => {
  const entered = deferred(), release = deferred();
  const persisted = [];
  const sink = createBatchingResultSink({ batchSize: 2, persist: async batch => {
    entered.resolve();
    await release.promise;
    persisted.push(...batch);
  } });
  const writing = sink.write([1, 2, 3]);
  await entered.promise;
  const closing = sink.close();
  assert.equal(sink.close(), closing, 'concurrent close must share completion');
  let finished = false;
  closing.then(() => { finished = true; });
  try {
    await assert.rejects(sink.write([4]), e => e.code === CollectorErrorCode.DISPOSED);
    await drainTasks();
    assert.equal(finished, false);
    assert.equal(sink.closed, false);
  } finally { release.resolve(); await Promise.all([writing, closing]); }
  assert.deepEqual(persisted, [1, 2, 3]);
  assert.equal(sink.stats().buffered, 0);
  assert.equal(sink.stats().written, 3);
  assert.equal(sink.closed, true);
});

test('parallel writes are serialized and deduplicated before a flush barrier', async () => {
  let active = 0, peak = 0;
  const batches = [];
  const sink = createBatchingResultSink({ batchSize: 2, keyOf: x => x, persist: async batch => {
    peak = Math.max(peak, ++active);
    await Promise.resolve();
    batches.push([...batch]);
    active -= 1;
  } });
  const a = sink.write([1, 2, 3]);
  const b = sink.write([3, 4, 5]);
  const flushing = sink.flush();
  const [acceptedA, acceptedB] = await Promise.all([a, b, flushing]);
  assert.equal(acceptedA, 3);
  assert.equal(acceptedB, 2);
  assert.deepEqual(batches, [[1, 2], [3, 4], [5]]);
  assert.equal(peak, 1);
  await sink.close();
});

test('flush and close report a preceding in-flight write failure and allow explicit retry', async () => {
  const entered = deferred(), release = deferred();
  const failure = new Error('storage failed');
  let fail = true;
  const persisted = [];
  const sink = createBatchingResultSink({ batchSize: 2, keyOf: x => x, persist: async batch => {
    if (fail) { entered.resolve(); await release.promise; throw failure; }
    persisted.push(...batch);
  } });
  const writing = sink.write([1, 2]);
  await entered.promise;
  const results = Promise.allSettled([writing, sink.flush(), sink.close()]);
  release.resolve();
  for (const result of await results) {
    assert.equal(result.status, 'rejected');
    assert.equal(result.reason, failure);
  }
  assert.equal(sink.closed, false);
  fail = false;
  assert.equal(await sink.write([1, 2]), 2);
  await sink.close();
  assert.deepEqual(persisted, [1, 2]);
});

test('a failed closing flush does not poison the queue or deduplication keys', async () => {
  let fail = true;
  const persisted = [];
  const sink = createBatchingResultSink({ batchSize: 10, keyOf: x => x, persist: async batch => {
    if (fail) throw new Error('disk full');
    persisted.push(...batch);
  } });
  await sink.write([1]);
  await assert.rejects(sink.close(), /disk full/);
  assert.equal(sink.closed, false);
  fail = false;
  await sink.write([1]);
  await sink.close();
  assert.deepEqual(persisted, [1]);
});

test('an earlier handled failure does not prevent a later empty close', async () => {
  const sink = createBatchingResultSink({ batchSize: 1, persist() { throw new Error('failure'); } });
  await assert.rejects(sink.write([1]), /failure/);
  await sink.close();
  assert.equal(sink.closed, true);
  assert.equal(sink.stats().buffered, 0);
});

test('a queued duplicate retries failed persistence instead of dropping its data', async () => {
  const entered = deferred(), release = deferred();
  let calls = 0;
  const persisted = [];
  const sink = createBatchingResultSink({ batchSize: 2, keyOf: x => x, persist: async batch => {
    if (++calls === 1) { entered.resolve(); await release.promise; throw new Error('first attempt failed'); }
    persisted.push(...batch);
  } });
  const first = sink.write([1, 2]);
  await entered.promise;
  const second = sink.write([1, 2]);
  const settled = Promise.allSettled([first, second]);
  release.resolve();
  const [failed, retried] = await settled;
  assert.equal(failed.status, 'rejected');
  assert.equal(retried.status, 'fulfilled');
  assert.equal(retried.value, 2);
  await sink.close();
  assert.deepEqual(persisted, [1, 2]);
});
