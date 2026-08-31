import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, minimalPreset } from '../src/index.js';
import { detectHostCapabilities, hostSupports } from '../src/core/host-capabilities.js';
import { PLUGIN_LOCK_SCHEMA } from '../src/core/plugin-lock-plan.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

test('host capability probe returns stable feature IDs', () => {
  const capabilities = detectHostCapabilities();
  assert.equal(typeof capabilities.nodeVersion, 'string');
  assert.equal(typeof capabilities.v8Version, 'string');
  assert.equal(typeof capabilities.features['vm.context'], 'boolean');
  assert.equal(typeof capabilities.features['structured.clone'], 'boolean');
  assert.equal(hostSupports(capabilities, 'vm.context'), true);
});

test('createNv8 exposes a serializable plugin lock plan', async () => {
  const nv8 = await createNv8({
    plugins: minimalPreset,
    profile: { id: 'lock-test' },
    runtimeMode: 'plugin',
    logger,
  });
  try {
    assert.equal(nv8.lockPlan.schema, PLUGIN_LOCK_SCHEMA);
    assert.equal(nv8.lockPlan.runtimeMode, 'plugin');
    assert.equal(nv8.lockPlan.profile.id, 'lock-test');
    assert.match(nv8.lockPlan.digest, /^[a-f0-9]{64}$/);
    assert.deepEqual(
      JSON.parse(JSON.stringify(nv8.lockPlan)),
      nv8.lockPlan,
    );
  } finally {
    await nv8.destroy();
  }
});

test('createNv8 validates runtime mode before loading plugins', async () => {
  await assert.rejects(
    () => createNv8({ runtimeMode: 'unsupported', logger }),
    /runtimeMode must be legacy or plugin/,
  );
});

test('createNv8 rejects a stale plugin lock plan before Sandbox creation', async () => {
  await assert.rejects(
    () => createNv8({
      plugins: minimalPreset,
      pluginLockPlan: {
        schema: PLUGIN_LOCK_SCHEMA,
        digest: '0'.repeat(64),
      },
      logger,
    }),
    error => error.code === 'PLUGIN_LOCK_MISMATCH',
  );
});
