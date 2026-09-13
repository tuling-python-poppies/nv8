import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createBatchingResultSink,
  createMemoryResultSink,
  keyByFields,
} from '../src/collection/collector/result-sink.js';

test('a failed persist does not poison keys for a retry', async () => {
  const persisted = [];
  let attempts = 0;
  const sink = createBatchingResultSink({
    batchSize: 2,
    keyOf: item => item.id,
    persist: async batch => {
      attempts += 1;
      if (attempts === 1) throw new Error('storage temporarily unavailable');
      persisted.push(...batch);
    },
  });

  await assert.rejects(
    () => sink.write([{ id: 'a' }, { id: 'b' }]),
    /storage temporarily unavailable/,
  );
  assert.equal(sink.stats().written, 0);
  assert.equal(sink.stats().buffered, 0);

  assert.equal(await sink.write([{ id: 'a' }, { id: 'b' }]), 2);
  await sink.close();
  assert.deepEqual(persisted, [{ id: 'a' }, { id: 'b' }]);
  assert.equal(sink.stats().duplicates, 0);
});

test('keys are committed only after a successful batch and duplicates remain bounded', async () => {
  const sink = createMemoryResultSink({ batchSize: 2, keyOf: item => item.id });

  assert.equal(await sink.write([{ id: 'a' }, { id: 'a' }, { id: 'b' }]), 2);
  assert.deepEqual(sink.items(), [{ id: 'a' }, { id: 'b' }]);
  assert.equal(sink.stats().duplicates, 1);

  await sink.write([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
  await sink.close();
  assert.deepEqual(sink.items(), [{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
  assert.equal(sink.stats().duplicates, 3);
});

test('known keys support restart without reading result values into sink state', async () => {
  const sink = createBatchingResultSink({
    knownKeys: ['old'],
    keyOf: item => item.id,
    persist: async () => {},
  });

  assert.equal(await sink.write([{ id: 'old' }, { id: 'new' }]), 1);
  await sink.close();
  assert.equal(sink.stats().duplicates, 1);
});

test('keyByFields produces the same key for equivalent selected fields', () => {
  const keyOf = keyByFields(['id', 'kind']);
  assert.equal(keyOf({ id: 7, kind: 'x', fetchedAt: 1 }), keyOf({
    id: 7,
    kind: 'x',
    fetchedAt: 2,
  }));
});
