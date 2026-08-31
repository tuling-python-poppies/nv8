/**
 * 核心系统测试
 * 
 * 测试 Plugin SDK、App、Sandbox、Realm 的基础功能。
 */

import { strict as assert } from 'assert';
import {
  definePlugin,
  CapabilityRegistry,
  StateRegistry,
  checkDependencies,
  resolveDependencyOrder,
  matchesVersionRange,
  compareSemver,
} from '../plugin-sdk/index.js';
import { createApp } from '../app.js';
import { RealmFactory, RealmType } from '../realm-factory.js';

// ============================================================
// Plugin SDK 测试
// ============================================================

console.log('🧪 Testing Plugin SDK...\n');

// 测试 1: definePlugin
console.log('Test 1: definePlugin - 基础定义');
const testPlugin = definePlugin({
  id: 'test-plugin',
  version: '1.0.0',
  description: 'Test plugin',
  requires: [],
  provides: [
    { name: 'test-capability', version: '1.0.0' }
  ],
  supports: {
    realms: ['root', 'iframe'],
  },
  install: (context) => {
    context.state.set('test-installed', true);
  },
});

assert.equal(testPlugin.id, 'test-plugin');
assert.equal(testPlugin.version, '1.0.0');
assert.equal(testPlugin.provides.length, 1);
console.log('✅ Plugin definition works\n');

// 测试 2: CapabilityRegistry
console.log('Test 2: CapabilityRegistry - 能力注册和查询');
const registry = new CapabilityRegistry();

registry.register('webidl', '1.0.0', 'webidl-plugin', {});
registry.register('webidl', '2.0.0', 'webidl-plugin-v2', {});
registry.register('dom', '1.0.0', 'dom-plugin', {});

assert.equal(registry.has('webidl'), true);
assert.equal(registry.has('webidl', '1.0.0'), true);
assert.equal(registry.has('webidl', '^1.0.0'), true);
assert.equal(registry.has('webidl', '^2.0.0'), true);
assert.equal(registry.has('nonexistent'), false);

const capability = registry.get('webidl');
assert.equal(capability.version, '2.0.0'); // 应该返回最高版本

console.log('✅ CapabilityRegistry works\n');

// 测试 3: StateRegistry
console.log('Test 3: StateRegistry - 分层状态管理');
const state = new StateRegistry();

state.set('global-config', { trace: true }, 'sandbox');
state.set('document-title', 'Test Page', 'page');
state.set('screen-width', 1920, 'realm');

assert.equal(state.get('global-config', 'sandbox').trace, true);
assert.equal(state.get('document-title', 'page'), 'Test Page');
assert.equal(state.get('screen-width', 'realm'), 1920);

assert.equal(state.has('global-config', 'sandbox'), true);
assert.equal(state.has('nonexistent', 'realm'), false);

const snapshot = state.snapshot();
assert.equal(snapshot.sandbox['global-config'].trace, true);
assert.equal(snapshot.page['document-title'], 'Test Page');
assert.equal(snapshot.realm['screen-width'], 1920);

console.log('✅ StateRegistry works\n');

// 测试 4: checkDependencies
console.log('Test 4: checkDependencies - 依赖检查');
const plugin1 = definePlugin({
  id: 'plugin-a',
  version: '1.0.0',
  requires: ['webidl@^1.0.0'],
  provides: [{ name: 'feature-a', version: '1.0.0' }],
  install: () => {},
});

const plugin2 = definePlugin({
  id: 'plugin-b',
  version: '1.0.0',
  requires: ['feature-a@^1.0.0'],
  provides: [{ name: 'feature-b', version: '1.0.0' }],
  install: () => {},
});

const depRegistry = new CapabilityRegistry();
depRegistry.register('webidl', '1.0.0', 'webidl-plugin', {});
depRegistry.register('feature-a', '1.0.0', 'plugin-a', {});

const check1 = checkDependencies(plugin1.requires, depRegistry);
assert.equal(check1.satisfied, true);
assert.equal(check1.missing.length, 0);

const check2 = checkDependencies(plugin2.requires, depRegistry);
assert.equal(check2.satisfied, true);

console.log('✅ Dependency checking works\n');

// 测试 5: resolveDependencyOrder
console.log('Test 5: resolveDependencyOrder - 依赖排序');
const basePlugin = definePlugin({
  id: 'base',
  version: '1.0.0',
  requires: [],
  provides: [{ name: 'base-api', version: '1.0.0' }],
  install: () => {},
});

const dependentPlugin = definePlugin({
  id: 'dependent',
  version: '1.0.0',
  requires: ['base-api@1.0.0'],
  provides: [{ name: 'dependent-api', version: '1.0.0' }],
  install: () => {},
});

