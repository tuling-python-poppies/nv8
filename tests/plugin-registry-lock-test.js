import assert from 'node:assert/strict';
import test from 'node:test';
import { createPluginRegistry } from '../src/engine/core/plugin-registry.js';

test('plugin resolution is deterministic regardless of registration order', () => {
  const make = id => ({
    id,
    version: '1.0.0',
    install() {},
  });
  const alpha = make('alpha');
  const beta = { ...make('beta'), requires: ['alpha@^1.0.0'] };
  const first = createPluginRegistry();
  first.register(beta);
  first.register(alpha);
  const second = createPluginRegistry();
  second.register(alpha);
  second.register(beta);
  assert.deepEqual(
    first.resolve().map(plugin => plugin.id),
    ['alpha', 'beta'],
  );
  assert.deepEqual(
    second.resolve().map(plugin => plugin.id),
    ['alpha', 'beta'],
  );
});

test('plugin resolution reports dependency version mismatch', () => {
  const registry = createPluginRegistry();
  registry.register({ id: 'alpha', version: '2.0.0', install() {} });
  registry.register({
    id: 'beta',
    version: '1.0.0',
    requires: ['alpha@^1.0.0'],
    install() {},
  });
  assert.throws(
    () => registry.resolve(),
    error => error.code === 'DEPENDENCY_VERSION_MISMATCH'
      && error.actual === '2.0.0',
  );
});
