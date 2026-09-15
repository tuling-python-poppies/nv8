import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { createNv8, fullPreset } from '../src/index.js';
import { createSandbox } from '../src/engine/core/sandbox.js';
import { createStateRegistry } from '../src/engine/core/state-registry.js';
import { normalizePlugin } from '../src/engine/core/plugin-registry.js';
import { DiagnosticsCollector } from '../src/engine/core/diagnostics/collector.js';
import { auditRealmGlobals } from '../src/engine/realm/global-audit.js';
import { createRealmShellAsync } from '../src/engine/realm/create-realm.js';
import {
  createWorkerRealm,
} from '../src/engine/realm/create-worker-realm.js';
import { destroyRealm as destroyWorkerRealm } from '../src/engine/realm/destroy-realm.js';
import { workerPlugin } from '../src/plugins/worker/index.js';
import { serviceWorkerPlugin } from '../src/plugins/service-worker/index.js';
import { drainTasks, waitForValue, waitUntil } from './helpers/async-wait.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

const baseProfile = {
  id: 'engine-fix-profile',
  version: '1.0.0',
  name: 'Engine Fix Profile',
  url: 'https://example.test/',
  pageHtml: '<!doctype html><html><head></head><body></body></html>',
};

// ---------------------------------------------------------------------------
// IKF399：legacy 沙箱逃逸
// ---------------------------------------------------------------------------

test('target Realm cannot reach host process through Function constructor', async () => {
  const nv8 = await createNv8({ plugins: [], logger });
  try {
    const result = await nv8.eval(`(() => {
      const probes = {};
      try {
        probes.direct = typeof Function('return process')();
      } catch (error) {
        probes.direct = 'blocked:' + error.name;
      }
      try {
        probes.constructorChain = typeof ({}).constructor.constructor('return process')();
      } catch (error) {
        probes.constructorChain = 'blocked:' + error.name;
      }
      probes.processType = typeof process;
      probes.functionIsRealm = Function('return typeof globalThis')() === 'object';
      return JSON.stringify(probes);
    })()`);
    const probes = JSON.parse(result);
    assert.notEqual(probes.direct, 'object');
    assert.notEqual(probes.constructorChain, 'object');
    assert.equal(probes.processType, 'undefined');
    assert.equal(probes.functionIsRealm, true);
  } finally {
    await nv8.destroy();
  }
});

test('target Realm cannot reach host process through compatibility constructors', async () => {
  const nv8 = await createNv8({ plugins: [], logger });
  try {
    const result = await nv8.eval(`(() => {
      const probes = {};
    for (const name of [
      'URL', 'URLSearchParams', 'TextEncoder', 'TextDecoder',
      'setTimeout', 'setInterval', 'console',
    ]) {
      try {
          const value = name === 'console' ? console.log : globalThis[name];
          probes[name] = value.constructor('return typeof process')();
        } catch (error) {
          probes[name] = 'blocked:' + error.name;
        }
      }
      return JSON.stringify(probes);
    })()`);
    const probes = JSON.parse(result);
    for (const name of [
      'URL', 'URLSearchParams', 'TextEncoder', 'TextDecoder',
      'setTimeout', 'setInterval', 'console',
    ]) {
      assert.notEqual(probes[name], 'object', `${name} must not expose host Function`);
    }
  } finally {
    await nv8.destroy();
  }
});

// ---------------------------------------------------------------------------
// IKFD9F：destroy 后定时器导航复活 Realm
// ---------------------------------------------------------------------------

