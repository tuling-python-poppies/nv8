/**
 * Trace / Network / Navigation golden fixture 测试
 *
 * 这三类记录都带非确定性成分（自增序号、时间戳、限额相关标志），
 * 因此测试的重点有两层：
 * 1. 归一化确实剥掉了非确定性字段
 * 2. 归一化之后的结果与 golden fixture 逐条一致
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  OBSERVABILITY_SCHEMA,
  diffObservability,
  normalizeNavigation,
  normalizeNetworkRequests,
  normalizeTrace,
  summarizeObservability,
} from '../src/baseline/observability.js';

const fixture = JSON.parse(await readFile(
  new URL('../fixtures/baseline/observability.json', import.meta.url),
  'utf8',
));

// ------------------------------------------------------------------ 归一化

test('trace normalization drops the auto-incrementing sequence', () => {
  const normalized = normalizeTrace([
    { sequence: 1, operation: 'get', api: 'window.document', receiver: 'Window', arguments: [], result: 'object' },
    { sequence: 99, operation: 'get', api: 'window.document', receiver: 'Window', arguments: [], result: 'object' },
  ]);
  assert.equal(normalized.length, 2);
  assert.deepEqual(normalized[0], normalized[1], 'sequence must not affect the normalized form');
  assert.equal('sequence' in normalized[0], false);
});

test('trace normalization keeps argument types but discards values', () => {
  const normalized = normalizeTrace([
    { operation: 'apply', api: 'window.fetch', receiver: 'Window', arguments: ['https://a.test/', 7], result: 'object' },
  ]);
  assert.deepEqual(normalized[0].argumentTypes, ['string', 'number']);
  assert.equal('arguments' in normalized[0], false);
});

test('network normalization drops sequence and truncation flags', () => {
  const normalized = normalizeNetworkRequests([{
    sequence: 5,
    api: 'fetch',
    method: 'GET',
    url: 'https://api.test/x',
    outcome: 'replayed',
    urlTruncated: true,
    headersTruncated: true,
    bodyTruncated: true,
    headers: [{ name: 'X-B' }, { name: 'x-a' }],
    bodyByteLength: 12,
    context: { kind: 'window', url: 'https://page.test/', topLevel: true },
  }]);

  const entry = normalized[0];
  assert.equal('sequence' in entry, false);
  assert.equal('urlTruncated' in entry, false);
  assert.equal('headersTruncated' in entry, false);
  assert.equal('bodyTruncated' in entry, false);
  // header 名归一化为小写并排序，避免顺序抖动
  assert.deepEqual(entry.headerNames, ['x-a', 'x-b']);
  assert.equal(entry.bodyByteLength, 12);
  assert.equal(entry.contextKind, 'window');
});

test('network normalization keeps only body length, never body content', () => {
  const normalized = normalizeNetworkRequests([{
    api: 'fetch',
    method: 'POST',
    url: 'https://api.test/x',
    bodyText: 'nonce=abc123',
    bodyBase64: 'bm9uY2U9',
    bodyByteLength: 12,
  }]);
  const serialized = JSON.stringify(normalized[0]);
  assert.ok(!serialized.includes('abc123'), 'body content must not enter the golden fixture');
  assert.equal(normalized[0].bodyByteLength, 12);
});

test('navigation normalization drops entry keys and ids', () => {
  const normalized = normalizeNavigation([
    { key: 'entry-7', id: 'navigation-7', url: 'https://a.test/', index: 0, state: null },
    { key: 'entry-8', id: 'navigation-8', url: 'https://a.test/b', index: 1, state: { a: 1 } },
  ]);
  assert.equal('key' in normalized[0], false);
  assert.equal('id' in normalized[0], false);
  assert.equal(normalized[0].hasState, false);
  assert.equal(normalized[1].hasState, true);
});

test('normalizers tolerate missing input', () => {
  assert.deepEqual(normalizeTrace(undefined), []);
  assert.deepEqual(normalizeNetworkRequests(null), []);
  assert.deepEqual(normalizeNavigation('not-an-array'), []);
});

// ------------------------------------------------------------------- diff

test('diffObservability reports count changes per section', () => {
  const before = summarizeObservability({ trace: [{ operation: 'get' }] });
  const after = summarizeObservability({ trace: [] });
  const differences = diffObservability(before, after);
  assert.equal(differences.length, 1);
  assert.equal(differences[0].section, 'trace');
  assert.equal(differences[0].kind, 'count');
  assert.deepEqual([differences[0].expected, differences[0].actual], [1, 0]);
});

test('diffObservability locates the changed entry rather than only the digest', () => {
  const before = summarizeObservability({
    requests: [{ api: 'fetch', method: 'GET', url: 'https://a.test/' }],
  });
  const after = summarizeObservability({
    requests: [{ api: 'fetch', method: 'POST', url: 'https://a.test/' }],
  });
  const differences = diffObservability(before, after);
  assert.equal(differences.length, 1);
  assert.equal(differences[0].kind, 'entry');
  assert.equal(differences[0].index, 0);
  assert.equal(differences[0].expected.method, 'GET');
  assert.equal(differences[0].actual.method, 'POST');
});

test('identical snapshots produce no differences', () => {
  const snapshot = summarizeObservability({
    trace: [{ operation: 'get', api: 'window.document' }],
    requests: [{ api: 'fetch', method: 'GET', url: 'https://a.test/' }],
    navigation: [{ url: 'https://a.test/', index: 0 }],
  });
  assert.deepEqual(diffObservability(snapshot, snapshot), []);
});

// ---------------------------------------------------------------- fixture

test('fixture uses the current schema and records all three sections', () => {
  assert.equal(fixture.schema, OBSERVABILITY_SCHEMA);
  for (const section of ['trace', 'requests', 'navigation']) {
    assert.ok(fixture[section], `fixture is missing section ${section}`);
    assert.equal(
      fixture[section].count,
      fixture[section].entries.length,
      `${section}: count disagrees with entries length`
    );
    assert.match(fixture[section].digest, /^[a-f0-9]{16}$/);
  }
});

test('fixture contains no non-deterministic fields', () => {
  const serialized = JSON.stringify(fixture);
  for (const forbidden of ['sequence', 'bodyText', 'bodyBase64', 'Truncated', '"key"', '"id"']) {
    assert.ok(
      !serialized.includes(forbidden),
      `golden fixture must not contain ${forbidden}`
    );
  }
});

test('fixture records the replayed network request and pushState navigation', () => {
  const request = fixture.requests.entries.find(
    (entry) => entry.url === 'https://api.example.test/baseline'
  );
  assert.ok(request, 'the replayed fetch must be recorded');
  assert.equal(request.outcome, 'replayed', 'baseline must never reach the real network');
  assert.equal(request.contextKind, 'window');

  assert.equal(fixture.navigation.count, 2, 'initial entry plus one pushState');
  assert.equal(fixture.navigation.entries[1].hasState, true);
});
