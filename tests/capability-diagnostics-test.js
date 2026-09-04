/**
 * 缺失能力诊断测试（ADR-0002，已按实测修订）
 *
 * 测试重点分三块：
 * 1. 默认模式**不修改全局**，`typeof` / `in` / 取值语义与浏览器一致
 * 2. 查询 API 能把原生 `ReferenceError` 翻译成可行动的建议
 * 3. strict 模式确实装上 getter，且其代价（`typeof` 抛错）被显式记录
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

import {
  CapabilityNotLoadedError,
  DIAGNOSTIC_EXEMPT_GLOBALS,
  MISSING_CAPABILITY_CODE,
  collectGlobalSurfaceMap,
  createCapabilityExplainer,
  installStrictCapabilityDiagnostics,
  parseReservedSurfaces,
  removeStrictCapabilityDiagnostics,
  suggestPluginsFor,
} from '../src/engine/core/capability-diagnostics.js';
import { HAS_VM_PROPERTY_QUERY_CALLBACK } from '../src/engine/compat/host-compat.js';

const sampleMap = new Map([
  ['document', { plugin: '@nv8/plugin-dom-core', capability: 'dom.document' }],
  ['fetch', { plugin: '@nv8/plugin-fetch', capability: 'fetch.base' }],
  ['onmessage', { plugin: '@nv8/plugin-messaging', capability: 'messaging.base' }],
]);

function explainerFor(options = {}) {
  return createCapabilityExplainer({
    surfaceMap: sampleMap,
    loadedCapabilities: options.loadedCapabilities ?? ['timers.base'],
    isLoaded: options.isLoaded ?? (() => false),
  });
}

// ---------------------------------------------------------------- 错误形状

test('CapabilityNotLoadedError names the capability and the plugin', () => {
  const error = new CapabilityNotLoadedError({
    globalName: 'document',
    capability: 'dom.document',
    plugin: '@nv8/plugin-dom-core',
    loadedCapabilities: ['timers.base', 'console.base'],
  });

  assert.equal(error.code, MISSING_CAPABILITY_CODE);
  assert.equal(error.globalName, 'document');
  assert.equal(error.capability, 'dom.document');
  assert.equal(error.plugin, '@nv8/plugin-dom-core');
  assert.match(error.message, /dom\.document/);
  assert.match(error.message, /@nv8\/plugin-dom-core/);
  assert.deepEqual(error.loadedCapabilities, ['console.base', 'timers.base']);
});

test('CapabilityNotLoadedError stays an instanceof ReferenceError', () => {
  const error = new CapabilityNotLoadedError({
    globalName: 'x', capability: 'c', plugin: 'p', loadedCapabilities: [],
  });
  // 目标脚本常写 `catch (e) { if (e instanceof ReferenceError) ... }`
  assert.ok(error instanceof ReferenceError);
});

test('a global with no registered provider says so instead of inventing one', () => {
  const error = new CapabilityNotLoadedError({
    globalName: 'Mystery', capability: 'unknown', plugin: null, loadedCapabilities: [],
  });
  assert.match(error.message, /no registered plugin provides "Mystery"/);
});

// ------------------------------------------------------------- 查询 API

test('explain returns the capability and plugin for a missing global', () => {
  const explanation = explainerFor().explain('document');
  assert.equal(explanation.capability, 'dom.document');
  assert.equal(explanation.plugin, '@nv8/plugin-dom-core');
  assert.deepEqual(explanation.loadedCapabilities, ['timers.base']);
});

test('explain returns null for already loaded globals', () => {
  const explainer = explainerFor({ isLoaded: (name) => name === 'document' });
  assert.equal(explainer.explain('document'), null);
  assert.ok(explainer.explain('fetch'), 'other globals still explainable');
});

test('explain returns null for globals no plugin provides', () => {
  assert.equal(explainerFor().explain('WebGLRenderingContext'), null);
});

test('diagnose translates a native ReferenceError into a suggestion', () => {
  const diagnosis = explainerFor().diagnose(
    new ReferenceError('document is not defined')
  );
  assert.equal(diagnosis.code, MISSING_CAPABILITY_CODE);
  assert.equal(diagnosis.plugin, '@nv8/plugin-dom-core');
});

test('diagnose works on cross-realm errors that fail instanceof Error', () => {
  // 从 vm context 抛出的错误，其 Error 构造函数与宿主不同，
  // `instanceof Error` 恒为 false。实测就是这个原因让 diagnose 一直返回
  // null，因此改为鸭子类型检查。
  const context = vm.createContext({});
  let crossRealmError;
  try {
    vm.runInContext('document.x', context);
  } catch (error) {
    crossRealmError = error;
  }

  assert.equal(
    crossRealmError instanceof Error,
    false,
    'precondition: cross-realm instanceof must fail for this test to be meaningful'
  );
  const diagnosis = explainerFor().diagnose(crossRealmError);
  assert.ok(diagnosis, 'diagnose must not rely on instanceof');
  assert.equal(diagnosis.globalName, 'document');
});

test('diagnose returns null for unrelated errors', () => {
  const explainer = explainerFor();
  assert.equal(explainer.diagnose(new TypeError('x is not a function')), null);
  assert.equal(explainer.diagnose(new ReferenceError('Mystery is not defined')), null);
  assert.equal(explainer.diagnose(null), null);
  assert.equal(explainer.diagnose('not an error'), null);
});

test('explainer methods survive destructuring', () => {
  // 查询器常被解构使用；依赖 `this` 会在这种写法下静默失效
  const { explain, diagnose, suggest } = explainerFor();
  assert.ok(explain('document'));
  assert.ok(diagnose(new ReferenceError('document is not defined')));
  assert.deepEqual(suggest(['fetch']).plugins, ['@nv8/plugin-fetch']);
});

// --------------------------------------------------- 默认模式不碰全局

test('creating an explainer does not touch the realm global', () => {
  const context = vm.createContext({});
  createCapabilityExplainer({
    surfaceMap: sampleMap,
    isLoaded: (name) => vm.runInContext(`'${name}' in globalThis`, context),
  });

  assert.equal(vm.runInContext('typeof document', context), 'undefined');
  assert.equal(vm.runInContext("'document' in globalThis", context), false);
  assert.throws(() => vm.runInContext('document.x', context), /document is not defined/);
});

// ------------------------------------------------------------ strict 模式

test('strict mode installs getters inside the vm context', () => {
  const context = vm.createContext({});
  const evaluate = (source) => vm.runInContext(source, context);

  const installed = installStrictCapabilityDiagnostics({
    evaluate,
    surfaceMap: sampleMap,
    loadedCapabilities: ['timers.base'],
  });

  // onmessage 被豁免（成员属性而非能力入口）
  assert.deepEqual(installed, ['document', 'fetch']);

  try {
    evaluate('document.x');
    assert.fail('reading a missing global must throw');
  } catch (error) {
    assert.equal(error.code, MISSING_CAPABILITY_CODE);
    assert.equal(error.capability, 'dom.document');
    // 用 deepEqual 而非 deepStrictEqual：错误由 vm getter 抛出，其数组属性
    // 是 vm Realm 的 Array，与宿主 Array 非同一构造函数。这是跨 Realm 对象
    // 的固有性质，不是缺陷。
    assert.deepEqual([...error.loadedCapabilities], ['timers.base']);
  }
});

test('strict mode breaks typeof probing — the documented trade-off', () => {
  const context = vm.createContext({});
  const evaluate = (source) => vm.runInContext(source, context);
  installStrictCapabilityDiagnostics({ evaluate, surfaceMap: sampleMap });

  // 这是 ADR-0002 修订的核心依据：`typeof` 只对**完全未声明**的标识符返回
  // 'undefined'；已声明但取值抛错的绑定会传播错误。因此 strict 模式必须
  // 是可选的，不能作为默认。
  assert.throws(() => evaluate('typeof document'), /was not loaded/);
});

test('strict mode leaves loaded globals untouched', () => {
  const context = vm.createContext({});
  const evaluate = (source) => vm.runInContext(source, context);
  evaluate('globalThis.fetch = () => "real";');

  const installed = installStrictCapabilityDiagnostics({
    evaluate, surfaceMap: sampleMap,
  });

  assert.deepEqual(installed, ['document'], 'only missing globals get diagnostics');
  assert.equal(evaluate('fetch()'), 'real');
});

test('strict diagnostics are non-enumerable', () => {
  const context = vm.createContext({});
  const evaluate = (source) => vm.runInContext(source, context);
  installStrictCapabilityDiagnostics({ evaluate, surfaceMap: sampleMap });

  // 否则 Object.keys(globalThis) 会让未装载的能力看起来像已存在
  assert.equal(evaluate('Object.keys(globalThis).includes("document")'), false);

  if (HAS_VM_PROPERTY_QUERY_CALLBACK) {
    assert.equal(evaluate("'document' in globalThis"), true);
    return;
  }

  // Node 22 之前 vm 用 **getter** 回答全局对象的 `has` 查询，所以 `in` 会
  // 真的调用那个抛错的 getter。见 host-compat.js 的
  // HAS_VM_PROPERTY_QUERY_CALLBACK：这是宿主能力，用户态修不了。
  //
  // 这里断言"会抛"而不是跳过：跳过等于在旧版本上放弃检查，而抛错本身也是
  // 一种确定行为，值得钉住——哪天它变了应该被发现。
  assert.throws(() => evaluate("'document' in globalThis"), /was not loaded/);
});

test('strict diagnostics stay configurable so plugins can install later', () => {
  const context = vm.createContext({});
  const evaluate = (source) => vm.runInContext(source, context);
  installStrictCapabilityDiagnostics({ evaluate, surfaceMap: sampleMap });

  evaluate('Object.defineProperty(globalThis, "document", { value: { real: true }, configurable: true })');
  assert.equal(evaluate('document.real'), true);
});

test('strict diagnostics can be removed for trace-free scenarios', () => {
  const context = vm.createContext({});
  const evaluate = (source) => vm.runInContext(source, context);
  const installed = installStrictCapabilityDiagnostics({ evaluate, surfaceMap: sampleMap });

  removeStrictCapabilityDiagnostics(evaluate, installed);

  assert.equal(evaluate("'document' in globalThis"), false);
  assert.equal(evaluate('typeof document'), 'undefined');
});

test('removal leaves real implementations alone', () => {
  const context = vm.createContext({});
  const evaluate = (source) => vm.runInContext(source, context);
  evaluate('globalThis.fetch = "real";');
  installStrictCapabilityDiagnostics({ evaluate, surfaceMap: sampleMap });

  removeStrictCapabilityDiagnostics(evaluate, ['document', 'fetch']);
  assert.equal(evaluate('fetch'), 'real', 'removal must not delete real values');
});

test('strict mode requires an evaluate function', () => {
  assert.throws(
    () => installStrictCapabilityDiagnostics({ surfaceMap: sampleMap }),
    /requires an evaluate function/
  );
});

// ------------------------------------------------------------ 静态解析

test('parseReservedSurfaces reads literal single-line calls', () => {
  const names = parseReservedSurfaces(`
    registry.reserveGlobalSurface(this.id, 'AbortController');
    registry.reserveGlobalSurface(this.id, "AbortSignal");
  `);
  assert.deepEqual(names, ['AbortController', 'AbortSignal']);
});

test('parseReservedSurfaces reads multi-line formatted calls', () => {
  const names = parseReservedSurfaces(`
    context.surfaceRegistry?.reserveGlobalSurface(
      this.id,
      'ServiceWorkerRegistration',
    );
  `);
  assert.deepEqual(names, ['ServiceWorkerRegistration']);
});

test('parseReservedSurfaces ignores non-literal arguments', () => {
  const names = parseReservedSurfaces(
    'registry.reserveGlobalSurface(this.id, computedName);'
  );
  assert.deepEqual(names, [], 'dynamic names cannot be resolved statically');
});

// ---------------------------------------------------------------- 建议

test('suggestPluginsFor maps globals back to plugins and reports unknowns', () => {
  const suggestion = suggestPluginsFor(sampleMap, ['document', 'fetch', 'WebGL']);
  assert.deepEqual(suggestion.plugins, ['@nv8/plugin-dom-core', '@nv8/plugin-fetch']);
  assert.deepEqual(suggestion.capabilities, ['dom.document', 'fetch.base']);
  assert.deepEqual(suggestion.unknown, ['WebGL']);
});

test('suggestPluginsFor deduplicates plugins covering several globals', () => {
  const map = new Map([
    ['A', { plugin: '@nv8/plugin-x', capability: 'x.base' }],
    ['B', { plugin: '@nv8/plugin-x', capability: 'x.base' }],
  ]);
  assert.deepEqual(suggestPluginsFor(map, ['A', 'B']).plugins, ['@nv8/plugin-x']);
});

// ------------------------------------------------------- 真实插件映射

test('the real plugin set yields a substantial surface map', async () => {
  const { fullPreset } = await import('../src/config/presets/index.js');
  const map = await collectGlobalSurfaceMap(fullPreset);

  assert.ok(map.size > 140, `expected a populated map, got ${map.size}`);
  assert.equal(map.get('fetch')?.plugin, '@nv8/plugin-fetch');
  assert.equal(map.get('Element')?.plugin, '@nv8/plugin-dom-core');
  assert.equal(map.get('document')?.plugin, '@nv8/plugin-dom-core');
  assert.equal(map.get('MutationObserver')?.plugin, '@nv8/plugin-events');
});

test('static parsing recovers globals that runtime probing could not', async () => {
  const { domCorePlugin } = await import('../src/plugins/dom-core/index.js');
  const map = await collectGlobalSurfaceMap([domCorePlugin]);

  // dom-core 的 install() 读取 config.url，运行时探针会抛错并采集到 0
  assert.ok(map.size >= 5, `expected dom-core surfaces, got ${map.size}`);
  assert.equal(map.get('Document')?.plugin, '@nv8/plugin-dom-core');
});

// -------------------------------------------------------- 登记完整性

test('member-style globals are exempt from diagnostics', () => {
  assert.equal(DIAGNOSTIC_EXEMPT_GLOBALS.has('onmessage'), true);
  assert.equal(DIAGNOSTIC_EXEMPT_GLOBALS.has('onmessageerror'), true);
  assert.equal(DIAGNOSTIC_EXEMPT_GLOBALS.has('postMessage'), true);
});

test('every plugin-provided global is either registered or explicitly exempt', async () => {
  const { captureFullSurface } = await import('../src/infra/baseline/full-surface.js');
  const { createNv8, fullPreset, minimalPreset } = await import('../src/index.js');
  const silent = { info() {}, warn() {}, error() {}, trace() {} };

  const globalsFor = async (plugins, id) => {
    const nv8 = await createNv8({
      plugins,
      profile: { id, version: '1.0.0', name: id, url: 'https://probe.test/' },
      logger: silent,
    });
    try {
      const realm = await nv8.sandbox.createRealm({
        type: 'root',
        pageUrl: 'https://probe.test/',
      });
      const snapshot = await captureFullSurface((source) => realm.evaluate(source));
      return new Set(Object.keys(snapshot.globals));
    } finally {
      await nv8.destroy();
    }
  };

  const baselineGlobals = await globalsFor(minimalPreset, 'probe-min');
  const fullGlobals = await globalsFor(fullPreset, 'probe-full');
  const surfaceMap = await collectGlobalSurfaceMap(fullPreset);

  const provided = [...fullGlobals].filter((name) => !baselineGlobals.has(name));
  const unaccounted = provided.filter(
    (name) => !surfaceMap.has(name) && !DIAGNOSTIC_EXEMPT_GLOBALS.has(name)
  ).sort();

  assert.deepEqual(
    unaccounted,
    [],
    'these plugin globals need reserveGlobalSurface() or an entry in '
    + `DIAGNOSTIC_EXEMPT_GLOBALS: ${unaccounted.join(', ')}`
  );
  assert.ok(provided.length > 100, `expected a meaningful plugin surface, got ${provided.length}`);
});

// -------------------------------------------------------- Realm 集成

test('realms expose an explainer by default without altering semantics', async () => {
  const { createNv8, minimalPreset } = await import('../src/index.js');
  const nv8 = await createNv8({
    plugins: minimalPreset,
    profile: { id: 'diag-default', version: '1.0.0', name: 'D', url: 'https://t.test/' },
    logger: { info() {}, warn() {}, error() {}, trace() {} },
  });

  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://t.test/' });

    assert.equal(realm.evaluate('typeof document'), 'undefined', 'typeof stays intact');
    assert.deepEqual(realm.strictDiagnosticGlobals, [], 'no getters installed by default');
    assert.ok(realm.capabilityExplainer, 'explainer is available');

    let captured;
    try {
      realm.evaluate('document.querySelector("#x")');
    } catch (error) {
      captured = error;
    }
    assert.ok(captured, 'reading a missing global still throws natively');

    // explainer 是惰性的（避免在 Realm 创建流程里做 IO 而改变脚本时序），
    // 因此方法是 async
    const diagnosis = await realm.capabilityExplainer.diagnose(captured);
    assert.equal(diagnosis.plugin, '@nv8/plugin-dom-core');
    assert.ok(diagnosis.loadedCapabilities.length > 0, 'loaded capabilities are reported');

    const explanation = await realm.capabilityExplainer.explain('fetch');
    assert.equal(explanation.plugin, '@nv8/plugin-fetch');

    const suggestion = await realm.capabilityExplainer.suggest(['document', 'fetch']);
    assert.deepEqual(suggestion.plugins, ['@nv8/plugin-dom-core', '@nv8/plugin-fetch']);
  } finally {
    await nv8.destroy();
  }
});

test('realms honour capabilityDiagnostics: strict', async () => {
  const { createNv8, minimalPreset } = await import('../src/index.js');
  const nv8 = await createNv8({
    plugins: minimalPreset,
    profile: { id: 'diag-strict', version: '1.0.0', name: 'D', url: 'https://t.test/' },
    logger: { info() {}, warn() {}, error() {}, trace() {} },
    runtime: { capabilityDiagnostics: 'strict' },
  });

  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://t.test/' });
    assert.ok(realm.strictDiagnosticGlobals.length > 50, 'getters are installed');

    assert.throws(
      () => realm.evaluate('document.x'),
      (error) => {
        assert.equal(error.code, MISSING_CAPABILITY_CODE);
        return true;
      }
    );
  } finally {
    await nv8.destroy();
  }
});

test('capabilityDiagnostics can be turned off entirely', async () => {
  const { createNv8, minimalPreset } = await import('../src/index.js');
  const nv8 = await createNv8({
    plugins: minimalPreset,
    profile: { id: 'diag-off', version: '1.0.0', name: 'D', url: 'https://t.test/' },
    logger: { info() {}, warn() {}, error() {}, trace() {} },
    runtime: { capabilityDiagnostics: false },
  });

  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://t.test/' });
    assert.equal(realm.capabilityExplainer, null, 'no explainer when disabled');
    assert.deepEqual(realm.strictDiagnosticGlobals, []);
  } finally {
    await nv8.destroy();
  }
});
