/**
 * Plugin SDK 单元测试
 *
 * 原来是 `src/core/plugin-sdk/test.js`：住在产品树里、用 `console.log` 分段 +
 * 顶层 `assert`、由 `npm test` 单独 `node` 起一次。三个问题：
 *
 * - **产品树里有测试**，`src/` 的文件数与 import 图都被它污染；
 * - **不是 `node:test`**，失败时只有一条堆栈，没有「哪一项红了」的结构化报告，
 *   也进不了 `--test` 的计数（791 项从来没包含它的 11 段）；
 * - **顶层断言**意味着第一段失败后面全部不执行，一次只能看见一个问题。
 *
 * 断言逻辑逐条照搬，没有改动——这次只换结构。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

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
} from '../src/core/plugin-sdk/index.js';

// 跨用例复用的固件。原文件里它们是顶层 const，被后面的段直接引用
// （依赖解析那三个插件在「依赖验证」里又用了一次，状态注册表在「状态访问器」
// 里接着用）。node:test 同文件内串行执行，所以保持模块级共享是等价的。
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

const registry = createStateRegistry();

// ------------------------------------------------------ definePlugin

test('definePlugin fills in the defaults', () => {
  const plugin = definePlugin({
    id: 'test-plugin',
    version: '1.0.0',
    description: 'Test plugin',
    install(context) {
      context.exports.hello = () => 'world';
    },
  });

  assert.equal(plugin.id, 'test-plugin');
  assert.equal(plugin.version, '1.0.0');
  assert.equal(plugin.description, 'Test plugin');
  assert.equal(typeof plugin.install, 'function');
  assert.equal(plugin.requires.length, 0);
  assert.equal(plugin.provides.length, 0);
});

test('definePlugin normalizes requires and provides', () => {
  const plugin = definePlugin({
    id: 'plugin-with-deps',
    version: '2.0.0',
    requires: ['test-plugin@^1.0.0', 'another-plugin'],
    provides: [
      { name: 'feature-a', version: '1.0.0' },
      'feature-b', // 简写格式
    ],
    install() {},
  });

  assert.equal(plugin.requires.length, 2);
  assert.equal(plugin.requires[0].id, 'test-plugin');
  assert.equal(plugin.requires[0].version, '^1.0.0');
  assert.equal(plugin.requires[1].id, 'another-plugin');
  assert.equal(plugin.requires[1].version, '*');

  assert.equal(plugin.provides.length, 2);
  assert.equal(plugin.provides[0].name, 'feature-a');
  assert.equal(plugin.provides[0].version, '1.0.0');
  assert.equal(plugin.provides[1].name, 'feature-b');
  assert.equal(plugin.provides[1].version, '1.0.0'); // 默认值
});

test('definePlugin rejects a non-kebab-case id', () => {
  assert.throws(
    () => definePlugin({ id: 'InvalidID', version: '1.0.0', install() {} }),
    /kebab-case/
  );
});

test('definePlugin rejects a non-semver version', () => {
  assert.throws(
    () => definePlugin({ id: 'valid-id', version: 'not-semver', install() {} }),
    /semver/
  );
});

test('definePlugin requires an install function', () => {
  assert.throws(
    () => definePlugin({ id: 'valid-id', version: '1.0.0' }),
    /install/
  );
});

// ------------------------------------------------------------ 版本

test('compareVersions orders semver triples', () => {
  assert.equal(compareVersions('1.0.0', '1.0.0'), 0);
  assert.equal(compareVersions('1.0.1', '1.0.0'), 1);
  assert.equal(compareVersions('1.0.0', '1.0.1'), -1);
  assert.equal(compareVersions('2.0.0', '1.9.9'), 1);
});

test('parseVersionRange classifies the range syntax', () => {
  assert.equal(parseVersionRange('*').type, 'any');

  const caret = parseVersionRange('^1.0.0');
  assert.equal(caret.type, 'caret');
  assert.equal(caret.version, '1.0.0');

  const tilde = parseVersionRange('~1.2.3');
  assert.equal(tilde.type, 'tilde');
  assert.equal(tilde.version, '1.2.3');
});

test('satisfiesVersionRange honours each range kind', () => {
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
});

// ------------------------------------------------------------ 能力

test('buildCapabilityIndex maps capability names to providers', () => {
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
});

// ------------------------------------------------------------ 依赖

test('resolvePluginDependencies installs dependencies first', () => {
  const resolved = resolvePluginDependencies(
    ['top@1.0.0'],
    [pluginBase, pluginMiddle, pluginTop]
  );

  assert.equal(resolved.count, 3);
  assert.equal(resolved.plugins[0], pluginBase); // 先安装依赖
  assert.equal(resolved.plugins[1], pluginMiddle);
  assert.equal(resolved.plugins[2], pluginTop); // 最后安装顶层
});

test('resolvePluginDependencies detects a cycle', () => {
  const circA = definePlugin({
    id: 'circ-a',
    version: '1.0.0',
    requires: ['circ-b@1.0.0'],
    install() {},
  });
  const circB = definePlugin({
    id: 'circ-b',
    version: '1.0.0',
    requires: ['circ-a@1.0.0'],
    install() {},
  });

  assert.throws(
    () => resolvePluginDependencies(['circ-a@1.0.0'], [circA, circB]),
    /Circular dependency/
  );
});

test('validateDependencies separates a satisfiable graph from a broken one', () => {
  const ok = validateDependencies([pluginBase, pluginMiddle, pluginTop]);
  assert.equal(ok.valid, true);
  assert.equal(ok.errors.length, 0);

  const missing = definePlugin({
    id: 'missing-dep',
    version: '1.0.0',
    requires: ['non-existent@1.0.0'],
    install() {},
  });
  const broken = validateDependencies([missing]);
  assert.equal(broken.valid, false);
  assert.ok(broken.errors.length > 0);
});

// ------------------------------------------------------------ Realm

test('canRunInRealm respects the declared realm list', () => {
  const rootOnly = definePlugin({
    id: 'root-only',
    version: '1.0.0',
    supports: { realms: ['root'] },
    install() {},
  });
  const anyRealm = definePlugin({
    id: 'all-realms',
    version: '1.0.0',
    // 默认支持所有 realm
    install() {},
  });

  assert.equal(canRunInRealm(rootOnly, 'root'), true);
  assert.equal(canRunInRealm(rootOnly, 'worker'), false);
  assert.equal(canRunInRealm(anyRealm, 'root'), true);
  assert.equal(canRunInRealm(anyRealm, 'worker'), true);
});

// ------------------------------------------------------------ 状态

test('the state registry isolates the four scopes', () => {
  registry.set('app-key', 'app-value', 'app', null);
  assert.equal(registry.get('app-key', 'app', null), 'app-value');

  registry.set('sandbox-key', 'sandbox-value', 'sandbox', 'sandbox-1');
  assert.equal(registry.get('sandbox-key', 'sandbox', 'sandbox-1'), 'sandbox-value');
  assert.equal(registry.get('sandbox-key', 'sandbox', 'sandbox-2'), undefined);

  registry.set('realm-key', 'realm-value', 'realm', 'realm-1');
  assert.equal(registry.get('realm-key', 'realm', 'realm-1'), 'realm-value');

  registry.set('plugin-key', 'plugin-value', 'plugin', 'plugin-instance-1');
  assert.equal(registry.get('plugin-key', 'plugin', 'plugin-instance-1'), 'plugin-value');
});

test('the state registry supports has / delete / clear', () => {
  registry.set('app-key', 'app-value', 'app', null);
  assert.equal(registry.has('app-key', 'app', null), true);
  registry.delete('app-key', 'app', null);
  assert.equal(registry.has('app-key', 'app', null), false);

  registry.set('key1', 'val1', 'sandbox', 'sandbox-1');
  registry.set('key2', 'val2', 'sandbox', 'sandbox-1');
  registry.clear('sandbox', 'sandbox-1');
  assert.equal(registry.get('key1', 'sandbox', 'sandbox-1'), undefined);
});

test('the state accessor scopes reads and writes', () => {
  const accessor = createStateAccessor(registry, 'plugin-1', 'realm-1', 'sandbox-1');

  accessor.set('private', 'value');
  assert.equal(accessor.get('private'), 'value');
  assert.equal(accessor.has('private'), true);

  accessor.setScoped('shared', 'sandbox-value', 'sandbox');
  assert.equal(accessor.getScoped('shared', 'sandbox'), 'sandbox-value');

  accessor.setScoped('realm-shared', 'realm-value', 'realm');
  assert.equal(accessor.getScoped('realm-shared', 'realm'), 'realm-value');

  assert.equal(accessor.snapshot('plugin').private, 'value');
});
