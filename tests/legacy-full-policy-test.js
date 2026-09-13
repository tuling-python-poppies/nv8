import test from 'node:test';
import assert from 'node:assert/strict';

import { createNv8 } from '../src/index.js';
import {
  LEGACY_FULL_POLICY,
  createProfile,
  legacyFullProfile,
  validateLegacyFullPolicy,
} from '../src/config/profiles/index.js';

test('legacy-full declares an explicit compatibility maintenance policy', () => {
  assert.equal(legacyFullProfile.id, 'legacy-full');
  assert.equal(legacyFullProfile.experimental, true);
  assert.deepEqual(legacyFullProfile.maintenance, {
    policy: 'bugfix-and-parity-only',
    requiredBaselines: ['edge-behavior', 'edge-members', 'edge-surface', 'bootstrap-order'],
    pluginDrift: 'fail-closed',
  });
  const result = validateLegacyFullPolicy(legacyFullProfile);
  assert.deepEqual(result, {
    profileId: 'legacy-full',
    releasePolicy: 'bugfix-and-parity-only',
    requiredBaseline: ['edge-behavior', 'edge-members', 'edge-surface', 'bootstrap-order'],
  });
});

test('legacy-full policy rejects accidental conversion into a normal plugin profile', () => {
  assert.throws(
    () => validateLegacyFullPolicy({ ...legacyFullProfile, experimental: false }),
    /must remain explicitly experimental/,
  );
  assert.throws(
    () => validateLegacyFullPolicy({
      ...legacyFullProfile,
      config: { legacy: { compatibilityMode: false, bootstrapBehavior: 'preserve' } },
    }),
    /must preserve legacy bootstrap compatibility/,
  );
  assert.throws(
    () => validateLegacyFullPolicy({
      ...legacyFullProfile,
      maintenance: { ...legacyFullProfile.maintenance, pluginDrift: 'warn' },
    }),
    /maintenance metadata does not match/,
  );
});

test('legacy-full policy rejects removal of compatibility-critical plugins', () => {
  const plugins = legacyFullProfile.plugins.filter(({ id }) => id !== '@nv8/plugin-window');
  assert.throws(
    () => validateLegacyFullPolicy({ ...legacyFullProfile, plugins }),
    /missing required compatibility plugin @nv8\/plugin-window/,
  );
});

test('legacy-full policy is distinct from plugin coverage expectations', () => {
  assert.equal(LEGACY_FULL_POLICY.pluginDrift, 'fail-closed');
  assert.deepEqual(LEGACY_FULL_POLICY.supportedNodeMajors, [18, 20, 22, 24]);
  assert.equal(createProfile('legacy-full').id, 'legacy-full');
});

test('createNv8 validates legacy-full maintenance metadata before boot', async () => {
  await assert.rejects(
    () => createNv8({
      profile: { ...legacyFullProfile, experimental: false },
      plugins: [],
    }),
    /must remain explicitly experimental/,
  );
});
