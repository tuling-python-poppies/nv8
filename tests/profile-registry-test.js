import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, createProfile, profiles } from '../src/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

test('profiles expose stable schema and digest', () => {
  const profile = createProfile('legacy-full');
  assert.equal(profile.schema, 'nv8.profile/v1');
  assert.equal(profile.id, 'legacy-full');
  assert.equal(profile.experimental, true);
  assert.match(profile.digest, /^[a-f0-9]{64}$/);
  assert.ok(Array.isArray(profile.plugins));
  assert.ok(profiles['minimal-fetch']);
});

test('custom profiles inherit and override configuration', () => {
  const profile = createProfile({
    base: 'minimal-fetch',
    id: 'custom-fetch',
    timing: { timeOrigin: 12 },
  });
  assert.equal(profile.id, 'custom-fetch');
  assert.deepEqual(profile.timing, { timeOrigin: 12 });
  assert.ok(profile.plugins.length > 0);
  assert.match(profile.digest, /^[a-f0-9]{64}$/);
});

test('createNv8 accepts a profile id', async () => {
  const nv8 = await createNv8({
    profileId: 'minimal-fetch',
    logger,
  });
  try {
    assert.equal(nv8.sandbox.profile.id, 'minimal-fetch');
    assert.equal(nv8.lockPlan.profile.id, 'minimal-fetch');
  } finally {
    await nv8.destroy();
  }
});
