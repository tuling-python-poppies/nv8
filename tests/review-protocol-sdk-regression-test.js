import assert from 'node:assert/strict';
import test from 'node:test';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';
import { normalizeRuntimeOptions } from '../src/public/edge-runtime-options.js';
import { drainWorkerThreadPool } from '../src/backend/controller/worker-thread-pool.js';
import { encodeValue } from '../src/backend/protocol/value-encoder.js';
import { encodeFrame, encodeFramedValue } from '../src/backend/protocol/frame-writer.js';
import { createApp } from '../src/engine/core/app.js';
import { resolvePluginDependencies, validateDependencies } from '../src/engine/plugin-sdk/capability-matcher.js';
import { satisfiesVersionRange } from '../src/engine/plugin-sdk/define-plugin.js';
import { satisfiesCoreVersionRange } from '../src/engine/core/core-version.js';
import { createPluginRegistry } from '../src/engine/core/plugin-registry.js';

const MiB = 1024 * 1024;
test.after(() => drainWorkerThreadPool());

test('framed encoding counts only payload bytes at the exact limit', () => {
  const limits = { maxPayloadBytes: 1024, maxStringBytes: 2048 };
  const value = 'x'.repeat(1019);
  assert.equal(encodeValue(value, limits).length, 1024);
  assert.deepEqual(encodeFramedValue(2, 1, value, limits), encodeFrame(2, 1, encodeValue(value, limits), limits));
  assert.throws(() => encodeFramedValue(2, 1, value + 'x', limits), e => e.code === 'LIMIT_PAYLOAD_BYTES');
});

test('public options retain and validate every configurable value limit', () => {
  const limits = { maxStringBytes: 16*MiB, maxBytesLength: 8*MiB, maxArrayLength: 1000, maxFieldCount: 1000 };
  const normalized = normalizeRuntimeOptions({ limits }).limits;
  for (const [key, value] of Object.entries(limits)) {
    assert.equal(normalized[key], value);
    assert.throws(() => normalizeRuntimeOptions({ limits: { [key]: -1 } }), RangeError);
  }
});

for (const backend of ['child-process', 'worker-thread']) {
  test(`public large INIT and string output succeed with negotiated limits (${backend})`, { timeout: 30000 }, async () => {
    const sandbox = await EdgeSandbox.create({ execution: { backend },
      replay: [0, 1, 2].map(i => ({ url: `https://fixture.test/${i}`, body: 'x'.repeat(3*MiB) })),
      limits: { timeoutMs: 15000, maxPayloadBytes: 16*MiB, maxStringBytes: 8*MiB, maxBytesLength: 8*MiB, maxOutputBytes: 8*MiB },
    });
    try {
      assert.equal((await sandbox.evaluate(`'x'.repeat(${5*MiB})`)).value.length, 5*MiB);
      assert.equal((await sandbox.evaluate('6*7')).value, 42);
    } finally { await sandbox.close(); }
  });
}

test('pooled thread renegotiates limits for its next tenant', { timeout: 30000 }, async () => {
  const first = await EdgeSandbox.create({ execution: { backend: 'worker-thread' }, limits: { timeoutMs: 15000, maxStringBytes: 4096 } });
  await first.close();
  const second = await EdgeSandbox.create({ execution: { backend: 'worker-thread' }, limits: { timeoutMs: 15000, maxStringBytes: 8*MiB, maxOutputBytes: 8*MiB } });
  try { assert.equal((await second.evaluate(`'x'.repeat(${5*MiB})`)).value.length, 5*MiB); }
  finally { await second.close(); }
});

test('raw strings and normalized dependencies share SDK validation semantics', async () => {
  const plugins = [
    { id: 'a', version: '1.0.0', requires: ['b'], provides: ['a-cap'], install() {} },
    { id: 'b', version: '1.0.0', requires: [], provides: ['b-cap'], install() {} },
  ];
  assert.equal(validateDependencies(plugins).valid, true);
  assert.deepEqual(resolvePluginDependencies(['a'], plugins).plugins.map(p => p.id), ['b', 'a']);
  assert.deepEqual(plugins[0].requires, ['b'], 'normalization must not mutate caller input');
  const app = createApp({ trace: false });
  try {
    app.registerPlugins(plugins);
    app.registerProfile({ id: 'raw-review', plugins: ['a'] });
    const sandbox = await app.createSandbox({ profile: 'raw-review', trace: false });
    assert.equal((await sandbox.createRealm()).evaluate('1+1'), 2);
  } finally { await app.destroy(); }
});

test('raw capability names containing dots resolve like normalized capabilities', () => {
  const plugins = [
    { id: 'provider', version: '1.0.0', requires: [], provides: ['feature.base'] },
    { id: 'consumer', version: '1.0.0', requires: ['feature.base'], provides: [] },
  ];
  assert.equal(validateDependencies(plugins).valid, true);
  assert.deepEqual(resolvePluginDependencies(['consumer'], plugins).plugins.map(p => p.id), ['provider', 'consumer']);
});

test('caret ranges respect the first nonzero component in SDK and Core', () => {
  for (const [version, range, expected] of [
    ['0.9.0', '^0.2.3', false], ['0.2.4', '^0.2.3', true], ['0.2.2', '^0.2.3', false],
    ['0.0.4', '^0.0.3', false], ['0.0.3', '^0.0.3', true], ['1.9.0', '^1.2.3', true],
  ]) {
    assert.equal(satisfiesVersionRange(version, range), expected);
    assert.equal(satisfiesCoreVersionRange(version, range), expected);
  }
  const registry = createPluginRegistry();
  registry.register({ id: 'a', version: '1.0.0', requires: ['b@^0.2.3'], install() {} });
  registry.register({ id: 'b', version: '0.9.0', install() {} });
  assert.throws(() => registry.resolve(), e => e.code === 'DEPENDENCY_VERSION_MISMATCH');
});
