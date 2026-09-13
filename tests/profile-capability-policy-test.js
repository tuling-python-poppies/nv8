import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PROFILE_CAPABILITY_POLICIES,
  createNv8,
  createProfile,
  resolveProfileCapabilities,
} from '../src/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

function host(capabilities) {
  return {
    nodeVersion: '24.20.0',
    capabilities,
    features: Object.fromEntries(
      Object.entries(capabilities).map(([id, record]) => [id, record.status === 'available']),
    ),
  };
}

test('required capabilities fail before Realm creation', () => {
  const profile = createProfile({
    id: 'requires-vm',
    plugins: [],
    requiredCapabilities: ['vm.missing'],
  });
  assert.throws(
    () => resolveProfileCapabilities(profile, host({
      'vm.missing': { status: 'unavailable', reason: 'not installed' },
    })),
    error => error.code === 'PROFILE_CAPABILITY_UNAVAILABLE'
      && error.context.problems[0].required === true
      && error.context.problems[0].status === 'unavailable',
  );
});

test('optional broken capabilities produce explicit degradations', () => {
  const profile = createProfile({
    id: 'optional-vm',
    plugins: [],
    optionalCapabilities: ['vm.optional'],
    degradations: [{
      capability: 'vm.optional',
      behavior: 'feature returns a controlled fallback',
      reason: 'host probe failed',
    }],
  });
  const result = resolveProfileCapabilities(profile, host({
    'vm.optional': { status: 'broken', reason: 'probe threw' },
  }));
  assert.deepEqual(result.degradations, [{
    capability: 'vm.optional',
    status: 'broken',
    behavior: 'feature returns a controlled fallback',
    reason: 'host probe failed',
  }]);
});

test('strict policy turns optional degradation into a startup error', () => {
  const profile = createProfile({ id: 'strict', plugins: [], optionalCapabilities: ['vm.optional'] });
  assert.throws(
    () => resolveProfileCapabilities(profile, host({
      'vm.optional': { status: 'unavailable', reason: 'missing' },
    }), { policy: PROFILE_CAPABILITY_POLICIES.STRICT }),
    error => error.code === 'PROFILE_CAPABILITY_UNAVAILABLE'
      && error.context.problems[0].required === false,
  );
});

test('available optional capabilities do not create degradation records', () => {
  const profile = createProfile({ id: 'available', plugins: [], optionalCapabilities: ['vm.context'] });
  const result = resolveProfileCapabilities(profile, host({
    'vm.context': { status: 'available', reason: null },
  }));
  assert.deepEqual(result.degradations, []);
});

test('createNv8 exposes the capability resolution result', async () => {
  const nv8 = await createNv8({
    profile: {
      id: 'host-aware',
      plugins: [],
      optionalCapabilities: ['definitely-not-a-host-capability'],
    },
    logger,
  });
  try {
    assert.equal(nv8.capabilityResolution.degradations.length, 1);
    assert.equal(nv8.capabilityResolution.degradations[0].status, 'unavailable');
  } finally {
    await nv8.destroy();
  }
});

test('createNv8 rejects required host capabilities before sandbox creation', async () => {
  await assert.rejects(
    createNv8({
      profile: {
        id: 'host-required',
        plugins: [],
        requiredCapabilities: ['definitely-not-a-host-capability'],
      },
      logger,
    }),
    error => error.code === 'PROFILE_CAPABILITY_UNAVAILABLE',
  );
});
