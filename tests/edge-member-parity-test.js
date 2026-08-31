/**
 * 与真实 Edge 的**原型成员**对等性
 *
 * `edge-surface-parity-test.js` 比的是全局名的存在性——最表层的一维。
 * 这份比的是每个构造函数原型上的成员明细：`fetch` 存在不代表
 * `Response.prototype` 的成员齐全。
 *
 * 数据来源：
 * - 真实 Edge：`fixtures/fingerprint/edge-members.json`
 *   （`npm run fingerprint:members`，966 原型 / 8941 成员）
 * - NV8：实时捕获，因为 `full-surface.json` 里存的是压缩摘要
 *   （`type:members:symbols:digest16`），不含成员名。
 *
 * 差异的严重程度不对称：
 * - **多出**（NV8 有、Edge 没有）：可检测特征，目标是 0。
 * - **缺少**（Edge 有、NV8 没有）：功能缺口，必须登记理由。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const REAL_MEMBERS_URL = new URL('../fixtures/fingerprint/edge-members.json', import.meta.url);

const hasFixture = existsSync(REAL_MEMBERS_URL);
const realPrototypes = hasFixture
  ? JSON.parse(await readFile(REAL_MEMBERS_URL, 'utf8')).prototypes
  : null;

/**
 * 已登记的缺失成员。
 *
 * **当前为空**——13 项已全部处理：
 *
 * - 4 项其实早已实现，只是被 `edge151Surface` 门控，而当时的对比用的是
 *   150 profile（`AnimationEvent.animation` / `TransitionEvent.animation` /
 *   `PerformanceEntry.navigationId` / `WheelEvent.momentum`）。把对比基准
 *   改成 151 profile 后，「陈旧条目」检查立刻把这 4 条揪了出来。
 * - 9 项按真实 Edge 实测的 descriptor 形状与默认值补齐：
 *   `Blob/Request/Response.textStream`（**方法**，不是访问器）、
 *   `Element/ElementInternals.ariaActionsElements`（getter+setter，默认 null）、
 *   `SpeechRecognition.unspokenPunctuation`（getter+setter，默认 false）、
 *   `WebTransportDatagramDuplexStream.incoming/outgoingMaxBufferedDatagrams`。
 *
 * 新增条目必须写明为什么还没修。
 */
const KNOWN_MISSING_MEMBERS = Object.freeze({});

/**
 * 已登记的多余成员。
 *
 * 目标是保持为空。历史上有两条，都已修掉：
 *
 * - `Event.prototype.isTrusted` —— `[LegacyUnforgeable]`，真实浏览器定义在
 *   **实例**上（`configurable: false`），不在原型上。
 * - `NetworkInformation.prototype.type` —— Chromium 只在 Android 暴露，
 *   桌面 Edge 没有。
 */
const KNOWN_EXTRA_MEMBERS = Object.freeze({});

/** NV8 完全没有的原型，理由见 edge-surface-parity-test.js 的 KNOWN_MISSING。 */
const KNOWN_MISSING_PROTOTYPES = Object.freeze([
  'HTMLUserMediaElement',
  'InteractionContentfulPaint',
  'PerformanceSoftNavigation',
]);

// ---------------------------------------------------- 共享捕获

/**
 * 只捕获一次 NV8 surface 供全部断言复用。
 *
 * 每个测试各起一个 sandbox 要多花几秒，而这些断言看的是同一份快照。
 */
let capturePromise = null;

