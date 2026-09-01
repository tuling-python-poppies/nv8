/**
 * Realm 状态作用域与迁移回归测试
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  STATE_SCOPE,
  createKeyedStateSlot,
  createRealmSlot,
  createSandboxSlot,
  createStateSlot,
} from '../src/core/state-scope.js';

function host() { return {}; }

// --------------------------------------------------------------- state slots

test('realm slot creates one state per host', () => {
  let created = 0;
  const slot = createRealmSlot(() => ({ id: ++created }), 'test-realm');
  const first = host();
  const second = host();

  assert.equal(slot.scope, STATE_SCOPE.REALM);
  assert.equal(slot.get(first), slot.get(first));
  assert.notEqual(slot.get(first), slot.get(second));
  assert.equal(created, 2);
});

test('realm slot supports peek, has, set and clear', () => {
  const slot = createRealmSlot(() => ({ value: 1 }));
  const realm = host();
  assert.equal(slot.has(realm), false);
  assert.equal(slot.peek(realm), undefined);
  const replacement = { value: 2 };
  assert.equal(slot.set(realm, replacement), replacement);
  assert.equal(slot.peek(realm), replacement);
  assert.equal(slot.has(realm), true);
  assert.equal(slot.clear(realm), true);
  assert.equal(slot.clear(realm), false);
});

test('slots reject primitive hosts instead of silently sharing state', () => {
  const slot = createRealmSlot(() => ({}));
  for (const value of [null, undefined, 1, 'realm']) {
    assert.throws(() => slot.get(value), /scope host object/);
  }
});

test('sandbox slot is explicit in diagnostics', () => {
  const slot = createSandboxSlot(() => new Map(), 'shared-workers');
  assert.equal(slot.scope, STATE_SCOPE.SANDBOX);
  assert.equal(slot.label, 'shared-workers');
});

test('keyed slot isolates string keys within each host', () => {
  const slot = createKeyedStateSlot({
    label: 'origin-test',
    create: (key) => ({ key }),
  });
  const first = host();
  const second = host();

  assert.equal(slot.scope, STATE_SCOPE.ORIGIN);
  assert.equal(slot.get(first, 'https://a.test').key, 'https://a.test');
  assert.equal(slot.get(first, 'https://a.test'), slot.get(first, 'https://a.test'));
  assert.notEqual(slot.get(first, 'https://a.test'), slot.get(second, 'https://a.test'));
  assert.deepEqual(slot.keys(first), ['https://a.test']);
});

test('keyed slot enforces its key limit', () => {
  const slot = createKeyedStateSlot({ maxKeys: 1 });
  const scope = host();
  slot.get(scope, 'one');
  assert.throws(
    () => slot.get(scope, 'two'),
    (error) => error.code === 'ERR_NV8_STATE_KEY_LIMIT'
  );
});

test('state slot validates scope and initializer configuration', () => {
  assert.throws(
    () => createStateSlot({ scope: 'process' }),
    /unknown scope/
  );
  assert.throws(
    () => createStateSlot({ create: null }),
    /must be a function/
  );
  assert.throws(
    () => createKeyedStateSlot({ maxKeys: 0 }),
    /maxKeys must be a positive integer/
  );
});

// ------------------------------------------------------------- module audits

test('migrated modules no longer declare the known singleton variables', async () => {
  const files = [
    '../src/api/storage/storage-state.js',
    '../src/api/window/window-messaging.js',
    '../src/api/dom/cookie-state.js',
    '../src/api/dom/html-element-constructor.js',
    '../src/api/device/device-runtime.js',
    '../src/api/indexed-db/indexed-db-runtime.js',
  ];
  const forbidden = [
    /^let localStorage\s*=/m,
    /^let sessionStorage\s*=/m,
    /^let localOrigin\s*=/m,
    /^let parentFacade\s*=/m,
    /^let topFacade\s*=/m,
    /^const cookies\s*=\s*new Map/m,
    /^let cookieStoreInstance\s*=/m,
    /^const specializedFactories\s*=\s*new Map/m,
    /^let unknownElementFactory\s*=/m,
    /^let geolocationSingleton\s*=/m,
    /^let nextWatchId\s*=/m,
    /^const watches\s*=\s*new Map/m,
    /^let sensorProfile\s*=/m,
    /^const databases\s*=\s*new Map/m,
    /^let factorySingleton\s*=/m,
  ];

  for (const file of files) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    for (const pattern of forbidden) {
      assert.equal(
        pattern.test(source),
        false,
        `${file} still contains migrated module-level state: ${pattern}`
      );
    }
  }
});

test('state scope module has no Node or browser implementation dependencies', async () => {
  const source = await readFile(
    new URL('../src/core/state-scope.js', import.meta.url),
    'utf8'
  );
  assert.doesNotMatch(source, /^import\s/m);
});

// ---------------------------------------------------- 宿主图状态棘轮

/**
 * 宿主 ESM 图上的模块级可变状态上限。
 *
 * 经 RealmModuleLoader 加载的模块在每个 Realm 都会得到新实例，
 * 因此那条路径天然隔离；真正会跨 Sandbox 泄漏的是宿主图。
 *
 * 这个阀值只允许下调。它不是“当前很完美”的证明，而是防止迁移
 * 过程中反向新增。
 */
const HOST_GRAPH_STATE_BUDGET = 4;

