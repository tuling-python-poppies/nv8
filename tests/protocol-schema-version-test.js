import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertProtocolSchemaCompatible,
  isProtocolSchemaCompatible,
  parseProtocolSchemaVersion,
  PROTOCOL_SCHEMA_VERSION,
  createProtocolRegistry,
  defineProtocolAdapter,
  createRequestPlan,
  createArtifactSet,
  protocolResultToJSON,
} from '../src/collection/request-protocol/index.js';

test('Protocol schema uses strict major.minor versions', () => {
  assert.equal(PROTOCOL_SCHEMA_VERSION, '1.0');
  assert.deepEqual(parseProtocolSchemaVersion('2.3'), { major: 2, minor: 3 });
  assert.throws(() => parseProtocolSchemaVersion('1'), /major\.minor/);
  assert.throws(() => parseProtocolSchemaVersion('1.0.0'), /major\.minor/);
  assert.throws(() => parseProtocolSchemaVersion('v1.0'), /major\.minor/);
});

test('older same-major Protocol schema is consumable, future and major changes are not', () => {
  assert.equal(isProtocolSchemaCompatible('1.0', '1.2'), true);
  assert.equal(isProtocolSchemaCompatible('1.2', '1.0'), false);
  assert.equal(isProtocolSchemaCompatible('2.0', '1.0'), false);
  assert.equal(assertProtocolSchemaCompatible('1.0', '1.2'), '1.0');
  assert.throws(
    () => assertProtocolSchemaCompatible('2.0', '1.0'),
    error => error.code === 'PROTOCOL_SCHEMA_UNSUPPORTED',
  );
});

test('Protocol registry and audit snapshots identify their schema version', () => {
  const adapter = defineProtocolAdapter({
    id: 'schema-version',
    version: '1.0.0',
    plan: () => [],
  });
  const registry = createProtocolRegistry([adapter]);
  const lock = registry.lock();
  assert.equal(lock.schemaVersion, PROTOCOL_SCHEMA_VERSION);
  const result = registry.apply({
    request: createRequestPlan({ method: 'GET', url: 'https://target.test/' }),
    artifacts: createArtifactSet([]),
  });
  assert.equal(result.schemaVersion, PROTOCOL_SCHEMA_VERSION);
  assert.equal(protocolResultToJSON(result).schemaVersion, PROTOCOL_SCHEMA_VERSION);
});
