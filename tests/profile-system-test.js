/**
 * Profile System Tests
 * 
 * 测试 Profile 创建、验证、Lock Plan 生成等功能
 */

import { strict as assert } from 'node:assert';
import { createProfile, generateProfileLockPlan, validateLockPlan } from '../src/profiles/profile-factory.js';
import { createProfileRegistry } from '../src/profiles/profile-registry.js';
import {
  minimalProfile,
  minimalFetchProfile,
  domReplayProfile,
  legacyFullProfile,
  browserProfileForEdgeVersion150,
} from '../src/profiles/built-in-profiles.js';
import {
  webidlPlugin,
  errorsPlugin,
  builtinsPlugin,
  consolePlugin,
  eventsPlugin,
  domExceptionPlugin,
  streamsPlugin,
  encodingPlugin,
  urlPlugin,
  abortPlugin,
  fetchPlugin,
} from '../src/plugins/index.js';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 Profile System Tests');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test 1: Create basic profile
console.log('Test 1: Create basic profile');
const testProfile = createProfile({
  id: 'test-profile',
  version: '1.0.0',
  name: 'Test Profile',
  description: 'A test profile',
  plugins: [
    { id: '@nv8/plugin-webidl', range: '>=1.0.0' },
    { id: '@nv8/plugin-console', range: '>=1.0.0' },
  ],
  nodeSupport: {
    minimum: '18.18.0',
    tested: ['18.18.0', '20.0.0'],
  },
});

assert.equal(testProfile.id, 'test-profile');
assert.equal(testProfile.version, '1.0.0');
assert.equal(testProfile.plugins.length, 2);
console.log('✅ Basic profile creation works\n');

// Test 2: Profile extension
console.log('Test 2: Profile extension');
const extendedProfile = testProfile.withPlugins([
  { id: '@nv8/plugin-fetch', range: '>=1.0.0' },
]);

assert.equal(extendedProfile.plugins.length, 3);
assert.equal(extendedProfile.plugins[2].id, '@nv8/plugin-fetch');
console.log('✅ Profile extension works\n');

// Test 3: Profile Registry
console.log('Test 3: Profile Registry');
const registry = createProfileRegistry();

registry.register(minimalProfile);
registry.register(minimalFetchProfile);
registry.register(domReplayProfile);

const found = registry.find('minimal');
assert.equal(found.id, 'minimal');
assert.equal(found.version, '1.0.0');

const notFound = registry.find('non-existent');
assert.equal(notFound, null);

const stats = registry.getStats();
assert.equal(stats.profileCount, 3);
console.log('✅ Profile registry works\n');

// Test 4: Generate Lock Plan
console.log('Test 4: Generate Lock Plan');
const availablePlugins = new Map();
availablePlugins.set('@nv8/plugin-webidl', [webidlPlugin]);
availablePlugins.set('@nv8/plugin-errors', [errorsPlugin]);
availablePlugins.set('@nv8/plugin-builtins', [builtinsPlugin]);
availablePlugins.set('@nv8/plugin-console', [consolePlugin]);
availablePlugins.set('@nv8/plugin-events', [eventsPlugin]);
availablePlugins.set('@nv8/plugin-dom-exception', [domExceptionPlugin]);
availablePlugins.set('@nv8/plugin-streams', [streamsPlugin]);
availablePlugins.set('@nv8/plugin-encoding', [encodingPlugin]);
availablePlugins.set('@nv8/plugin-url', [urlPlugin]);
availablePlugins.set('@nv8/plugin-abort', [abortPlugin]);
availablePlugins.set('@nv8/plugin-fetch', [fetchPlugin]);

const hostCapabilities = {
  'vm.context': true,
  'worker.thread': true,
};

const lockPlan = generateProfileLockPlan(
  minimalProfile,
  availablePlugins,
  hostCapabilities
);

assert.equal(lockPlan.profileId, 'minimal');
assert.equal(lockPlan.profileVersion, '1.0.0');
assert.ok(lockPlan.plugins.length > 0);
assert.ok(lockPlan.digest);
assert.equal(lockPlan.digest.length, 64); // SHA-256 hex
console.log(`  Profile: ${lockPlan.profileId}@${lockPlan.profileVersion}`);
console.log(`  Plugins: ${lockPlan.plugins.length}`);
console.log(`  Digest: ${lockPlan.digest.substring(0, 16)}...`);
console.log('✅ Lock plan generation works\n');

