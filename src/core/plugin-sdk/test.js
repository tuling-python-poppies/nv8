/**
 * Plugin SDK 测试套件
 * 
 * 测试所有 Plugin SDK 核心功能
 */

import { strict as assert } from 'assert';
import {
  definePlugin,
  parseVersionRange,
  satisfiesVersionRange,
  compareVersions,
  resolvePluginDependencies,
  validateDependencies,
  buildCapabilityIndex,
  canRunInRealm,
  hasCapability,
  createStateRegistry,
  createStateAccessor,
} from '../plugin-sdk/index.js';

console.log('🧪 Testing Plugin SDK...\n');

// ============================================================
// Test 1: definePlugin - 基本定义
// ============================================================

console.log('Test 1: definePlugin - basic definition');

const plugin1 = definePlugin({
  id: 'test-plugin',
  version: '1.0.0',
  description: 'Test plugin',
  install(context) {
    context.exports.hello = () => 'world';
  },
});

assert.equal(plugin1.id, 'test-plugin');
assert.equal(plugin1.version, '1.0.0');
assert.equal(plugin1.description, 'Test plugin');
assert.equal(typeof plugin1.install, 'function');
assert.equal(plugin1.requires.length, 0);
assert.equal(plugin1.provides.length, 0);
console.log('✅ Basic plugin definition works\n');

// ============================================================
// Test 2: definePlugin - 依赖和能力
// ============================================================

console.log('Test 2: definePlugin - requires and provides');

const plugin2 = definePlugin({
  id: 'plugin-with-deps',
  version: '2.0.0',
  requires: ['test-plugin@^1.0.0', 'another-plugin'],
  provides: [
    { name: 'feature-a', version: '1.0.0' },
    'feature-b', // 简写格式
  ],
  install(context) {},
});

assert.equal(plugin2.requires.length, 2);
assert.equal(plugin2.requires[0].id, 'test-plugin');
assert.equal(plugin2.requires[0].version, '^1.0.0');
assert.equal(plugin2.requires[1].id, 'another-plugin');
assert.equal(plugin2.requires[1].version, '*');

assert.equal(plugin2.provides.length, 2);
assert.equal(plugin2.provides[0].name, 'feature-a');
assert.equal(plugin2.provides[0].version, '1.0.0');
assert.equal(plugin2.provides[1].name, 'feature-b');
assert.equal(plugin2.provides[1].version, '1.0.0'); // 默认值
console.log('✅ Dependencies and capabilities work\n');

// ============================================================
// Test 3: definePlugin - 验证
// ============================================================

console.log('Test 3: definePlugin - validation');

try {
  definePlugin({
    id: 'InvalidID', // 应该是 kebab-case
    version: '1.0.0',
    install() {},
  });
  assert.fail('Should reject invalid plugin ID');
} catch (e) {
  assert.equal(e.message.includes('kebab-case'), true);
}

try {
  definePlugin({
    id: 'valid-id',
    version: 'not-semver', // 无效的版本号
    install() {},
  });
  assert.fail('Should reject invalid version');
} catch (e) {
  assert.equal(e.message.includes('semver'), true);
}

try {
  definePlugin({
    id: 'valid-id',
    version: '1.0.0',
    // 缺少 install
  });
  assert.fail('Should require install function');
} catch (e) {
  assert.equal(e.message.includes('install'), true);
}

console.log('✅ Validation works\n');

// ============================================================
// Test 4: 版本比较和范围匹配
// ============================================================

console.log('Test 4: Version comparison and range matching');

// compareVersions
assert.equal(compareVersions('1.0.0', '1.0.0'), 0);
assert.equal(compareVersions('1.0.1', '1.0.0'), 1);
assert.equal(compareVersions('1.0.0', '1.0.1'), -1);
assert.equal(compareVersions('2.0.0', '1.9.9'), 1);

// parseVersionRange
const range1 = parseVersionRange('*');
assert.equal(range1.type, 'any');

const range2 = parseVersionRange('^1.0.0');
assert.equal(range2.type, 'caret');
assert.equal(range2.version, '1.0.0');

const range3 = parseVersionRange('~1.2.3');
assert.equal(range3.type, 'tilde');
assert.equal(range3.version, '1.2.3');

