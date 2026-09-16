import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, nv8Eval, defaultPreset } from '../src/index.js';
import { drainTasks, waitForValue } from './helpers/async-wait.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

for (const [name, plugins] of [['empty', []], ['default', defaultPreset]]) {
  test(`convenience eval waits for a timer-backed result before cleanup (${name})`, { timeout: 10000 }, async () => {
    const instance = await createNv8({ plugins, logger });
    try {
      const value = await instance.eval('new Promise(resolve => setTimeout(() => resolve(42), 0))');
      assert.equal(value, 42);
      assert.equal(instance.sandbox.getAllRealms().length, 0);
      assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
    } finally { await instance.destroy(); }
  });
}

test('nv8Eval awaits thenables as well as native Promises', { timeout: 10000 }, async () => {
  const value = await nv8Eval('({then(resolve) { setTimeout(() => resolve(7), 0); }})', { plugins: [], logger });
  assert.equal(value, 7);
});

test('eval preserves asynchronous rejection and synchronous throw while releasing capacity', async () => {
  const instance = await createNv8({ plugins: [], logger, limits: { maxRealms: 1 } });
  try {
    for (const source of [
      `new Promise((_, reject) => setTimeout(() => {
        const error = new Error('async failure'); error.code = 'TEST_ASYNC'; reject(error);
      }, 0))`,
      `(() => { const error = new Error('sync failure'); error.code = 'TEST_SYNC'; throw error; })()`,
    ]) {
      await assert.rejects(instance.eval(source), e => /^TEST_/.test(e.code));
      assert.equal(instance.sandbox.getAllRealms().length, 0);
      assert.equal(await instance.eval('6 * 7'), 42);
    }
  } finally { await instance.destroy(); }
});

test('unsettled eval has a deadline and stops its timers before returning', { timeout: 10000 }, async () => {
  let context;
  let disposed = 0;
  const instance = await createNv8({ logger, limits: { maxRealms: 1, timeoutMs: 50 }, plugins: [{
    id: 'eval-lifecycle-probe', version: '1.0.0', install() {},
    activate(ctx) { context = ctx.global; },
    dispose() { disposed += 1; },
  }] });
  try {
    await assert.rejects(instance.eval(`
      globalThis.ticks = 0;
      setInterval(() => { ticks += 1; }, 0);
      new Promise(() => {});
    `), e => e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' && e.timeoutMs === 50);
    const ticks = context.ticks;
    await drainTasks();
    assert.equal(context.ticks, ticks);
    assert.equal(disposed, 1);
    assert.equal(instance.sandbox.getAllRealms().length, 0);
    assert.equal(await instance.eval('42'), 42);
  } finally { await instance.destroy(); }
});

test('external reset does not replace eval timeout with a missing-Realm error', { timeout: 10000 }, async () => {
  const instance = await createNv8({ plugins: [], logger, limits: { timeoutMs: 100 } });
  try {
    const result = instance.eval('new Promise(() => {})');
    const rejected = assert.rejects(result, e => e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT');
    await waitForValue(() => instance.sandbox.getAllRealms().length, 1);
    await instance.sandbox.reset();
    await rejected;
    assert.equal(instance.sandbox.getAllRealms().length, 0);
  } finally { await instance.destroy(); }
});
