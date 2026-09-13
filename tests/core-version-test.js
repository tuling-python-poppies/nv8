import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertCoreVersion,
  assertCoreVersionSatisfies,
  CORE_VERSION,
  parseCoreVersion,
  satisfiesCoreVersionRange,
} from '../src/engine/core/core-version.js';
import { createNv8, minimalPreset } from '../src/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

test('Core version is strict SemVer and is independently exposed', () => {
  assert.equal(assertCoreVersion(), CORE_VERSION);
  assert.deepEqual(parseCoreVersion('2.10.3'), { major: 2, minor: 10, patch: 3 });
  assert.throws(() => parseCoreVersion('2.10'), /major\.minor\.patch/);
  assert.throws(() => parseCoreVersion('v2.0.0'), /major\.minor\.patch/);
  assert.throws(() => parseCoreVersion('2.0.0-beta'), /major\.minor\.patch/);
});

test('Core compatibility ranges follow the documented SemVer policy', () => {
  assert.equal(satisfiesCoreVersionRange('1.4.2', '^1.0.0'), true);
  assert.equal(satisfiesCoreVersionRange('2.0.0', '^1.0.0'), false);
  assert.equal(satisfiesCoreVersionRange('1.4.2', '~1.4.0'), true);
  assert.equal(satisfiesCoreVersionRange('1.5.0', '~1.4.0'), false);
  assert.equal(satisfiesCoreVersionRange('1.4.2', '>=1.4.0'), true);
  assert.equal(satisfiesCoreVersionRange('1.4.2', 'not-a-range'), false);
});

test('an incompatible Core range returns a structured failure', () => {
  assert.throws(
    () => assertCoreVersionSatisfies('^2.0.0'),
    error => error.code === 'CORE_VERSION_UNSUPPORTED'
      && error.version === CORE_VERSION
      && error.range === '^2.0.0',
  );
});

test('Lock Plan records the Core SemVer independently of plugin versions', async () => {
  const nv8 = await createNv8({ plugins: minimalPreset, logger });
  try {
    assert.equal(nv8.lockPlan.coreVersion, CORE_VERSION);
    assert.equal(typeof nv8.lockPlan.plugins[0].version, 'string');
    assert.notEqual(nv8.lockPlan.coreVersion, nv8.lockPlan.plugins[0].version);
  } finally {
    await nv8.destroy();
  }
});