// satisfiesVersionRange
assert.equal(satisfiesVersionRange('1.0.0', '*'), true);
assert.equal(satisfiesVersionRange('1.0.0', '1.0.0'), true);
assert.equal(satisfiesVersionRange('1.0.1', '1.0.0'), false);

assert.equal(satisfiesVersionRange('1.5.0', '^1.0.0'), true);
assert.equal(satisfiesVersionRange('1.0.0', '^1.0.0'), true);
assert.equal(satisfiesVersionRange('2.0.0', '^1.0.0'), false);

assert.equal(satisfiesVersionRange('1.2.5', '~1.2.3'), true);
assert.equal(satisfiesVersionRange('1.3.0', '~1.2.3'), false);

assert.equal(satisfiesVersionRange('2.0.0', '>=1.5.0'), true);
assert.equal(satisfiesVersionRange('1.4.0', '>=1.5.0'), false);

console.log('✅ Version handling works\n');

// ============================================================
// Test 5: 能力索引
// ============================================================

console.log('Test 5: Capability index');

const pluginA = definePlugin({
  id: 'plugin-a',
  version: '1.0.0',
  provides: [{ name: 'cap-x', version: '1.0.0' }],
  install() {},
});

const pluginB = definePlugin({
  id: 'plugin-b',
  version: '1.0.0',
  provides: [{ name: 'cap-y', version: '2.0.0' }],
  install() {},
});

const index = buildCapabilityIndex([pluginA, pluginB]);
assert.equal(index.size, 2);
assert.equal(index.get('cap-x')[0].plugin, pluginA);
assert.equal(index.get('cap-y')[0].plugin, pluginB);

assert.equal(hasCapability(pluginA, 'cap-x'), true);
assert.equal(hasCapability(pluginA, 'cap-y'), false);
assert.equal(hasCapability(pluginB, 'cap-y', '^2.0.0'), true);

console.log('✅ Capability indexing works\n');

// ============================================================
// Test 6: 依赖解析
// ============================================================

console.log('Test 6: Dependency resolution');

const pluginBase = definePlugin({
  id: 'base',
  version: '1.0.0',
  provides: [{ name: 'base-api', version: '1.0.0' }],
  install() {},
});

const pluginMiddle = definePlugin({
  id: 'middle',
  version: '1.0.0',
  requires: ['base@^1.0.0'],
  provides: [{ name: 'middle-api', version: '1.0.0' }],
  install() {},
});

const pluginTop = definePlugin({
  id: 'top',
  version: '1.0.0',
  requires: ['middle@^1.0.0'],
  install() {},
});

const resolved = resolvePluginDependencies(
  ['top@1.0.0'],
  [pluginBase, pluginMiddle, pluginTop]
);

assert.equal(resolved.count, 3);
assert.equal(resolved.plugins[0], pluginBase); // 先安装依赖
assert.equal(resolved.plugins[1], pluginMiddle);
assert.equal(resolved.plugins[2], pluginTop); // 最后安装顶层

console.log('✅ Dependency resolution works\n');

// ============================================================
// Test 7: 循环依赖检测
// ============================================================

console.log('Test 7: Circular dependency detection');

const pluginCircA = definePlugin({
  id: 'circ-a',
  version: '1.0.0',
  requires: ['circ-b@1.0.0'],
  install() {},
});

const pluginCircB = definePlugin({
  id: 'circ-b',
  version: '1.0.0',
  requires: ['circ-a@1.0.0'],
  install() {},
});

try {
  resolvePluginDependencies(['circ-a@1.0.0'], [pluginCircA, pluginCircB]);
  assert.fail('Should detect circular dependency');
} catch (e) {
  assert.equal(e.message.includes('Circular dependency'), true);
}

console.log('✅ Circular dependency detection works\n');

// ============================================================
// Test 8: Realm 支持检查
// ============================================================

console.log('Test 8: Realm support checking');

const pluginRootOnly = definePlugin({
  id: 'root-only',
  version: '1.0.0',
  supports: {
    realms: ['root'],
  },
  install() {},
});

const pluginAll = definePlugin({
  id: 'all-realms',
  version: '1.0.0',
  // 默认支持所有 realm
  install() {},
});