function captureNv8Surface() {
  if (capturePromise === null) {
    capturePromise = (async () => {
      const { captureFullSurface } = await import('../src/baseline/full-surface.js');
      const { createSandbox } = await import('../src/public/create-sandbox.js');
      const { edge151Fingerprint } = await import('../src/fingerprint/edge-151.js');
      const sandbox = await createSandbox('https://baseline.test/', {
        page: { html: '<!doctype html><html><head></head><body></body></html>' },
        // 采集基准是真实 Edge **151**，所以对比也必须用 151 profile。
        //
        // 之前用默认的 150 profile 对比 151 fixture，凡是 `edge151Surface`
        // 门控的成员都会被误报成缺口——`FontFaceSet`、`PerformanceEntry.navigationId`、
        // `WheelEvent.momentum`、`AnimationEvent.animation` 都是这么进登记表的。
        // 版本差异不是缺陷；基准版本必须与 profile 对齐。
        fingerprint: { ...edge151Fingerprint, browserMajorVersion: 151 },
      // 全表面自省是重型操作。默认 `limits.timeoutMs` 是 1000ms——那是给
      // 不受信页面脚本的生产安全上限，不是「自省该有多快」的断言。绑在默认值上
      // 会让测试在并行负载下随机超时（与固定 sleep 同类的时长赌注）。
        limits: { maxOutputBytes: 16 * 1024 * 1024, timeoutMs: 30_000 },
      });
      try {
        return await captureFullSurface((source) => sandbox.run(source));
      } finally {
        await sandbox.close();
        createSandbox.drain();
      }
    })();
  }
  return capturePromise;
}

/** 逐原型比对成员名，返回差异行。 */
function diffMembers(snapshot) {
  const rows = [];
  for (const [name, entry] of Object.entries(realPrototypes)) {
    const nv8 = snapshot.globals[name];
    if (nv8 === undefined || nv8.prototypeMembers === null) {
      rows.push({ name, absent: true, missing: [], extra: [] });
      continue;
    }
    const realNames = new Set(entry.members.map((member) => member.name));
    const nv8Names = new Set(nv8.prototypeMembers.map((member) => member.name));
    const missing = [...realNames].filter((key) => !nv8Names.has(key)).sort();
    const extra = [...nv8Names].filter((key) => !realNames.has(key)).sort();
    if (missing.length > 0 || extra.length > 0) {
      rows.push({ name, absent: false, missing, extra });
    }
  }
  return rows;
}

// ---------------------------------------------------- 前提

test('the real-Edge member fixture is present and complete', () => {
  assert.ok(
    hasFixture,
    'run: npm run fingerprint:members'
  );
  const count = Object.keys(realPrototypes).length;
  assert.ok(count > 900, `expected a full browser surface, got ${count} prototypes`);

  // 抽查：这些原型的成员必须被采到，否则说明采集被截断
  for (const name of ['Event', 'Element', 'Response', 'Blob']) {
    assert.ok(realPrototypes[name], `fixture is missing prototype ${name}`);
    assert.ok(
      realPrototypes[name].members.length > 1,
      `${name} has suspiciously few members`
    );
  }
});

// ---------------------------------------------------- 不应多出成员

test('NV8 exposes no prototype member that real Edge lacks', async () => {
  const snapshot = await captureNv8Surface();
  const offenders = diffMembers(snapshot)
    .filter((row) => row.extra.length > 0)
    .map((row) => ({
      name: row.name,
      extra: row.extra.filter(
        (key) => !(KNOWN_EXTRA_MEMBERS[row.name] ?? []).includes(key)
      ),
    }))
    .filter((row) => row.extra.length > 0)
    .map((row) => `${row.name}.${row.extra.join('/')}`);

  assert.deepEqual(
    offenders,
    [],
    'these members are detectable deviations; remove them or register them in KNOWN_EXTRA_MEMBERS'
  );
});

// ---------------------------------------------------- unforgeable 位置回归

test('isTrusted is unforgeable on the instance, not on Event.prototype', async () => {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://t.test/', {
    page: { html: '<!doctype html><html><body></body></html>' },
  });

  try {
    const observed = JSON.parse(await sandbox.run(`JSON.stringify((() => {
      const event = new Event('probe');
      const descriptor = Object.getOwnPropertyDescriptor(event, 'isTrusted');
      return {
        onPrototype: Object.getOwnPropertyNames(Event.prototype).includes('isTrusted'),
        onInstance: Object.getOwnPropertyNames(event).includes('isTrusted'),
        getterType: typeof descriptor.get,
        configurable: descriptor.configurable,
        enumerable: descriptor.enumerable,
        value: event.isTrusted,
      };
    })())`));

    // 真实 Edge 151 的实测结果，逐字段对齐
    assert.equal(observed.onPrototype, false, 'real Event.prototype has no isTrusted');
    assert.equal(observed.onInstance, true, '[LegacyUnforgeable] lives on the instance');
    assert.equal(observed.getterType, 'function');
    assert.equal(observed.configurable, false, 'unforgeable means non-configurable');
    assert.equal(observed.enumerable, true);
    assert.equal(observed.value, false, 'a script-constructed Event is not trusted');

    // 真实 Edge 的原型上确实没有它
    assert.equal(
      realPrototypes.Event.members.some((member) => member.name === 'isTrusted'),
      false,
      'precondition: the captured Edge Event.prototype has no isTrusted'
    );
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});

