import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { createNv8, defaultPreset, fullPreset, workerPlugin } from '../src/index.js';
import { createDynamicImporter } from '../src/engine/realm/dynamic-import.js';
import { evaluateAsync, evaluateWithDeadline } from '../src/engine/realm/module-link-strategy.js';
import { drainTasks, waitForValue } from './helpers/async-wait.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };
const messagingUrl = new URL('../src/surface/api/window/window-messaging.js', import.meta.url);

for (const [name, plugins] of [['empty', []], ['default', defaultPreset], ['full', fullPreset]]) {
  test(`Realm prototypes and timer results contain no host constructors (${name})`, async () => {
    const instance = await createNv8({ plugins, logger });
    try {
      const realm = await instance.sandbox.createRealm();
      // 身份断言无需调用宿主构造器；同时验证返回值而不只验证入口函数。
      const constructors = realm.evaluate(`(() => {
        const timeout = setTimeout(() => {}, 0);
        const interval = setInterval(() => {}, 0);
        clearInterval(timeout);
        clearTimeout(interval);
        return [globalThis.constructor?.constructor, Object.getPrototypeOf(globalThis)?.constructor,
          URL.constructor, TextEncoder.constructor, setTimeout.constructor, console.log.constructor,
          timeout.constructor.constructor, interval.constructor.constructor];
      })()`);
      for (const ctor of constructors) {
        assert.notEqual(ctor, Function);
        assert.notEqual(ctor, Object);
      }
      assert.equal(realm.evaluate('typeof setTimeout(() => {}, 0)'), 'number');
      assert.equal(realm.evaluate('typeof setInterval(() => {}, 0)'), 'number');
    } finally { await instance.destroy(); }
  });
}

test('failed plugin activation clears timers and disposes the partially activated plugin', async () => {
  let context;
  let disposed = 0;
  const instance = await createNv8({ logger, plugins: [{
    id: 'rollback-review', version: '1.0.0', install() {},
    activate(ctx) {
      context = ctx.global;
      vm.runInContext('globalThis.fired=false; setTimeout(() => { fired=true }, 0)', context);
      throw new Error('intentional activation failure');
    },
    dispose() { disposed++; },
  }] });
  try {
    await assert.rejects(instance.sandbox.createRealm(), /intentional activation failure/);
    await instance.destroy();
    await drainTasks();
    assert.equal(context.fired, false);
    assert.equal(disposed, 1);
    assert.equal(instance.sandbox.getAllRealms().length, 0);
  } finally { await instance.destroy(); }
});

test('plugin cleanup can load modules until all dispose hooks finish', async () => {
  let cleaned = false;
  const instance = await createNv8({ logger, plugins: [{
    id: 'dispose-review', version: '1.0.0', install() {},
    async activate(ctx) { await ctx.moduleLoader.importUrlAsync(messagingUrl); },
    async dispose(ctx) {
      await ctx.moduleLoader.importUrlAsync(messagingUrl);
      cleaned = true;
    },
  }] });
  try {
    const realm = await instance.sandbox.createRealm();
    await Promise.all([realm.destroy(), realm.destroy()]);
    assert.equal(cleaned, true);
    assert.equal(realm.moduleLoader.closed, true);
  } finally { await instance.destroy(); }
});

test('destroying an owner Realm releases its Worker', { timeout: 15000 }, async () => {
  const instance = await createNv8({ logger, plugins: [...fullPreset, workerPlugin],
    profile: { id: 'owner-review', url: 'https://fixture.test/' },
    replay: [{ url: 'https://fixture.test/worker.js', body: 'postMessage("ready")' }],
  });
  try {
    const realm = await instance.sandbox.createRealm();
    assert.equal(await realm.evaluate(`new Promise(resolve => {
      const worker = new Worker('/worker.js'); worker.onmessage = e => resolve(e.data);
    })`), 'ready');
    assert.equal(instance.sandbox.diagnose().workerRealms, 1);
    await instance.sandbox.destroyRealm(realm.id);
    await waitForValue(() => instance.sandbox.diagnose().workerRealms, 0);
  } finally { await instance.destroy(); }
});

test('entry module top-level await has a wall-clock deadline', { timeout: 5000 }, async () => {
  const importer = createDynamicImporter({ context: vm.createContext(Object.create(null)), resolveSource: () => null });
  try {
    await assert.rejects(
      importer.evaluateEntryModule('await new Promise(() => {});', 'https://fixture.test/stuck.js', { timeoutMs: 25 }),
      error => error.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT',
    );
  } finally { importer.dispose(); }
});

test('page module creation rolls back when top-level await never settles', { timeout: 10000 }, async () => {
  const instance = await createNv8({ logger, plugins: fullPreset, limits: { timeoutMs: 50 },
    profile: { id: 'await-review', url: 'https://fixture.test/', pageHtml: '<script type="module">await new Promise(() => {});</script>' },
  });
  try {
    await assert.rejects(instance.sandbox.createRealm(), error => error.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT');
    assert.equal(instance.sandbox.getAllRealms().length, 0);
  } finally { await instance.destroy(); }
});

test('native evaluation budget still interrupts synchronous module loops', { timeout: 5000 }, async () => {
  const module = new vm.SourceTextModule('while(true) {}');
  await module.link(() => {});
  await assert.rejects(evaluateWithDeadline(module, 25, 'loop.js'), error => error.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT');
});

test('concurrent imports wait for already-evaluated-but-unsettled module work', async () => {
  const context = vm.createContext(Object.create(null));
  vm.runInContext('globalThis.gate = new Promise(resolve => {globalThis.finish = resolve})', context);
  const importer = createDynamicImporter({ context, defaultReferrer: 'https://fixture.test/',
    resolveSource: () => 'await gate; export const answer = 42;',
  });
  const first = importer('./module.js');
  try {
    await waitForValue(() => importer.cache.get('https://fixture.test/module.js')?.status, 'evaluated');
    let settled = false;
    const second = importer('./module.js').then(ns => { settled = true; return ns; });
    await drainTasks();
    assert.equal(settled, false);
    vm.runInContext('finish()', context);
    const [a, b] = await Promise.all([first, second]);
    assert.equal(a.answer, 42);
    assert.equal(a, b);
  } finally { vm.runInContext('finish()', context); await first; importer.dispose(); }
});

test('internal asynchronous module evaluation also waits for top-level await', async () => {
  const context = vm.createContext(Object.create(null));
  vm.runInContext('globalThis.gate = new Promise(resolve => {globalThis.finish = resolve})', context);
  const module = new vm.SourceTextModule('await gate; export const value=7;', { context });
  await module.link(() => {});
  const first = evaluateAsync(module);
  let settled = false;
  const second = evaluateAsync(module).then(() => { settled = true; });
  try {
    await drainTasks();
    assert.equal(settled, false);
  } finally { vm.runInContext('finish()', context); await Promise.all([first, second]); }
  assert.equal(module.namespace.value, 7);
});