assert.equal(canRunInRealm(pluginRootOnly, 'root'), true);
assert.equal(canRunInRealm(pluginRootOnly, 'worker'), false);
assert.equal(canRunInRealm(pluginAll, 'root'), true);
assert.equal(canRunInRealm(pluginAll, 'worker'), true);

console.log('✅ Realm support checking works\n');

// ============================================================
// Test 9: 状态注册表
// ============================================================

console.log('Test 9: State registry');

const registry = createStateRegistry();

// App 级别状态
registry.set('app-key', 'app-value', 'app', null);
assert.equal(registry.get('app-key', 'app', null), 'app-value');

// Sandbox 级别状态
registry.set('sandbox-key', 'sandbox-value', 'sandbox', 'sandbox-1');
assert.equal(registry.get('sandbox-key', 'sandbox', 'sandbox-1'), 'sandbox-value');
assert.equal(registry.get('sandbox-key', 'sandbox', 'sandbox-2'), undefined);

// Realm 级别状态
registry.set('realm-key', 'realm-value', 'realm', 'realm-1');
assert.equal(registry.get('realm-key', 'realm', 'realm-1'), 'realm-value');

// Plugin 级别状态
registry.set('plugin-key', 'plugin-value', 'plugin', 'plugin-instance-1');
assert.equal(registry.get('plugin-key', 'plugin', 'plugin-instance-1'), 'plugin-value');

// has/delete
assert.equal(registry.has('app-key', 'app', null), true);
registry.delete('app-key', 'app', null);
assert.equal(registry.has('app-key', 'app', null), false);

// clear
registry.set('key1', 'val1', 'sandbox', 'sandbox-1');
registry.set('key2', 'val2', 'sandbox', 'sandbox-1');
registry.clear('sandbox', 'sandbox-1');
assert.equal(registry.get('key1', 'sandbox', 'sandbox-1'), undefined);

console.log('✅ State registry works\n');

// ============================================================
// Test 10: 状态访问器
// ============================================================

console.log('Test 10: State accessor');

const accessor = createStateAccessor(registry, 'plugin-1', 'realm-1', 'sandbox-1');

// 插件私有状态
accessor.set('private', 'value');
assert.equal(accessor.get('private'), 'value');
assert.equal(accessor.has('private'), true);

// 跨作用域访问
accessor.setScoped('shared', 'sandbox-value', 'sandbox');
assert.equal(accessor.getScoped('shared', 'sandbox'), 'sandbox-value');

accessor.setScoped('realm-shared', 'realm-value', 'realm');
assert.equal(accessor.getScoped('realm-shared', 'realm'), 'realm-value');

// 快照
const snapshot = accessor.snapshot('plugin');
assert.equal(snapshot.private, 'value');

console.log('✅ State accessor works\n');

// ============================================================
// Test 11: 依赖验证
// ============================================================

console.log('Test 11: Dependency validation');

const validation1 = validateDependencies([pluginBase, pluginMiddle, pluginTop]);
assert.equal(validation1.valid, true);
assert.equal(validation1.errors.length, 0);

const pluginMissing = definePlugin({
  id: 'missing-dep',
  version: '1.0.0',
  requires: ['non-existent@1.0.0'],
  install() {},
});

const validation2 = validateDependencies([pluginMissing]);
assert.equal(validation2.valid, false);
assert.equal(validation2.errors.length > 0, true);

console.log('✅ Dependency validation works\n');

// ============================================================
// 总结
// ============================================================

console.log('━'.repeat(60));
console.log('✨ All Plugin SDK tests passed!');
console.log('━'.repeat(60));
console.log('');
console.log('Verified functionality:');
console.log('  ✓ Plugin definition and validation');
console.log('  ✓ Version comparison and range matching');
console.log('  ✓ Capability indexing and lookup');
console.log('  ✓ Dependency resolution (topological sort)');
console.log('  ✓ Circular dependency detection');
console.log('  ✓ Realm support checking');
console.log('  ✓ State registry (4 scopes)');
console.log('  ✓ State accessor (scoped access)');
console.log('  ✓ Dependency validation');
console.log('');
console.log('🎯 Plugin SDK is production-ready!');