/**
 * 跑一次模块状态审计并缓存结果。
 *
 * 三个断言原先各 spawn 一次，每次都要重扫 1800+ 个模块；更要紧的是 cwd 在三处
 * 各写一遍，修一处漏两处。
 *
 * cwd 必须走 `fileURLToPath`：`new URL('..', import.meta.url).pathname` 在
 * Windows 上是 `/C:/...`，spawnSync 直接 ENOENT，而报错里显示的是 node.exe 的
 * 路径，看起来像「Node 装坏了」——真实原因（cwd 非法）被完全掩盖。
 */
const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
let auditReportCache = null;

function auditReport() {
  if (auditReportCache === null) {
    auditReportCache = JSON.parse(execFileSync(
      process.execPath,
      ['scripts/audit-module-state.mjs', '--json'],
      { cwd: PROJECT_ROOT, encoding: 'utf8' }
    ));
  }
  return auditReportCache;
}

test('host ESM graph mutable module state stays within budget', () => {
  const report = auditReport();

  assert.ok(report.hostGraphModules > 0, 'audit must resolve the host graph');
  assert.ok(
    report.stateCount <= HOST_GRAPH_STATE_BUDGET,
    `host graph module-level state ${report.stateCount} exceeds budget `
    + `${HOST_GRAPH_STATE_BUDGET}; migrate it into a scope slot, or register it as `
    + 'reviewed process-level state with a reason in scripts/audit-module-state.mjs'
  );
});

test('process-level exemptions all carry a written reason', () => {
  const { exempt } = auditReport();

  assert.ok(exempt.length > 0, 'expected the reviewed exemption list to be populated');
  for (const entry of exempt) {
    assert.equal(typeof entry.reason, 'string');
    assert.ok(
      entry.reason.length > 10,
      `exemption ${entry.file}:${entry.name} needs a substantive reason`
    );
  }
});

test('audited files list stays sorted by severity for reviewability', () => {
  const { files } = auditReport();
  for (let index = 1; index < files.length; index += 1) {
    assert.ok(
      files[index - 1].findings.length >= files[index].findings.length,
      'audit output must be ordered from most to least state'
    );
  }
});

// ------------------------------------------------------------ 时钟作用域

/**
 * 时钟迁移的回归保护。
 *
 * 关键行为：不同 Realm 的 configureTimingProfile() 不得相互覆盖。
 * 迁移前它们共享模块级 profile / 单调游标 / jitter PRNG。
 */
test('timing profile and cursors are isolated per realm', async () => {
  const vm = await import('node:vm');
  const { RealmModuleLoader } = await import('../src/realm/module-loader.js');
  const url = new URL('../src/scheduler/monotonic-clock.js', import.meta.url);

  const first = new RealmModuleLoader(vm.createContext({}));
  const second = new RealmModuleLoader(vm.createContext({}));
  const clockA = (await first.importUrlAsync(url)).namespace;
  const clockB = (await second.importUrlAsync(url)).namespace;

  clockA.configureTimingProfile({ timeOriginMs: 1000, jitterSeed: 111 });
  clockB.configureTimingProfile({ timeOriginMs: 2000, jitterSeed: 222 });

  assert.equal(clockA.timeOrigin(), 1000);
  assert.equal(clockB.timeOrigin(), 2000, 'realm B must not be overwritten by realm A');
  assert.equal(clockA.timingProfile().jitterSeed, 111);
  assert.equal(clockB.timingProfile().jitterSeed, 222);
});

test('jitter sequence is reproducible for a fixed seed', async () => {
  const vm = await import('node:vm');
  const { RealmModuleLoader } = await import('../src/realm/module-loader.js');
  const url = new URL('../src/scheduler/monotonic-clock.js', import.meta.url);
  const clock = (await new RealmModuleLoader(vm.createContext({})).importUrlAsync(url)).namespace;

  // 用极大的量子步长把真实时间漂移量化掉，使 jitter 成为序列的唯一变量。
  // 否则两次采样之间壁钟前进 1ms 就会让绝对值不同，测到的不是确定性。
  const sample = () => {
    clock.configureTimingProfile({
      timeOriginMs: 0,
      performanceResolutionMs: 1e9,
      performanceJitterMs: 10,
      jitterSeed: 42,
    });
    return [clock.monotonicNow(), clock.monotonicNow(), clock.monotonicNow()];
  };

  const first = sample();
  assert.deepEqual(sample(), first, 'same seed must produce the same jitter sequence');

  // 换 seed 序列必须不同，否则说明 jitter 根本没生效
  clock.configureTimingProfile({
    timeOriginMs: 0,
    performanceResolutionMs: 1e9,
    performanceJitterMs: 10,
    jitterSeed: 4242,
  });
  const other = [clock.monotonicNow(), clock.monotonicNow(), clock.monotonicNow()];
  assert.notDeepEqual(other, first, 'a different seed must change the sequence');
});

test('performance.now stays monotonic within a realm', async () => {
  const vm = await import('node:vm');
  const { RealmModuleLoader } = await import('../src/realm/module-loader.js');
  const url = new URL('../src/scheduler/monotonic-clock.js', import.meta.url);
  const clock = (await new RealmModuleLoader(vm.createContext({})).importUrlAsync(url)).namespace;

  clock.configureTimingProfile({ timeOriginMs: Date.now(), performanceJitterMs: 5 });
  let previous = clock.monotonicNow();
  for (let index = 0; index < 200; index += 1) {
    const current = clock.monotonicNow();
    assert.ok(current >= previous, `monotonicNow went backwards at iteration ${index}`);
    previous = current;
  }
});
