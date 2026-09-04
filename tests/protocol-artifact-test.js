/**
 * Protocol layer tests (Gate 5)
 *
 * 覆盖 canonical JSON、工件契约、请求计划归一化、transform 应用与冲突、
 * 适配器需求校验以及边界保证。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ARTIFACT_SCHEMA_VERSION,
  ArtifactKind,
  ArtifactSet,
  BodyEncoding,
  ProtocolErrorCode,
  TransformKind,
  applyTransforms,
  assertAdapterRequirements,
  canonicalDigest,
  canonicalJson,
  checkAdapterRequirements,
  createArtifactSet,
  createProtocolRegistry,
  createRequestPlan,
  createRuntimeArtifact,
  createTransform,
  defineProtocolAdapter,
  deserializeArtifact,
  findTransformConflicts,
  getCookie,
  getHeader,
  getHeaderValues,
  isArtifactSchemaCompatible,
  protocolResultToJSON,
  serializeArtifact,
} from '../src/collection/request-protocol/index.js';

function artifact(overrides = {}) {
  return createRuntimeArtifact({
    id: 'sign',
    kind: ArtifactKind.SIGNATURE,
    value: 'abc',
    producer: 'test',
    createdAt: 1000,
    ...overrides,
  });
}

function basePlan(overrides = {}) {
  return createRequestPlan({
    method: 'GET',
    url: 'https://target.test/api',
    ...overrides,
  });
}

// ---------------------------------------------------------------- canonical

test('canonicalJson sorts object keys deterministically', () => {
  assert.equal(canonicalJson({ b: 1, a: 2 }), '{"a":2,"b":1}');
  assert.equal(canonicalJson({ a: 2, b: 1 }), canonicalJson({ b: 1, a: 2 }));
});

test('canonicalJson preserves array order', () => {
  assert.equal(canonicalJson([3, 1, 2]), '[3,1,2]');
});

test('canonicalJson normalizes negative zero', () => {
  assert.equal(canonicalJson({ v: -0 }), '{"v":0}');
});

test('canonicalJson omits undefined properties but rejects undefined values', () => {
  assert.equal(canonicalJson({ a: 1, b: undefined }), '{"a":1}');
  assert.throws(() => canonicalJson(undefined), /undefined is not representable/);
});

test('canonicalJson rejects non-finite numbers, functions and symbols', () => {
  assert.throws(() => canonicalJson({ v: NaN }), /non-finite/);
  assert.throws(() => canonicalJson({ v: Infinity }), /non-finite/);
  assert.throws(() => canonicalJson({ v: () => {} }), /function is not representable/);
  assert.throws(() => canonicalJson({ v: Symbol('x') }), /symbol is not representable/);
  assert.throws(() => canonicalJson({ v: 1n }), /bigint is not representable/);
});

test('canonicalJson rejects circular references', () => {
  const value = { a: 1 };
  value.self = value;
  assert.throws(() => canonicalJson(value), /circular reference/);
});

test('canonicalJson rejects class instances to keep digests stable', () => {
  class Custom { constructor() { this.a = 1; } }
  assert.throws(() => canonicalJson(new Custom()), /unsupported object prototype/);
});

test('canonicalDigest is stable across key order', () => {
  assert.equal(canonicalDigest({ a: 1, b: 2 }), canonicalDigest({ b: 2, a: 1 }));
  assert.notEqual(canonicalDigest({ a: 1 }), canonicalDigest({ a: 2 }));
});

// ---------------------------------------------------------------- artifact

test('createRuntimeArtifact freezes the record and computes a digest', () => {
  const record = artifact();
  assert.equal(Object.isFrozen(record), true);
  assert.equal(record.schemaVersion, ARTIFACT_SCHEMA_VERSION);
  assert.match(record.digest, /^[a-f0-9]{64}$/);
  assert.ok(record.byteLength > 0);
});

test('createRuntimeArtifact rejects invalid ids and unknown kinds', () => {
  assert.throws(() => artifact({ id: '' }), /id must match/);
  assert.throws(() => artifact({ id: '-bad' }), /id must match/);
  assert.throws(
    () => artifact({ kind: 'not-a-kind' }),
    (error) => error.code === ProtocolErrorCode.ARTIFACT_UNKNOWN_KIND
  );
});

test('createRuntimeArtifact rejects values that are not canonical-JSON representable', () => {
  assert.throws(() => artifact({ value: () => {} }), /not canonical-JSON representable/);
  assert.throws(() => artifact({ value: undefined }), /value must not be undefined/);
});

test('createRuntimeArtifact validates expiry ordering', () => {
  assert.throws(
    () => artifact({ createdAt: 2000, expiresAt: 1000 }),
    /expiresAt must not precede createdAt/
  );
});

test('artifact schema compatibility follows major/minor rules', () => {
  assert.equal(isArtifactSchemaCompatible('1.0', '1.0'), true);
  assert.equal(isArtifactSchemaCompatible('1.0', '1.3'), true, 'older artifact, newer consumer');
  assert.equal(isArtifactSchemaCompatible('1.4', '1.1'), false, 'artifact newer than consumer');
  assert.equal(isArtifactSchemaCompatible('2.0', '1.0'), false, 'major mismatch');
});

test('artifacts round-trip through serialize/deserialize with a stable digest', () => {
  const original = artifact({ value: { nested: [1, 2, 3] } });
  const restored = deserializeArtifact(serializeArtifact(original));
  assert.equal(restored.digest, original.digest);
});

// ------------------------------------------------------------ artifact set

test('ArtifactSet rejects duplicate ids but allows explicit replace', () => {
  const set = createArtifactSet([artifact()]);
  assert.throws(
    () => set.add(artifact()),
    (error) => error.code === ProtocolErrorCode.ARTIFACT_DUPLICATE_ID
  );
  set.replace(artifact({ value: 'changed' }));
  assert.equal(set.get('sign').value, 'changed');
  assert.equal(set.size, 1);
});

test('ArtifactSet tracks totalBytes across add, replace and delete', () => {
  const set = new ArtifactSet();
  const first = set.add(artifact());
  assert.equal(set.totalBytes, first.byteLength);
  const replaced = set.replace(artifact({ value: 'a much longer signature value' }));
  assert.equal(set.totalBytes, replaced.byteLength);
  set.delete('sign');
  assert.equal(set.totalBytes, 0);
});

test('ArtifactSet enforces count limit', () => {
  const set = new ArtifactSet({ limits: { maxArtifacts: 1 } });
  set.add(artifact({ id: 'a' }));
  assert.throws(
    () => set.add(artifact({ id: 'b' })),
    (error) => error.code === ProtocolErrorCode.ARTIFACT_LIMIT_COUNT
  );
});

test('ArtifactSet enforces per-artifact and total byte limits', () => {
  const single = new ArtifactSet({ limits: { maxArtifactBytes: 10 } });
  assert.throws(
    () => single.add(artifact({ value: 'x'.repeat(64) })),
    (error) => error.code === ProtocolErrorCode.ARTIFACT_LIMIT_BYTES
  );

  const total = new ArtifactSet({ limits: { maxTotalBytes: 200 } });
  total.add(artifact({ id: 'a' }));
  assert.throws(
    () => total.add(artifact({ id: 'b', value: 'y'.repeat(120) })),
    (error) => error.code === ProtocolErrorCode.ARTIFACT_LIMIT_BYTES
  );
});

test('ArtifactSet failed replace restores the previous artifact', () => {
  const set = new ArtifactSet({ limits: { maxArtifactBytes: 200 } });
  set.add(artifact({ value: 'small' }));
  assert.throws(() => set.replace(artifact({ value: 'z'.repeat(500) })));
  assert.equal(set.get('sign').value, 'small', 'original artifact survives a failed replace');
  assert.equal(set.size, 1);
});

test('ArtifactSet.require reports available ids when missing', () => {
  const set = createArtifactSet([artifact({ id: 'present' })]);
  assert.throws(
    () => set.require('absent'),
    (error) => {
      assert.equal(error.code, ProtocolErrorCode.ARTIFACT_NOT_FOUND);
      assert.deepEqual(error.context.available, ['present']);
      return true;
    }
  );
});

test('ArtifactSet.pruneExpired removes only expired artifacts', () => {
  const set = createArtifactSet([
    artifact({ id: 'fresh', createdAt: 1000, expiresAt: 5000 }),
    artifact({ id: 'stale', createdAt: 1000, expiresAt: 2000 }),
    artifact({ id: 'eternal', createdAt: 1000, expiresAt: null }),
  ]);
  assert.deepEqual(set.pruneExpired(3000), ['stale']);
  assert.deepEqual(set.ids(), ['eternal', 'fresh']);
});

test('ArtifactSet digest ignores insertion order', () => {
  const a = artifact({ id: 'a' });
  const b = artifact({ id: 'b' });
  assert.equal(createArtifactSet([a, b]).digest(), createArtifactSet([b, a]).digest());
});

// ----------------------------------------------------------- request plan

test('createRequestPlan normalizes method and lowercases header names', () => {
  const plan = createRequestPlan({
    method: 'post',
    url: 'https://target.test/api',
    headers: { 'Content-Type': 'application/json', 'X-Trace': 'abc' },
    body: 'payload',
  });
  assert.equal(plan.method, 'POST');
  assert.deepEqual(plan.headers.map((entry) => entry.name), ['content-type', 'x-trace']);
  assert.equal(getHeader(plan, 'Content-Type'), 'application/json');
});

test('createRequestPlan rejects relative and non-http URLs', () => {
  assert.throws(() => createRequestPlan({ method: 'GET', url: '/relative' }), /not absolute/);
  assert.throws(
    () => createRequestPlan({ method: 'GET', url: 'ftp://target.test/x' }),
    /protocol must be http/
  );
});

test('createRequestPlan rejects header injection via CR/LF', () => {
  assert.throws(
    () => createRequestPlan({
      method: 'GET',
      url: 'https://target.test/',
      headers: { 'x-evil': 'a\r\nX-Injected: 1' },
    }),
    /contains CR, LF or NUL/
  );
});

test('createRequestPlan rejects illegal header and cookie names', () => {
  assert.throws(
    () => createRequestPlan({
      method: 'GET', url: 'https://target.test/', headers: { 'bad header': 'v' },
    }),
    /header name contains illegal characters/
  );
  assert.throws(
    () => createRequestPlan({
      method: 'GET', url: 'https://target.test/', cookies: { 'bad;name': 'v' },
    }),
    /cookie name contains illegal characters/
  );
});

test('createRequestPlan rejects cookie values containing a semicolon', () => {
  assert.throws(
    () => createRequestPlan({
      method: 'GET', url: 'https://target.test/', cookies: { sid: 'a;b' },
    }),
    /contains CR, LF, NUL or ";"/
  );
});

test('createRequestPlan preserves multi-value headers in order', () => {
  const plan = createRequestPlan({
    method: 'GET',
    url: 'https://target.test/',
    headers: [
      { name: 'accept', value: 'text/html' },
      { name: 'Accept', value: 'application/json' },
    ],
  });
  assert.deepEqual(getHeaderValues(plan, 'accept'), ['text/html', 'application/json']);
});

test('createRequestPlan forbids a body on safe methods', () => {
  assert.throws(
    () => createRequestPlan({ method: 'GET', url: 'https://target.test/', body: 'x' }),
    /must not carry a request body/
  );
});

test('createRequestPlan validates base64 bodies', () => {
  assert.throws(
    () => createRequestPlan({
      method: 'POST',
      url: 'https://target.test/',
      body: { encoding: BodyEncoding.BASE64, value: 'not base64!!' },
    }),
    /valid base64/
  );
});

test('createRequestPlan enforces url, header and body limits', () => {
  assert.throws(
    () => createRequestPlan({
      method: 'GET',
      url: `https://target.test/${'a'.repeat(100)}`,
      limits: { maxUrlLength: 32 },
    }),
    /exceeds maxUrlLength/
  );
  assert.throws(
    () => createRequestPlan({
      method: 'GET',
      url: 'https://target.test/',
      headers: { a: '1', b: '2' },
      limits: { maxHeaderCount: 1 },
    }),
    /exceeds maxHeaderCount/
  );
  assert.throws(
    () => createRequestPlan({
      method: 'POST',
      url: 'https://target.test/',
      body: 'x'.repeat(100),
      limits: { maxBodyBytes: 10 },
    }),
    /exceeds maxBodyBytes/
  );
});

test('request plan digest is order-insensitive for headers', () => {
  const first = createRequestPlan({
    method: 'GET', url: 'https://target.test/', headers: { a: '1', b: '2' },
  });
  const second = createRequestPlan({
    method: 'GET', url: 'https://target.test/', headers: { b: '2', a: '1' },
  });
  assert.equal(first.digest, second.digest);
});

test('request plan records whether the method is well known', () => {
  assert.equal(basePlan().wellKnownMethod, true);
  assert.equal(
    createRequestPlan({ method: 'PURGE', url: 'https://target.test/' }).wellKnownMethod,
    false
  );
});

// -------------------------------------------------------------- transforms

test('createTransform lowercases header names and validates required fields', () => {
  const transform = createTransform(TransformKind.SET_HEADER, { name: 'X-Sign', value: 'v' });
  assert.equal(transform.name, 'x-sign');
  assert.equal(Object.isFrozen(transform), true);
  assert.throws(
    () => createTransform(TransformKind.SET_HEADER, { name: 'x' }),
    /value must be a non-empty string/
  );
  assert.throws(() => createTransform('nope', {}), /unknown kind/);
});

test('applyTransforms sets, appends and removes headers', () => {
  const plan = createRequestPlan({
    method: 'GET', url: 'https://target.test/', headers: { 'x-old': 'gone', accept: 'a' },
  });
  const result = applyTransforms(plan, [
    createTransform(TransformKind.SET_HEADER, { name: 'x-sign', value: 'sig' }, { source: 'p' }),
    createTransform(TransformKind.APPEND_HEADER, { name: 'accept', value: 'b' }, { source: 'p' }),
    createTransform(TransformKind.REMOVE_HEADER, { name: 'x-old' }, { source: 'p' }),
  ]);
  assert.equal(getHeader(result, 'x-sign'), 'sig');
  assert.deepEqual(getHeaderValues(result, 'accept'), ['a', 'b']);
  assert.equal(getHeader(result, 'x-old'), undefined);
});

test('applyTransforms manages cookies and query parameters', () => {
  const plan = createRequestPlan({
    method: 'GET',
    url: 'https://target.test/api?keep=1&drop=2',
    cookies: { old: 'x' },
  });
  const result = applyTransforms(plan, [
    createTransform(TransformKind.SET_COOKIE, { name: 'sid', value: 'abc' }, { source: 'p' }),
    createTransform(TransformKind.REMOVE_COOKIE, { name: 'old' }, { source: 'p' }),
    createTransform(TransformKind.SET_QUERY, { name: 'ts', value: '123' }, { source: 'p' }),
    createTransform(TransformKind.REMOVE_QUERY, { name: 'drop' }, { source: 'p' }),
  ]);
  assert.equal(getCookie(result, 'sid'), 'abc');
  assert.equal(getCookie(result, 'old'), undefined);
  const url = new URL(result.url);
  assert.equal(url.searchParams.get('ts'), '123');
  assert.equal(url.searchParams.get('keep'), '1');
  assert.equal(url.searchParams.has('drop'), false);
});

test('applyTransforms merges JSON bodies over an existing object body', () => {
  const plan = createRequestPlan({
    method: 'POST',
    url: 'https://target.test/api',
    body: { encoding: BodyEncoding.JSON, value: { a: 1, keep: true } },
  });
  const result = applyTransforms(plan, [
    createTransform(TransformKind.MERGE_JSON_BODY, { patch: { a: 2, sign: 's' } }, { source: 'p' }),
  ]);
  assert.deepEqual(result.body.value, { a: 2, keep: true, sign: 's' });
});

test('applyTransforms merges JSON into a parseable text body', () => {
  const plan = createRequestPlan({
    method: 'POST', url: 'https://target.test/api', body: '{"a":1}',
  });
  const result = applyTransforms(plan, [
    createTransform(TransformKind.MERGE_JSON_BODY, { patch: { b: 2 } }, { source: 'p' }),
  ]);
  assert.equal(result.body.encoding, BodyEncoding.JSON);
  assert.deepEqual(result.body.value, { a: 1, b: 2 });
});

test('applyTransforms rejects JSON merge on an unparseable body', () => {
  const plan = createRequestPlan({
    method: 'POST', url: 'https://target.test/api', body: 'not-json',
  });
  assert.throws(
    () => applyTransforms(plan, [
      createTransform(TransformKind.MERGE_JSON_BODY, { patch: { b: 2 } }, { source: 'p' }),
    ]),
    /requires a JSON-parseable body/
  );
});

test('applyTransforms sets form fields incrementally', () => {
  const plan = createRequestPlan({
    method: 'POST',
    url: 'https://target.test/api',
    body: { encoding: BodyEncoding.FORM, value: { a: '1' } },
  });
  const result = applyTransforms(plan, [
    createTransform(TransformKind.SET_FORM_FIELD, { name: 'sign', value: 's' }, { source: 'p' }),
  ]);
  assert.deepEqual(result.body.value, [['a', '1'], ['sign', 's']]);
});

test('applyTransforms can rewrite method and path', () => {
  const result = applyTransforms(basePlan(), [
    createTransform(TransformKind.SET_METHOD, { method: 'post' }, { source: 'p' }),
    createTransform(TransformKind.SET_PATH, { path: '/v2/api' }, { source: 'p' }),
  ]);
  assert.equal(result.method, 'POST');
  assert.equal(new URL(result.url).pathname, '/v2/api');
});

test('createTransform requires an absolute path', () => {
  assert.throws(
    () => createTransform(TransformKind.SET_PATH, { path: 'v2' }),
    /path must start with/
  );
});

test('findTransformConflicts flags competing writes from different sources', () => {
  const conflicts = findTransformConflicts([
    createTransform(TransformKind.SET_HEADER, { name: 'x-sign', value: 'a' }, { source: 'p1' }),
    createTransform(TransformKind.SET_HEADER, { name: 'x-sign', value: 'b' }, { source: 'p2' }),
  ]);
  assert.equal(conflicts.length, 1);
  assert.equal(conflicts[0].key, 'header:x-sign');
});

test('repeated writes from a single source are not conflicts', () => {
  const conflicts = findTransformConflicts([
    createTransform(TransformKind.SET_HEADER, { name: 'x-sign', value: 'a' }, { source: 'p1' }),
    createTransform(TransformKind.SET_HEADER, { name: 'x-sign', value: 'b' }, { source: 'p1' }),
  ]);
  assert.deepEqual(conflicts, []);
});

test('append-header and merge-json-body are accumulative, never conflicting', () => {
  const conflicts = findTransformConflicts([
    createTransform(TransformKind.APPEND_HEADER, { name: 'accept', value: 'a' }, { source: 'p1' }),
    createTransform(TransformKind.APPEND_HEADER, { name: 'accept', value: 'b' }, { source: 'p2' }),
    createTransform(TransformKind.MERGE_JSON_BODY, { patch: { a: 1 } }, { source: 'p1' }),
    createTransform(TransformKind.MERGE_JSON_BODY, { patch: { b: 2 } }, { source: 'p2' }),
  ]);
  assert.deepEqual(conflicts, []);
});

test('applyTransforms rejects conflicts by default and accepts them when allowed', () => {
  const transforms = [
    createTransform(TransformKind.SET_HEADER, { name: 'x-sign', value: 'a' }, { source: 'p1' }),
    createTransform(TransformKind.SET_HEADER, { name: 'x-sign', value: 'b' }, { source: 'p2' }),
  ];
  assert.throws(
    () => applyTransforms(basePlan(), transforms),
    (error) => error.code === ProtocolErrorCode.TRANSFORM_CONFLICT
  );
  const forced = applyTransforms(basePlan(), transforms, { allowConflicts: true });
  assert.equal(getHeader(forced, 'x-sign'), 'b', 'last write wins when explicitly allowed');
});

test('applyTransforms enforces the transform count limit', () => {
  const transforms = [
    createTransform(TransformKind.SET_HEADER, { name: 'a', value: '1' }, { source: 'p' }),
    createTransform(TransformKind.SET_HEADER, { name: 'b', value: '2' }, { source: 'p' }),
  ];
  assert.throws(
    () => applyTransforms(basePlan(), transforms, { limits: { maxTransforms: 1 } }),
    (error) => error.code === ProtocolErrorCode.TRANSFORM_LIMIT_COUNT
  );
});

test('applyTransforms does not mutate the input plan', () => {
  const plan = basePlan();
  const before = plan.digest;
  applyTransforms(plan, [
    createTransform(TransformKind.SET_HEADER, { name: 'x', value: '1' }, { source: 'p' }),
  ]);
  assert.equal(plan.digest, before);
  assert.equal(getHeader(plan, 'x'), undefined);
});

test('transformed plans re-validate, blocking injection through transform values', () => {
  assert.throws(
    () => applyTransforms(basePlan(), [
      createTransform(TransformKind.SET_HEADER, { name: 'x', value: 'a\r\nEvil: 1' }, { source: 'p' }),
    ]),
    /contains CR, LF or NUL/
  );
});

// ----------------------------------------------------------------- adapter

test('defineProtocolAdapter validates id, version and plan', () => {
  assert.throws(
    () => defineProtocolAdapter({ id: 'Bad_Id', version: '1.0.0', plan: () => [] }),
    /kebab-case/
  );
  assert.throws(
    () => defineProtocolAdapter({ id: 'ok', version: 'v1', plan: () => [] }),
    /SemVer/
  );
  assert.throws(
    () => defineProtocolAdapter({ id: 'ok', version: '1.0.0' }),
    /plan must be a function/
  );
});

test('defineProtocolAdapter validates consumes entries', () => {
  assert.throws(
    () => defineProtocolAdapter({
      id: 'ok', version: '1.0.0', plan: () => [], consumes: [{}],
    }),
    /must declare "id" or "kind"/
  );
  assert.throws(
    () => defineProtocolAdapter({
      id: 'ok', version: '1.0.0', plan: () => [], consumes: [{ kind: 'bogus' }],
    }),
    /is not a known artifact kind/
  );
});

test('checkAdapterRequirements reports missing and optional requirements', () => {
  const adapter = defineProtocolAdapter({
    id: 'sig', version: '1.0.0', plan: () => [],
    consumes: [{ id: 'sign' }, { id: 'nonce', optional: true }],
  });
  const empty = checkAdapterRequirements(adapter, createArtifactSet([]));
  assert.equal(empty.satisfied, false);
  assert.equal(empty.missing.length, 1, 'optional requirement is not reported missing');
  assert.equal(
    checkAdapterRequirements(adapter, createArtifactSet([artifact()])).satisfied,
    true
  );
});

test('assertAdapterRequirements reports incompatible artifact schemas', () => {
  const adapter = defineProtocolAdapter({
    id: 'sig', version: '1.0.0', artifactSchema: '1.0', plan: () => [],
    consumes: [{ id: 'sign' }],
  });
  const set = createArtifactSet([artifact({ schemaVersion: '2.0' })]);
  assert.throws(
    () => assertAdapterRequirements(adapter, set),
    (error) => error.code === ProtocolErrorCode.PROTOCOL_SCHEMA_INCOMPATIBLE
  );
});

// ---------------------------------------------------------------- registry

function signerAdapter(id = 'signer', header = 'x-sign') {
  return defineProtocolAdapter({
    id,
    version: '1.0.0',
    consumes: [{ id: 'sign' }],
    plan: ({ artifacts }) => [
      createTransform(TransformKind.SET_HEADER, {
        name: header,
        value: artifacts.require('sign').value,
      }),
    ],
  });
}

test('registry applies adapters in registration order', () => {
  const registry = createProtocolRegistry([
    signerAdapter('first', 'x-first'),
    signerAdapter('second', 'x-second'),
  ]);
  assert.deepEqual(registry.ids(), ['first', 'second']);
  const result = registry.apply({ request: basePlan(), artifacts: createArtifactSet([artifact()]) });
  assert.equal(getHeader(result.plan, 'x-first'), 'abc');
  assert.equal(getHeader(result.plan, 'x-second'), 'abc');
});

test('registry honours an explicit adapter order', () => {
  const registry = createProtocolRegistry([
    signerAdapter('a', 'x-a'),
    signerAdapter('b', 'x-b'),
  ]);
  const result = registry.apply({
    request: basePlan(),
    artifacts: createArtifactSet([artifact()]),
    adapters: ['b'],
  });
  assert.equal(getHeader(result.plan, 'x-b'), 'abc');
  assert.equal(getHeader(result.plan, 'x-a'), undefined);
  assert.deepEqual(result.adapters.map((entry) => entry.id), ['b']);
});

test('registry rejects duplicate adapter ids', () => {
  const registry = createProtocolRegistry([signerAdapter()]);
  assert.throws(
    () => registry.register(signerAdapter()),
    (error) => error.code === ProtocolErrorCode.PROTOCOL_DUPLICATE_ID
  );
});

test('registry reports unknown adapters', () => {
  const registry = createProtocolRegistry();
  assert.throws(
    () => registry.apply({ request: basePlan(), artifacts: createArtifactSet([]), adapters: ['nope'] }),
    (error) => error.code === ProtocolErrorCode.PROTOCOL_NOT_FOUND
  );
});

test('registry attributes transforms to their producing adapter', () => {
  const registry = createProtocolRegistry([signerAdapter('signer')]);
  const result = registry.apply({
    request: basePlan(),
    artifacts: createArtifactSet([artifact()]),
  });
  assert.deepEqual(result.transforms.map((entry) => entry.source), ['signer']);
  assert.deepEqual(result.attribution, [{ adapter: 'signer', kind: TransformKind.SET_HEADER }]);
});

test('registry surfaces missing artifacts as structured diagnostics', () => {
  const registry = createProtocolRegistry([signerAdapter()]);
  assert.throws(
    () => registry.apply({ request: basePlan(), artifacts: createArtifactSet([]) }),
    (error) => {
      assert.equal(error.code, ProtocolErrorCode.ARTIFACT_NOT_FOUND);
      assert.ok(error.suggestions.length > 0);
      return true;
    }
  );
});

test('registry refuses to apply expired artifacts', () => {
  const registry = createProtocolRegistry([signerAdapter()]);
  const set = createArtifactSet([artifact({ createdAt: 1000, expiresAt: 2000 })]);
  assert.throws(
    () => registry.apply({ request: basePlan(), artifacts: set, now: 3000 }),
    (error) => error.code === ProtocolErrorCode.ARTIFACT_EXPIRED
  );
  const ok = registry.apply({ request: basePlan(), artifacts: set, now: 1500 });
  assert.equal(getHeader(ok.plan, 'x-sign'), 'abc');
});

test('registry wraps adapter failures with the adapter id', () => {
  const broken = defineProtocolAdapter({
    id: 'broken', version: '1.0.0',
    plan: () => { throw new Error('boom'); },
  });
  const registry = createProtocolRegistry([broken]);
  assert.throws(
    () => registry.apply({ request: basePlan(), artifacts: createArtifactSet([]) }),
    (error) => {
      assert.equal(error.code, ProtocolErrorCode.PROTOCOL_APPLY_FAILED);
      assert.equal(error.context.adapter, 'broken');
      return true;
    }
  );
});

test('registry rejects adapters that do not return an array', () => {
  const bad = defineProtocolAdapter({ id: 'bad', version: '1.0.0', plan: () => ({}) });
  const registry = createProtocolRegistry([bad]);
  assert.throws(
    () => registry.apply({ request: basePlan(), artifacts: createArtifactSet([]) }),
    /must return an array of transforms/
  );
});

test('registry detects cross-adapter conflicts', () => {
  const registry = createProtocolRegistry([
    signerAdapter('a', 'x-sign'),
    signerAdapter('b', 'x-sign'),
  ]);
  assert.throws(
    () => registry.apply({ request: basePlan(), artifacts: createArtifactSet([artifact()]) }),
    (error) => error.code === ProtocolErrorCode.TRANSFORM_CONFLICT
  );
});

test('registry result exposes a diff and deterministic digests', () => {
  const registry = createProtocolRegistry([signerAdapter()]);
  const args = { request: basePlan(), artifacts: createArtifactSet([artifact()]), now: 1500 };
  const first = registry.apply(args);
  const second = registry.apply(args);
  assert.equal(first.digest, second.digest);
  assert.deepEqual(first.diff, [{ field: 'header:x-sign', from: null, to: ['abc'] }]);
  assert.match(first.artifactsDigest, /^[a-f0-9]{64}$/);
  assert.match(first.transformsDigest, /^[a-f0-9]{64}$/);
});

test('registry digest changes when an artifact value changes', () => {
  const registry = createProtocolRegistry([signerAdapter()]);
  const first = registry.apply({
    request: basePlan(), artifacts: createArtifactSet([artifact({ value: 'a' })]), now: 1500,
  });
  const second = registry.apply({
    request: basePlan(), artifacts: createArtifactSet([artifact({ value: 'b' })]), now: 1500,
  });
  assert.notEqual(first.digest, second.digest);
});

test('registry accepts a plain artifact array', () => {
  const registry = createProtocolRegistry([signerAdapter()]);
  const result = registry.apply({
    request: basePlan(),
    artifacts: [serializeArtifact(artifact())],
  });
  assert.equal(getHeader(result.plan, 'x-sign'), 'abc');
});

test('registry lock is stable and covers adapter contracts', () => {
  const registry = createProtocolRegistry([signerAdapter()]);
  const lock = registry.lock();
  assert.equal(lock.adapters[0].id, 'signer');
  assert.equal(lock.adapters[0].artifactSchema, ARTIFACT_SCHEMA_VERSION);
  assert.equal(lock.digest, createProtocolRegistry([signerAdapter()]).lock().digest);
});

test('protocolResultToJSON produces a serializable audit record', () => {
  const registry = createProtocolRegistry([signerAdapter()]);
  const result = registry.apply({
    request: basePlan(), artifacts: createArtifactSet([artifact()]), now: 1500,
  });
  const json = protocolResultToJSON(result);
  assert.doesNotThrow(() => JSON.parse(JSON.stringify(json)));
  assert.equal(json.plan.method, 'GET');
  assert.equal(json.transforms[0].source, 'signer');
});

// ---------------------------------------------------------------- boundary

test('protocol layer exposes no network capability', async () => {
  const module = await import('../src/collection/request-protocol/index.js');
  const names = Object.keys(module);
  const forbidden = names.filter((name) => /fetch|request$|send|socket|http|agent|proxy/i.test(name));
  assert.deepEqual(forbidden, [], 'protocol exports must not include network primitives');
});

test('protocol source does not import network or filesystem modules', async () => {
  const { readdir, readFile } = await import('node:fs/promises');
  const directory = new URL('../src/collection/request-protocol/', import.meta.url);
  const files = (await readdir(directory)).filter((name) => name.endsWith('.js'));
  assert.ok(files.length >= 7);
  for (const file of files) {
    const source = await readFile(new URL(file, directory), 'utf8');
    const imports = [...source.matchAll(/from\s+'([^']+)'/g)].map((match) => match[1]);
    for (const specifier of imports) {
      assert.ok(
        !/^node:(http|https|net|tls|dgram|fs|child_process)/.test(specifier),
        `${file} must not import ${specifier}`
      );
    }
  }
});

test('adapter plan context exposes only request, artifacts and now', () => {
  let observed = null;
  const probe = defineProtocolAdapter({
    id: 'probe', version: '1.0.0',
    plan: (context) => { observed = Object.keys(context).sort(); return []; },
  });
  createProtocolRegistry([probe]).apply({
    request: basePlan(), artifacts: createArtifactSet([]),
  });
  assert.deepEqual(observed, ['artifacts', 'now', 'request']);
});
