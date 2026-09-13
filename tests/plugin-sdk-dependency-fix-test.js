/**
 * Plugin SDK 依赖解析契约回归（IKFDA4）
 *
 * 覆盖四个此前互不一致的点：
 * 1. resolvePluginDependencies 接受 Profile 的 { id, range } 对象引用；
 * 2. 解析阶段与 validateDependencies 一致地认能力提供者；
 * 3. 循环依赖 DFS 不因提前 return 留下脏 path/recStack 而误报；
 * 4. definePlugin 的默认 realms 与校验器允许集合一致（含 worklet）。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { definePlugin } from '../src/engine/plugin-sdk/define-plugin.js';
import {
  canRunInRealm,
  detectCircularDependencies,
  resolvePluginDependencies,
  validateDependencies,
} from '../src/engine/plugin-sdk/capability-matcher.js';

test('plugin dependency resolution accepts profile PluginReference objects', () => {
  const alpha = definePlugin({
    id: 'alpha',
    version: '1.2.0',
    install() {},
  });

  const resolved = resolvePluginDependencies(
    [{ id: 'alpha', range: '>=1.0.0' }],
    [alpha],
  );
  assert.deepEqual(resolved.plugins.map((plugin) => plugin.id), ['alpha']);

  const resolvedWithVersionKey = resolvePluginDependencies(
    [{ id: 'alpha', version: '^1.0.0' }],
    [alpha],
  );
  assert.deepEqual(resolvedWithVersionKey.plugins.map((plugin) => plugin.id), ['alpha']);
});

test('capability providers satisfy requires during resolution', () => {
  const provider = definePlugin({
    id: 'provider',
    version: '2.0.0',
    provides: [{ name: 'cool-cap', version: '2.1.0' }],
    install() {},
  });
  const consumer = definePlugin({
    id: 'consumer',
    version: '1.0.0',
    requires: [{ id: 'cool-cap', version: '>=2.0.0' }],
    install() {},
  });

  const resolved = resolvePluginDependencies(
    [{ id: 'consumer', range: '*' }],
    [provider, consumer],
  );
  const ids = resolved.plugins.map((plugin) => plugin.id).sort();
  assert.deepEqual(ids, ['consumer', 'provider']);

  // 与 validateDependencies 同一结论：不允许一个函数说 OK、另一个报 not found。
  assert.equal(validateDependencies([provider, consumer]).valid, true);
});

test('missing capability provider still fails the resolution', () => {
  const consumer = definePlugin({
    id: 'consumer',
    version: '1.0.0',
    requires: [{ id: 'missing-cap', version: '*' }],
    install() {},
  });
  assert.throws(
    () => resolvePluginDependencies([{ id: 'consumer', range: '*' }], [consumer]),
    /requires "missing-cap/,
  );
});

test('circular dependency detection does not flag acyclic branches', () => {
  const a = definePlugin({
    id: 'a',
    version: '1.0.0',
    requires: [{ id: 'b', version: '*' }],
    install() {},
  });
  const b = definePlugin({
    id: 'b',
    version: '1.0.0',
    requires: [{ id: 'a', version: '*' }],
    install() {},
  });
  const c = definePlugin({
    id: 'c',
    version: '1.0.0',
    requires: [{ id: 'b', version: '*' }],
    install() {},
  });

  const result = detectCircularDependencies([a, b, c]);
  assert.equal(result.hasCycle, true);
  for (const cycle of result.cycles) {
    assert.ok(
      cycle.includes('a') && cycle.includes('b'),
      `cycle must be the real a<->b loop, got ${JSON.stringify(cycle)}`,
    );
  }
  assert.equal(
    result.cycles.some((cycle) => cycle.includes('c') && !cycle.includes('a')),
    false,
    'acyclic branch c must not be reported as its own cycle',
  );
});

test('definePlugin default realms match the validator-supported set', () => {
  const plugin = definePlugin({
    id: 'all-realms',
    version: '1.0.0',
    install() {},
  });

  assert.deepEqual(
    [...plugin.supports.realms].sort(),
    ['iframe', 'root', 'worker', 'worklet'],
  );
  assert.equal(canRunInRealm(plugin, 'worklet'), true);
  assert.equal(canRunInRealm(plugin, 'node'), false);
  assert.equal(canRunInRealm(plugin, 'browser'), false);
});