const ordered = resolveDependencyOrder([dependentPlugin, basePlugin]);
assert.equal(ordered[0].id, 'base'); // base 应该在前
assert.equal(ordered[1].id, 'dependent');

console.log('✅ Dependency resolution works\n');

// 测试 6: Semver 匹配
console.log('Test 6: matchesVersionRange - Semver 版本匹配');
assert.equal(matchesVersionRange('1.2.3', '*'), true);
assert.equal(matchesVersionRange('1.2.3', '1.2.3'), true);
assert.equal(matchesVersionRange('1.2.3', '^1.0.0'), true);
assert.equal(matchesVersionRange('1.2.3', '^1.2.0'), true);
assert.equal(matchesVersionRange('1.2.3', '~1.2.0'), true);
assert.equal(matchesVersionRange('1.2.3', '>=1.0.0'), true);
assert.equal(matchesVersionRange('1.2.3', '>1.0.0'), true);
assert.equal(matchesVersionRange('1.2.3', '^2.0.0'), false);
assert.equal(matchesVersionRange('1.2.3', '~1.3.0'), false);

assert.equal(compareSemver('1.0.0', '2.0.0'), -1);
assert.equal(compareSemver('2.0.0', '1.0.0'), 1);
assert.equal(compareSemver('1.2.3', '1.2.3'), 0);

console.log('✅ Semver matching works\n');

// ============================================================
// App & Sandbox 测试
// ============================================================

console.log('🧪 Testing App & Sandbox...\n');

// 测试 7: 创建 App
console.log('Test 7: createApp - 创建应用实例');
const app = createApp({ trace: false });

assert.equal(app.getPlugins().length, 0);
assert.equal(app.getProfiles().length, 0);
console.log('✅ App creation works\n');

// 测试 8: 注册插件
console.log('Test 8: registerPlugin - 注册插件');
const demoPlugin = definePlugin({
  id: 'demo',
  version: '1.0.0',
  provides: [{ name: 'demo-api', version: '1.0.0' }],
  install: (context) => {
    context.state.set('demo-loaded', true);
  },
});

app.registerPlugin(demoPlugin);
assert.equal(app.getPlugins().length, 1);
console.log('✅ Plugin registration works\n');

// 测试 9: 注册 Profile
console.log('Test 9: registerProfile - 注册配置文件');
app.registerProfile({
  id: 'basic',
  description: 'Basic profile for testing',
  plugins: ['demo@1.0.0'],
});

const profile = app.getProfile('basic');
assert.equal(profile.id, 'basic');
assert.equal(profile.plugins.length, 1);
console.log('✅ Profile registration works\n');

// 测试 10: 创建 Sandbox
console.log('Test 10: createSandbox - 创建沙箱');
const sandbox = await app.createSandbox({
  profile: 'basic',
  trace: false,
});

assert.equal(sandbox.id, 'sandbox-1');
assert.equal(sandbox.plugins.length, 1);
console.log('✅ Sandbox creation works\n');

// 测试 11: 检查能力
console.log('Test 11: Capability checking in Sandbox');
assert.equal(sandbox.hasCapability('demo-api'), true);
assert.equal(sandbox.hasCapability('nonexistent'), false);

const cap = sandbox.getCapability('demo-api');
assert.equal(cap.version, '1.0.0');
assert.equal(cap.plugin, 'demo');
console.log('✅ Capability checking works\n');

// 测试 12: 状态访问
console.log('Test 12: State access in Sandbox');
assert.equal(sandbox.state.get('demo-loaded'), true);
console.log('✅ State access works\n');

// 测试 13: 创建 Realm
console.log('Test 13: createRealm - 创建执行环境');
const realm = await sandbox.createRealm({ type: 'root' });

assert.equal(realm.type, 'root');
assert.equal(realm.sandbox, sandbox);
assert.equal(realm.isDestroyed(), false);
console.log('✅ Realm creation works\n');

// 测试 14: 销毁
console.log('Test 14: Cleanup - 销毁 Realm 和 Sandbox');
await realm.destroy();
assert.equal(realm.isDestroyed(), true);

await app.destroySandbox(sandbox.id);
assert.equal(app.getSandboxes().length, 0);
console.log('✅ Cleanup works\n');

// ============================================================
// 总结
// ============================================================

console.log('━'.repeat(60));
console.log('✨ All tests passed!');
console.log('━'.repeat(60));
console.log('');
console.log('Core system is ready for plugin development!');
console.log('');
console.log('Next steps:');
console.log('  1. Implement webidl-foundation plugin');
console.log('  2. Test with real bootstrap code');
console.log('  3. Implement remaining 13 plugins');
