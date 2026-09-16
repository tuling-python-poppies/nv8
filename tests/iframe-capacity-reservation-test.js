import test from 'node:test';
import assert from 'node:assert/strict';
import { createNv8, fullPreset, workerPlugin, workletPlugin, serviceWorkerPlugin } from '../src/index.js';
import { waitForValue, waitUntil } from './helpers/async-wait.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };
const page = { id: 'capacity-fixture', url: 'https://fixture.test/' };
function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

test('parallel iframe loads share the root capacity budget and release it on removal', { timeout: 15000 }, async () => {
  const instance = await createNv8({ logger, plugins: fullPreset, profile: page, limits: { maxRealms: 2 } });
  try {
    const root = await instance.sandbox.createRealm();
    const loaded = JSON.parse(await root.evaluate(`Promise.all([0, 1].map(id => new Promise(resolve => {
      const frame = document.createElement('iframe'); frame.id = 'frame-' + id;
      frame.onload = () => resolve(frame.contentWindow !== null);
      frame.onerror = () => resolve(false);
      frame.srcdoc = '<html><body>local</body></html>'; document.body.appendChild(frame);
    }))).then(JSON.stringify)`));
    assert.equal(loaded.filter(Boolean).length, 1);
    assert.equal(instance.sandbox.getAllRealms().length, 2);
    assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
    root.evaluate(`document.querySelectorAll('iframe').forEach(frame => frame.remove())`);
    await waitForValue(() => instance.sandbox.getAllRealms().length, 1);
    assert.equal(await root.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe'); frame.onload = () => resolve(!!frame.contentWindow);
      frame.srcdoc = '<html></html>'; document.body.appendChild(frame);
    })`), true);
    assert.equal(instance.sandbox.getAllRealms().length, 2);
  } finally { await instance.destroy(); }
});

for (const operation of ['remove', 'reset']) {
  test(`an in-flight iframe reservation rejects other creates and is reclaimed on ${operation}`, { timeout: 15000 }, async () => {
    const entered = deferred(), release = deferred();
    const instance = await createNv8({ logger, plugins: [...fullPreset, {
      id: 'zz-frame-gate', version: '1.0.0', install() {},
      supports: { realms: ['root', 'iframe'] },
      async activate(ctx) { if (ctx.realm.type === 'iframe') { entered.resolve(); await release.promise; } },
    }], profile: page, limits: { maxRealms: 2 } });
    try {
      const root = await instance.sandbox.createRealm();
      root.evaluate(`globalThis.frame = document.createElement('iframe'); frame.srcdoc = '<html></html>'; document.body.appendChild(frame);`);
      await entered.promise;
      assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 1);
      await assert.rejects(instance.sandbox.createRealm(), e => e.code === 'LIMIT_REALM_CAPACITY');
      if (operation === 'remove') root.evaluate('frame.remove()');
      else await instance.sandbox.reset();
      release.resolve();
      await waitForValue(() => instance.sandbox.diagnose().pendingRealmCreations, 0);
      await waitForValue(() => instance.sandbox.getAllRealms().length, operation === 'remove' ? 1 : 0);
      const next = await instance.sandbox.createRealm();
      assert.equal(next.evaluate('42'), 42);
    } finally { release.resolve(); await instance.destroy(); }
  });
}

test('iframe activation failure releases capacity for a replacement', { timeout: 15000 }, async () => {
  let fail = true;
  const instance = await createNv8({ logger, profile: page, limits: { maxRealms: 2 }, plugins: [...fullPreset, {
    id: 'zz-frame-failure', version: '1.0.0', install() {},
    supports: { realms: ['root', 'iframe'] },
    activate(ctx) { if (fail && ctx.realm.type === 'iframe') throw new Error('intentional failure'); },
  }] });
  try {
    const root = await instance.sandbox.createRealm();
    assert.equal(await root.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe'); frame.onload = () => resolve('load');
      frame.onerror = () => resolve('error'); frame.srcdoc = '<html></html>'; document.body.appendChild(frame);
    })`), 'error');
    assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
    assert.equal(instance.sandbox.getAllRealms().length, 1);
    fail = false;
    assert.equal(await root.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe'); frame.onload = () => resolve(!!frame.contentWindow);
      frame.srcdoc = '<html></html>'; document.body.appendChild(frame);
    })`), true);
  } finally { await instance.destroy(); }
});

test('root navigation transfers its capacity instead of allocating an extra slot', { timeout: 15000 }, async () => {
  const instance = await createNv8({ logger, plugins: fullPreset, profile: page, limits: { maxRealms: 1 } });
  try {
    const root = await instance.sandbox.createRealm();
    root.evaluate(`location.href='https://fixture.test/next'`);
    await waitUntil(() => instance.sandbox.getAllRealms().some(realm => realm.id !== root.id));
    assert.equal(instance.sandbox.getAllRealms().length, 1);
    assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
  } finally { await instance.destroy(); }
});

test('Worker, SharedWorker, ServiceWorker and Worklet factories honor the shared Realm budget', { timeout: 15000 }, async () => {
  const instance = await createNv8({ logger, plugins: [...fullPreset, workerPlugin, workletPlugin, serviceWorkerPlugin], profile: page,
    limits: { maxRealms: 1 }, replay: [{ url: 'https://fixture.test/shared.js', repeat: 'unlimited', body: '' }],
  });
  try {
    const root = await instance.sandbox.createRealm();
    for (const expression of [`new Worker('data:text/javascript,')`, `new SharedWorker('/shared.js')`]) {
      assert.equal(await root.evaluate(`new Promise(resolve => {
        const worker = ${expression}; worker.onerror = e => resolve(e.error?.code || e.message);
      })`), 'LIMIT_REALM_CAPACITY');
      assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
      assert.equal(instance.sandbox.diagnose().pendingWorkerCreations, 0);
      assert.equal(instance.sandbox.diagnose().workerConnections, 0);
    }
    await assert.rejects(root.evaluate(`navigator.serviceWorker.register('/shared.js')`), e => e.code === 'LIMIT_REALM_CAPACITY');
    assert.equal(instance.sandbox.diagnose().pendingWorkerCreations, 0);
    const module = await root.moduleLoader.importUrlAsync(new URL('../src/surface/api/worklet/worklet-runtime.js', import.meta.url));
    const worklet = module.namespace.createWorklet('paint');
    await assert.rejects(module.namespace.workletAddModule(worklet, '/shared.js'), e => e.code === 'LIMIT_REALM_CAPACITY');
    assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
  } finally { await instance.destroy(); }
});

test('nested iframe factories cannot allocate outside the same capacity budget', { timeout: 15000 }, async () => {
  const instance = await createNv8({ logger, plugins: fullPreset, profile: page, limits: { maxRealms: 2 } });
  try {
    const root = await instance.sandbox.createRealm();
    await root.evaluate(`new Promise(resolve => {
      globalThis.frame = document.createElement('iframe'); frame.onload = resolve;
      frame.srcdoc = '<html><body></body></html>'; document.body.appendChild(frame);
    })`);
    assert.equal(await root.evaluate(`frame.contentWindow.eval("new Promise(resolve => { const nested=document.createElement('iframe'); nested.onload=()=>resolve(nested.contentWindow !== null); nested.srcdoc='<html></html>'; document.body.appendChild(nested); })")`), false);
    assert.equal(instance.sandbox.getAllRealms().length, 2);
    assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
  } finally { await instance.destroy(); }
});

test('asynchronous iframe script failure rolls back its allocated Realm', { timeout: 15000 }, async () => {
  const instance = await createNv8({ logger, plugins: fullPreset, profile: page, limits: { maxRealms: 2, timeoutMs: 100 },
    replay: [{ url: 'https://fixture.test/never.js', body: 'await new Promise(() => {});' }],
  });
  try {
    const root = await instance.sandbox.createRealm();
    assert.equal(await root.evaluate(`new Promise(resolve => {
      const frame=document.createElement('iframe'); frame.onload=()=>resolve('load'); frame.onerror=()=>resolve('error');
      frame.srcdoc='<html><head><script async type="module" src="https://fixture.test/never.js"></script></head></html>';
      document.body.appendChild(frame);
    })`), 'error');
    assert.equal(instance.sandbox.getAllRealms().length, 1);
    assert.equal(instance.sandbox.diagnose().pendingRealmCreations, 0);
  } finally { await instance.destroy(); }
});