test('NetworkInformation.prototype matches the desktop Edge member set', async () => {
  const snapshot = await captureNv8Surface();
  const nv8 = snapshot.globals.NetworkInformation;
  assert.ok(nv8, 'NetworkInformation must exist');

  const nv8Names = nv8.prototypeMembers.map((member) => member.name).sort();
  const realNames = realPrototypes.NetworkInformation.members
    .map((member) => member.name).sort();

  // `type` 只在 Android Chromium 上存在；桌面 Edge 没有
  assert.equal(nv8Names.includes('type'), false, 'desktop Edge has no NetworkInformation.type');
  assert.deepEqual(nv8Names, realNames);
});

// ---------------------------------------------------- 缺失必须登记

test('every missing prototype member is registered with a reason', async () => {
  const snapshot = await captureNv8Surface();
  const unregistered = [];

  for (const row of diffMembers(snapshot)) {
    if (row.absent) {
      if (!KNOWN_MISSING_PROTOTYPES.includes(row.name)) {
        unregistered.push(`${row.name} (whole prototype)`);
      }
      continue;
    }
    const registered = KNOWN_MISSING_MEMBERS[row.name]?.members ?? [];
    for (const key of row.missing) {
      if (!registered.includes(key)) unregistered.push(`${row.name}.${key}`);
    }
  }

  assert.deepEqual(
    unregistered,
    [],
    'implement these or register them in KNOWN_MISSING_MEMBERS with a reason'
  );
});

test('registered member gaps carry substantive reasons', () => {
  for (const [name, entry] of Object.entries(KNOWN_MISSING_MEMBERS)) {
    assert.ok(entry.members.length > 0, `${name} has an empty member list`);
    assert.ok(
      entry.reason.length > 10,
      `${name} needs a real explanation, not a placeholder`
    );
  }
});

test('the registry has no stale entries', async () => {
  const snapshot = await captureNv8Surface();
  const actualMissing = new Map(
    diffMembers(snapshot)
      .filter((row) => !row.absent)
      .map((row) => [row.name, new Set(row.missing)])
  );

  // 登记了但其实已经实现的条目要删掉，否则清单会慢慢变成谎言
  const stale = [];
  for (const [name, entry] of Object.entries(KNOWN_MISSING_MEMBERS)) {
    const missing = actualMissing.get(name);
    for (const key of entry.members) {
      if (missing === undefined || !missing.has(key)) stale.push(`${name}.${key}`);
    }
  }

  assert.deepEqual(stale, [], 'these members now exist; drop them from KNOWN_MISSING_MEMBERS');
});

// ---------------------------------------------------- 覆盖率下限

test('prototype-level parity stays above the recorded floor', async () => {
  const snapshot = await captureNv8Surface();
  const rows = diffMembers(snapshot);
  const total = Object.keys(realPrototypes).length;
  const identical = total - rows.length;

  // 151 profile 下实测 966 原型中 963 个成员集完全一致；剩 3 个是 NV8
  // 压根没有的接口（见 KNOWN_MISSING_PROTOTYPES）。下限只允许上调。
  assert.ok(
    identical >= 963,
    `only ${identical}/${total} prototypes match exactly; expected at least 963`
  );
});

test('the member gap stays small enough to be meaningful', async () => {
  const snapshot = await captureNv8Surface();
  const rows = diffMembers(snapshot);
  const missingCount = rows.reduce((sum, row) => sum + row.missing.length, 0);

  // 上限只允许下调。13 → 9 是把对比基准改成 151 profile（那 4 条本来就实现了），
  // 9 → 0 是按真实 Edge 实测的 descriptor 形状把剩下的补齐。
  assert.ok(
    missingCount <= 0,
    `missing members grew to ${missingCount}; implement some before registering more`
  );
});
