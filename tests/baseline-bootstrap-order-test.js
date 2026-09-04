import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import {
  captureBootstrapOrderSnapshot,
  diffBootstrapSequence,
} from '../src/infra/baseline/bootstrap-order.js';

const expectedNames = {
  root: 'bootstrapRoot',
  worker: 'bootstrapWorker',
  worklet: 'bootstrapWorklet',
};

const fixture = JSON.parse(await readFile(
  new URL('../fixtures/baseline/bootstrap-order.json', import.meta.url),
  'utf8',
));

const snapshot = await captureBootstrapOrderSnapshot();

// ------------------------------------------------------------ 安装顺序契约

test('bootstrap installation order matches the recorded sequence', () => {
  assert.equal(snapshot.schema, fixture.schema);

  for (const [name, entry] of Object.entries(snapshot.entries)) {
    const recorded = fixture.entries[name];
    assert.ok(recorded, `fixture is missing bootstrap ${name}`);
    assert.ok(
      Array.isArray(recorded.sequence) && recorded.sequence.length > 0,
      `${name} fixture must record the full sequence, not only a digest`
    );

    const diff = diffBootstrapSequence(recorded.sequence, entry.sequence);

    assert.deepEqual(diff.removed, [], `${name}: installation steps disappeared`);
    assert.deepEqual(diff.added, [], `${name}: installation steps were added`);
    assert.deepEqual(
      diff.reordered,
      [],
      `${name}: installation order changed — order is a behavioural contract`
    );
  }
});

test('recorded summaries agree with the recorded sequence', () => {
  // 防止有人手改 fixture 时只动摘要不动序列，或反之
  for (const [name, recorded] of Object.entries(fixture.entries)) {
    assert.equal(
      recorded.callCount,
      recorded.sequence.length,
      `${name}: callCount disagrees with sequence length`
    );
    assert.equal(
      recorded.firstCall,
      recorded.sequence[0].split(':')[1],
      `${name}: firstCall disagrees with sequence`
    );
    assert.equal(
      recorded.lastCall,
      recorded.sequence.at(-1).split(':')[1],
      `${name}: lastCall disagrees with sequence`
    );
  }
});

// ------------------------------------------------------------ 快照结构

test('every bootstrap exposes the expected entry function', () => {
  for (const [name, entry] of Object.entries(snapshot.entries)) {
    assert.equal(entry.function, expectedNames[name]);
    assert.ok(entry.functionStartLine < entry.functionEndLine);
    assert.ok(entry.calls.length > 0);
  }
});

test('captured calls are ordered by source line', () => {
  for (const [name, entry] of Object.entries(snapshot.entries)) {
    const lines = entry.calls.map((call) => call.line);
    assert.deepEqual(
      lines,
      [...lines].sort((left, right) => left - right),
      `${name}: calls must be captured in source order`
    );
  }
});

test('every call carries a recognised kind', () => {
  const kinds = new Set(['bootstrap', 'configure', 'install', 'finalize', 'internal']);
  for (const entry of Object.values(snapshot.entries)) {
    for (const call of entry.calls) {
      assert.ok(kinds.has(call.kind), `unexpected call kind: ${call.kind}`);
      assert.equal(typeof call.name, 'string');
      assert.ok(Number.isInteger(call.line));
    }
  }
});

test('all three bootstraps hide Node globals first', () => {
  for (const name of Object.keys(expectedNames)) {
    assert.equal(
      snapshot.entries[name].calls[0].name,
      'hideNodeGlobals',
      `${name} must hide Node globals before anything else`
    );
  }
});

// --------------------------------------------------- 信息性字段不参与校验

test('source digests and line numbers are informational only', () => {
  for (const [name, recorded] of Object.entries(fixture.entries)) {
    assert.ok(
      recorded.informational,
      `${name}: source digest and line numbers belong under informational`
    );
    assert.match(recorded.informational.sourceSha256, /^[a-f0-9]{64}$/);

    // 关键断言：这些字段不出现在顶层，因此不会被顺序校验用到。
    // 它们对注释改动和代码位移敏感，参与校验会让 baseline 因无关变更而失败。
    assert.equal(recorded.sourceSha256, undefined);
    assert.equal(recorded.functionStartLine, undefined);
    assert.equal(recorded.functionEndLine, undefined);
  }
});

// ------------------------------------------------------------- diff 语义

test('diffBootstrapSequence separates removals, additions and reordering', () => {
  assert.deepEqual(
    diffBootstrapSequence(['install:a', 'install:b'], ['install:a', 'install:b']),
    { removed: [], added: [], reordered: [] }
  );

  const removed = diffBootstrapSequence(['install:a', 'install:b'], ['install:a']);
  assert.deepEqual(removed.removed, ['install:b']);
  assert.deepEqual(removed.added, []);

  const added = diffBootstrapSequence(['install:a'], ['install:a', 'install:c']);
  assert.deepEqual(added.added, ['install:c']);
  assert.deepEqual(added.removed, []);
});

test('reordering is reported only when the call set is unchanged', () => {
  const reordered = diffBootstrapSequence(
    ['install:a', 'install:b'],
    ['install:b', 'install:a']
  );
  assert.deepEqual(reordered.removed, []);
  assert.deepEqual(reordered.added, []);
  assert.equal(reordered.reordered.length, 2);
  assert.deepEqual(reordered.reordered[0], {
    index: 0,
    expected: 'install:a',
    actual: 'install:b',
  });

  // 集合已变时不报位序，否则位移会淹没真正的信号
  const both = diffBootstrapSequence(
    ['install:a', 'install:b'],
    ['install:b', 'install:c']
  );
  assert.deepEqual(both.removed, ['install:a']);
  assert.deepEqual(both.added, ['install:c']);
  assert.deepEqual(both.reordered, []);
});

test('duplicate calls are counted rather than deduplicated', () => {
  const diff = diffBootstrapSequence(
    ['install:a', 'install:a'],
    ['install:a']
  );
  assert.deepEqual(diff.removed, ['install:a'], 'losing one of two calls must be reported');
});