// Test 5: Validate Lock Plan
console.log('Test 5: Validate Lock Plan');
const currentHost = {
  nodeVersion: process.versions.node,
  v8Version: process.versions.v8,
  features: hostCapabilities,
};

const validation = validateLockPlan(lockPlan, currentHost);
assert.equal(validation.valid, true);
assert.equal(validation.errors.length, 0);
console.log(`  Valid: ${validation.valid}`);
console.log(`  Errors: ${validation.errors.length}`);
console.log(`  Warnings: ${validation.warnings.length}`);
console.log('✅ Lock plan validation works\n');

// Test 6: Detect tampered Lock Plan
console.log('Test 6: Detect tampered Lock Plan');
const tamperedLockPlan = {
  ...lockPlan,
  plugins: [...lockPlan.plugins, { id: 'fake-plugin', version: '1.0.0', provides: [], installOrder: 999 }],
  // digest 未更新，会导致验证失败
};

const tamperedValidation = validateLockPlan(tamperedLockPlan, currentHost);
assert.equal(tamperedValidation.valid, false);
assert.ok(tamperedValidation.errors.length > 0);
assert.ok(tamperedValidation.errors[0].includes('digest mismatch'));
console.log('✅ Tampered lock plan detection works\n');

// Test 7: Built-in Profiles
console.log('Test 7: Built-in Profiles');
const profiles = [
  minimalProfile,
  minimalFetchProfile,
  domReplayProfile,
  legacyFullProfile,
  browserProfileForEdgeVersion150,
];

for (const profile of profiles) {
  assert.ok(profile.id);
  assert.ok(profile.version);
  assert.ok(profile.name);
  assert.ok(Array.isArray(profile.plugins));
  console.log(`  ✓ ${profile.id}: ${profile.plugins.length} plugins`);
}
console.log('✅ All built-in profiles are valid\n');

// Test 8: Profile with config overrides
console.log('Test 8: Profile with config overrides');
const profileWithConfig = minimalProfile.withConfig({
  customSetting: 'test-value',
  nestedConfig: {
    key: 'value',
  },
});

assert.equal(profileWithConfig.config.customSetting, 'test-value');
assert.equal(profileWithConfig.config.nestedConfig.key, 'value');
console.log('✅ Profile config overrides work\n');

// Test 9: Profile lock plan caching
console.log('Test 9: Profile lock plan caching');
const registryWithCache = createProfileRegistry();
registryWithCache.register(minimalProfile);

const lockPlan1 = registryWithCache.generateLockPlan(
  minimalProfile,
  availablePlugins,
  hostCapabilities
);

const lockPlan2 = registryWithCache.generateLockPlan(
  minimalProfile,
  availablePlugins,
  hostCapabilities
);

// 应该返回同一个对象（缓存）
assert.equal(lockPlan1, lockPlan2);
assert.equal(registryWithCache.getStats().cachedLockPlans, 1);
console.log('✅ Lock plan caching works\n');

// Test 10: Profile metadata
console.log('Test 10: Profile metadata');
assert.equal(browserProfileForEdgeVersion150.metadata.browserFamily, 'edge');
assert.equal(browserProfileForEdgeVersion150.metadata.browserVersion, 150);
assert.equal(browserProfileForEdgeVersion150.metadata.platform, 'windows');
assert.ok(browserProfileForEdgeVersion150.config.navigator);
assert.ok(browserProfileForEdgeVersion150.config.navigator.userAgent.includes('Edg/150'));
console.log('✅ Profile metadata works\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ All Profile System tests passed!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Verified functionality:');
console.log('  ✓ Profile creation and validation');
console.log('  ✓ Profile extension and composition');
console.log('  ✓ Profile registry and lookup');
console.log('  ✓ Lock plan generation and digest computation');
console.log('  ✓ Lock plan validation and tampering detection');
console.log('  ✓ Built-in profiles (5 profiles)');
console.log('  ✓ Config overrides');
console.log('  ✓ Lock plan caching');
console.log('  ✓ Browser metadata and fingerprinting');
console.log('\n🎯 Profile System is production-ready!');