test('destroy clears realm timers and blocks navigation resurrection', async () => {
  const nv8 = await createNv8({
    plugins: fullPreset,
    profile: baseProfile,
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    realm.evaluate(`(() => {
      globalThis.timerFired = false;
      // 0ms 只用于「立刻到期」：销毁在同一个宏任务内完成（disposeTimers 在
      // realm.destroy() 的 await 之前同步执行），所以计时器只有在未被注销时
      // 才会在随后的 drain 里跑起来。30ms 固定等待变成事件循环让位。
      setTimeout(() => {
        globalThis.timerFired = true;
        location.href = 'https://example.test/next';
      }, 0);
      return 'scheduled';
    })()`);
    await nv8.sandbox.destroyRealm(realm.id);
    assert.equal(realm.destroyed, true);
    await drainTasks();
    assert.equal(nv8.sandbox.getAllRealms().length, 0);
    assert.equal(realm.evaluate('globalThis.timerFired'), false);
  } finally {
    await nv8.destroy();
  }
});

// ---------------------------------------------------------------------------
// IKFD9G：reset 不清 ServiceWorkerHandles
// ---------------------------------------------------------------------------

test('reset invalidates service worker controllers and allows re-registration', async () => {
  const replay = [{
    method: 'GET',
    url: 'https://example.test/sw.js',
    repeat: 'unlimited',
    body: "self.addEventListener('install', event => event.waitUntil(Promise.resolve()));\n"
      + "self.addEventListener('activate', event => event.waitUntil(Promise.resolve()));",
  }];
  const nv8 = await createNv8({
    plugins: [...fullPreset, workerPlugin, serviceWorkerPlugin],
    profile: baseProfile,
    replay,
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const controlled = await realm.evaluate(`
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(() => navigator.serviceWorker.controller !== null)
    `);
    assert.equal(controlled, true);

    await nv8.sandbox.reset();

    const next = await nv8.sandbox.createRealm({ type: 'root' });
    assert.equal(
      await next.evaluate('navigator.serviceWorker.controller === null'),
      true,
    );
    const recontrolled = await next.evaluate(`
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(() => navigator.serviceWorker.controller !== null)
    `);
    assert.equal(recontrolled, true);
  } finally {
    await nv8.destroy();
  }
});

// ---------------------------------------------------------------------------
// IKFD9H：SharedWorker record 生命周期
// ---------------------------------------------------------------------------

test('SharedWorker records are deduplicated and rebuilt after self.close', async () => {
  const replay = [{
    method: 'GET',
    url: 'https://example.test/shared.js',
    repeat: 'unlimited',
    body: 'self.onconnect = event => {\n'
      + '  const port = event.ports[0];\n'
      + '  port.onmessage = message => {\n'
      + "    if (message.data === 'close') { self.close(); return; }\n"
      + '    port.postMessage(message.data + "!");\n'
      + '  };\n'
      + '  port.start();\n'
      + '};',
  }];
  const nv8 = await createNv8({
    plugins: [...fullPreset, workerPlugin],
    profile: baseProfile,
    replay,
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    // 并发同 key 构造：只允许一个全局作用域
    realm.evaluate(`(() => {
      globalThis.sharedA = new SharedWorker('/shared.js', { name: 'dup' });
      globalThis.sharedB = new SharedWorker('/shared.js', { name: 'dup' });
      return true;
    })()`);
    // 并发同 key 只允许一个全局作用域：等到侦察结果稳定为 1（若退化成 2，
    // 轮询超时而不是用固定等待掩盖）。
    await waitForValue(
      () => nv8.sandbox.diagnose().workerRealms,
      1,
      { label: 'deduplicated SharedWorker realm count' },
    );
    assert.equal(nv8.sandbox.diagnose().workerRealms, 1);

    const echoed = await realm.evaluate(`new Promise(resolve => {
      const worker = new SharedWorker('/shared.js', { name: 'close-test' });
      worker.port.onmessage = event => resolve(event.data);
      worker.port.start();
      worker.port.postMessage('hello');
    })`);
    assert.equal(echoed, 'hello!');

    realm.evaluate(`(() => {
      const worker = new SharedWorker('/shared.js', { name: 'close-test' });
      worker.port.start();
      worker.port.postMessage('close');
      return true;
    })()`);
    // self.close() 后旧 record 必须已作废：等 workerRealms 降回仅剩 'dup' 的
    // 那一项，再重建同 key 的 worker。
    await waitForValue(
      () => nv8.sandbox.diagnose().workerRealms,
      1,
      { label: 'closed SharedWorker realm teardown' },
    );
    // self.close() 后旧 record 必须已作废；同 key 重建后仍可通信
    const again = await realm.evaluate(`new Promise(resolve => {
      const worker = new SharedWorker('/shared.js', { name: 'close-test' });
      worker.port.onmessage = event => resolve(event.data);
      worker.port.start();
      worker.port.postMessage('again');
    })`);
    assert.equal(again, 'again!');
  } finally {
    await nv8.destroy();
  }
});

// ---------------------------------------------------------------------------
// IKFD9I：evidence 注入失败泄漏 Realm
// ---------------------------------------------------------------------------

test('evidence injection failure rolls back the half-created realm', async () => {
  const brokenScriptUrl = 'https://example.test/broken-evidence.js';
  const evidenceSource = {
    async has() { return true; },
    async readText(id) {
      return id === brokenScriptUrl ? 'this is not ({ valid javascript' : '';
    },
    async readBinary() { return new Uint8Array(); },
    async listEntryScripts() { return [brokenScriptUrl]; },
    async listScripts() { return [{ id: brokenScriptUrl }]; },
    async listPages() { return []; },
    async getNetworkReplayFixture() { return { requests: [] }; },
    describe() { return { id: 'memory-evidence' }; },
  };
  const sandbox = await createSandbox({
    appId: 'evidence-rollback',
    profile: baseProfile,
    plugins: fullPreset.map(plugin => normalizePlugin(plugin)),
    stateRegistry: createStateRegistry(),
    trace: false,
    logger,
    replay: [],
    evidence: { executeScripts: true },
    evidenceSource,
    limits: { timeoutMs: 2000 },
  });
  try {
    await assert.rejects(
      () => sandbox.createRealm({ type: 'root' }),
      error => /Evidence script failed/.test(`${error.message}`),
    );
    assert.equal(sandbox.getAllRealms().length, 0);
    assert.equal(sandbox.diagnose().workerRealms, 0);
  } finally {
    await sandbox.destroy();
  }
});

// ---------------------------------------------------------------------------
// IKFD9K：全局审计误判页面自定义 global
// ---------------------------------------------------------------------------

test('page-defined window.process does not trip the host leak audit', async () => {
  const nv8 = await createNv8({
    plugins: fullPreset,
    profile: {
      ...baseProfile,
      pageHtml: '<!doctype html><html><head>'
        + '<script>window.process = { page: true };</script>'
        + '</head><body></body></html>',
    },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    assert.equal(realm.evaluate('globalThis.process.page'), true);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('audit still catches a real host global injected into the realm', () => {
  const context = vm.createContext({}, { name: 'audit-probe' });
  context.process = process;
  assert.throws(
    () => auditRealmGlobals(context),
    error => error.code === 'ERR_EDGE_GLOBAL_LEAK',
  );
});

// ---------------------------------------------------------------------------
// IKFD9L：并发 import 竞态
// ---------------------------------------------------------------------------

test('concurrent dynamic imports of the same page module succeed', async () => {
  const moduleUrl = 'https://example.test/concurrent.js';
  const nv8 = await createNv8({
    plugins: fullPreset,
    profile: {
      ...baseProfile,
      pageHtml: '<!doctype html><html><head>'
        + '<script type="module">'
        + 'globalThis.concurrentImport = "pending";'
        + 'Promise.all([import("./concurrent.js"), import("./concurrent.js")])'
        + '.then(namespaces => {'
        + '  globalThis.concurrentImport = namespaces[0].value + ":"'
        + '    + (namespaces[0] === namespaces[1]);'
        + '});'
        + '</script></head><body></body></html>',
    },
    replay: [{
      method: 'GET',
      url: moduleUrl,
      repeat: 'unlimited',
      body: 'export const value = "m";',
    }],
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const settled = await realm.evaluate(`new Promise(resolve => {
      const check = () => {
        if (globalThis.concurrentImport !== 'pending') {
          resolve(globalThis.concurrentImport);
          return;
        }
        setTimeout(check, 1);
      };
      check();
    })`);
    assert.equal(settled, 'm:true');
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('RealmModuleLoader.importUrlAsync shares one evaluation for concurrent URLs', async () => {
  const shell = await createRealmShellAsync('concurrent-loader', 'https://example.test');
  const url = new URL('../src/engine/plugin-sdk/api-version.js', import.meta.url);
  const [first, second] = await Promise.all([
    shell.moduleLoader.importUrlAsync(url),
    shell.moduleLoader.importUrlAsync(url),
  ]);
  assert.equal(first, second);
  assert.equal(first.status, 'evaluated');
  shell.moduleLoader.dispose();
});

// ---------------------------------------------------------------------------
// IKF39P：errors/builtins 插件在 createNv8 路径生效
// ---------------------------------------------------------------------------

test('fullPreset installs error guards and modern builtins in createNv8', async () => {
  const nv8 = await createNv8({
    plugins: fullPreset,
    profile: baseProfile,
    logger,
  });
  try {
    const builtins = JSON.parse(await nv8.eval(`JSON.stringify({
      disposableStack: typeof DisposableStack,
      temporal: typeof Temporal,
      float16: typeof Float16Array,
      getOrInsert: typeof Map.prototype.getOrInsert,
      toBase64: typeof Uint8Array.prototype.toBase64,
    })`));
    assert.equal(builtins.disposableStack, 'function');
    assert.equal(builtins.temporal, 'object');
    assert.equal(builtins.float16, 'function');
    assert.equal(builtins.getOrInsert, 'function');
    assert.equal(builtins.toBase64, 'function');

    const stack = await nv8.eval(`(() => {
      try { null.value; } catch (error) { return error.stack; }
    })()`);
    assert.equal(typeof stack, 'string');
    assert.equal(stack.includes('node:'), false, `host node: frame leaked: ${stack}`);
    assert.equal(stack.includes('file:///'), false, `host file frame leaked: ${stack}`);
    assert.equal(stack.includes('node:vm'), false, `node:vm frame leaked: ${stack}`);
  } finally {
    await nv8.destroy();
  }
});

// ---------------------------------------------------------------------------
// IKF39K：页面脚本超时
// ---------------------------------------------------------------------------

test('a dead-loop inline script is terminated and reported structurally', async () => {
  const nv8 = await createNv8({
    plugins: fullPreset,
    profile: {
      ...baseProfile,
      pageHtml: '<!doctype html><html><head>'
        + '<script>while (true) {}</script>'
        + '</head><body></body></html>',
    },
    limits: { timeoutMs: 250 },
    logger,
  });
  try {
    const started = Date.now();
    await assert.rejects(
      () => nv8.sandbox.createRealm({ type: 'root' }),
      error => error.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT'
        && /timed out/i.test(`${error.message}`),
    );
    assert.ok(Date.now() - started < 3000, 'timeout should not hang the suite');
    assert.equal(nv8.sandbox.getAllRealms().length, 0);
  } finally {
    await nv8.destroy();
  }
});

test('a dead-loop inline module script is terminated and reported structurally', async () => {
  const nv8 = await createNv8({
    plugins: fullPreset,
    profile: {
      ...baseProfile,
      pageHtml: '<!doctype html><html><head>'
        + '<script type="module">while (true) {}</script>'
        + '</head><body></body></html>',
    },
    limits: { timeoutMs: 250 },
    logger,
  });
  try {
    const started = Date.now();
    await assert.rejects(
      () => nv8.sandbox.createRealm({ type: 'root' }),
      error => error.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT'
        && /timed out/i.test(`${error.message}`),
    );
    assert.ok(Date.now() - started < 3000, 'module timeout should not hang the suite');
    assert.equal(nv8.sandbox.getAllRealms().length, 0);
  } finally {
    await nv8.destroy();
  }
});

test('a dead-loop classic Worker script is terminated with a structured error', async () => {
  const nv8 = await createNv8({
    plugins: [...fullPreset, workerPlugin],
    profile: baseProfile,
    limits: { timeoutMs: 300 },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const started = Date.now();
    // 正向信号是 worker.onerror 写入的错误码。原先用 2000ms 定时器兜底，
    // 等于「等 2 秒看看错误来不来」；现在由宿主轮询该信号，超时即失败。
    await realm.evaluate(`(() => {
      globalThis.workerFailure = null;
      const worker = new Worker('data:text/javascript,while(true){}');
      worker.onerror = event => {
        globalThis.workerFailure = event.error?.code || event.message;
      };
      return 'started';
    })()`);
    await waitUntil(
      async () => (await realm.evaluate('globalThis.workerFailure')) !== null,
      { label: 'dead-loop worker timeout error', timeoutMs: 1500 },
    );
    assert.equal(
      await realm.evaluate('globalThis.workerFailure'),
      'ERR_SCRIPT_EXECUTION_TIMEOUT',
    );
    assert.ok(Date.now() - started < 2000, 'worker timeout should not hang');
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

// ---------------------------------------------------------------------------
// IKF39T：错误边界
// ---------------------------------------------------------------------------

test('diagnostics collector survives cyclic context objects', () => {
  const collector = new DiagnosticsCollector({ maxEntries: 2 });
  const cyclic = { name: 'loop' };
  cyclic.self = cyclic;
  const nested = { deep: { deeper: { deepest: { self: cyclic } } } };
  collector.error({ message: 'cyclic', context: nested, circular: cyclic });
  collector.error({ message: 'second' });
  collector.error({ message: 'third' });
  const errors = collector.getErrors();
  assert.equal(errors.length, 2);
  assert.equal(errors[0].message, 'second');
  assert.equal(errors[1].message, 'third');
});

test('DiagnosticsCollector keeps O(1) append order under maxEntries', () => {
  const collector = new DiagnosticsCollector({ maxEntries: 3 });
  collector.warn({ message: 'a' });
  collector.warn({ message: 'b' });
  collector.warn({ message: 'c' });
  collector.warn({ message: 'd' });
  assert.deepEqual(
    collector.getAll().map(item => item.message),
    ['b', 'c', 'd'],
  );
});

test('plugin activation failures preserve code and cause through the boundary', async () => {
  const boomPlugin = {
    id: 'boundary-boom',
    version: '1.0.0',
    install() {},
    activate() {
      const error = new Error('boom');
      error.code = 'ERR_TEST_ACTIVATION_BOOM';
      throw error;
    },
  };
  const nv8 = await createNv8({ plugins: [boomPlugin], logger });
  try {
    await assert.rejects(
      () => nv8.sandbox.createRealm({ type: 'root' }),
      error => error.code === 'ERR_TEST_ACTIVATION_BOOM'
        && error.cause?.message === 'boom'
        && error.pluginId === 'boundary-boom',
    );
    assert.equal(nv8.sandbox.getAllRealms().length, 0);
  } finally {
    await nv8.destroy();
  }
});

// ---------------------------------------------------------------------------
// IKF39V：双注册表 / 双上下文收敛（可验证部分）
// ---------------------------------------------------------------------------

test('sandbox.evaluate resolves the real root realm id', async () => {
  const nv8 = await createNv8({ plugins: fullPreset, profile: baseProfile, logger });
  try {
    await nv8.sandbox.createRealm({ type: 'root' });
    const result = await nv8.sandbox.evaluate('40 + 2');
    assert.equal(result.error, null);
    assert.equal(result.value, 42);
  } finally {
    await nv8.destroy();
  }
});

test('plugin context.state is coherent between install and activate', async () => {
  let activated = null;
  const plugin = {
    id: 'state-coherence',
    version: '1.0.0',
    provides: ['state.coherence'],
    install(context) {
      context.state.set('installValue', 41);
    },
    activate(context) {
      activated = context.state.get('installValue');
      context.state.setScoped('realmValue', 'realm-scoped', 'realm');
      context.global.statePluginRealmValue =
        context.state.getScoped('realmValue', 'realm');
    },
  };
  const nv8 = await createNv8({ plugins: [plugin], logger });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    assert.equal(activated, 41);
    assert.equal(realm.evaluate('globalThis.statePluginRealmValue'), 'realm-scoped');
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('core state registry supports app/plugin scopes', () => {
  const registry = createStateRegistry();
  registry.set('appKey', 1, 'app', null);
  assert.equal(registry.get('appKey', 'app', null), 1);
  registry.set('pluginKey', 2, 'plugin', 'plugin-instance');
  assert.equal(registry.get('pluginKey', 'plugin', 'plugin-instance'), 2);
  assert.equal(registry.has('pluginKey', 'plugin', 'plugin-instance'), true);
  assert.equal(registry.delete('pluginKey', 'plugin', 'plugin-instance'), true);
  registry.destroyContext('app', null);
  assert.equal(registry.get('appKey', 'app', null), undefined);
});

// ---------------------------------------------------------------------------
// IKFD9O：Worker Realm 的 Intl 默认 locale / 时区
// ---------------------------------------------------------------------------

test('worker realm Intl defaults follow navigator language and configured timezone', async () => {
  const realm = await createWorkerRealm({
    label: 'intl-worker',
    workerUrl: 'https://example.test/intl-worker.js',
    navigatorProfile: { language: 'en-US', languages: ['en-US', 'en'] },
    timezone: 'Asia/Shanghai',
    replay: [{
      method: 'GET',
      url: 'https://example.test/intl-worker.js',
      repeat: 'unlimited',
      body: '',
    }],
  });
  try {
    const observed = JSON.parse(vm.runInContext(`JSON.stringify({
      locale: new Intl.DateTimeFormat().resolvedOptions().locale,
      timeZone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateTimeFormatIsFunction: typeof Intl.DateTimeFormat === 'function',
      constructorBacklink:
        new Intl.DateTimeFormat().constructor === Intl.DateTimeFormat,
    })`, realm.context));
    assert.equal(observed.locale, 'en-US');
    assert.equal(observed.timeZone, 'Asia/Shanghai');
    assert.equal(observed.dateTimeFormatIsFunction, true);
    assert.equal(observed.constructorBacklink, true);
  } finally {
    destroyWorkerRealm(realm);
  }
});
