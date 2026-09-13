import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertSupportedPluginApiVersion,
  CURRENT_PLUGIN_API_VERSION,
  definePlugin,
  normalizePluginApiVersion,
} from '../src/engine/plugin-sdk/index.js';
import { createPluginLockPlan } from '../src/engine/core/plugin-lock-plan.js';

const base = {
  id: 'api-version-test',
  version: '1.2.3',
  install() {},
};

test('plugins default to the current SDK apiVersion', () => {
  const plugin = definePlugin(base);
  assert.equal(plugin.apiVersion, CURRENT_PLUGIN_API_VERSION);
});

test('apiVersion accepts a numeric major string and rejects ambiguous forms', () => {
  assert.equal(normalizePluginApiVersion('1'), '1');
  assert.throws(() => normalizePluginApiVersion(1), /numeric major string/);
  assert.throws(() => normalizePluginApiVersion('1.0'), /numeric major string/);
  assert.throws(() => normalizePluginApiVersion('01'), /leading zeroes/);
});

test('definePlugin validates apiVersion format while Core owns compatibility', () => {
  assert.throws(
    () => definePlugin({ ...base, apiVersion: '1.0' }),
    /numeric major string/,
  );
  const future = definePlugin({ ...base, id: 'future-api-version', apiVersion: '2' });
  assert.equal(future.apiVersion, '2');
  assert.throws(
    () => assertSupportedPluginApiVersion(future.apiVersion, future.id),
    error => error.code === 'PLUGIN_SDK_API_UNSUPPORTED',
  );
});

test('Core rejects an unsupported SDK major during lock-plan creation', () => {
  assert.throws(
    () => createPluginLockPlan({
      plugins: [{ ...base, apiVersion: '2' }],
      profile: { id: 'api-version-test' },
    }),
    error => error.code === 'PLUGIN_SDK_API_UNSUPPORTED',
  );
});

test('supported apiVersion is recorded in the serializable lock plan', () => {
  const plugin = definePlugin({ ...base, id: 'api-version-locked', apiVersion: '1' });
  const plan = createPluginLockPlan({
    plugins: [plugin],
    profile: { id: 'api-version-test' },
  });
  assert.equal(plan.plugins[0].apiVersion, '1');
  assert.equal(assertSupportedPluginApiVersion(plan.plugins[0].apiVersion, plugin.id), '1');
  assert.deepEqual(JSON.parse(JSON.stringify(plan)), plan);
});
