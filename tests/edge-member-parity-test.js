/**
 * 与真实 Edge 的**原型成员**对等性
 *
 * `edge-surface-parity-test.js` 比的是全局名的存在性——最表层的一维。
 * 这份比的是每个构造函数原型上的成员明细：`fetch` 存在不代表
 * `Response.prototype` 的成员齐全。成员名之后还要比 descriptor 形状
 * （数据属性 vs 访问器，以及 writable/enumerable/configurable/get/set）：
 * 名字对不代表检测脚本 `Object.getOwnPropertyDescriptor()` 能拿到同样的结果。
 *
 * 两个正交轴各自有独立的消费者与登记表：
 * - **成员名**：`diffMembers()` + 下方三个名单。
 * - **descriptor 形状**：`diffDescriptors()` + `KNOWN_DESCRIPTOR_DIFFERENCES`。
 * - **方法 length**：`tests/edge-length-axis-test.js`（fixture 覆盖 3508 个方法）。
 *
 * 版本门控派生出的 153 profile 顺序不变量由
 * `tests/prototype-order-version-gate-test.js` 单独覆盖；本文件只做
 * 152 基准下的逐成员对等性，两者互补。
 *
 * 数据来源：
 * - 真实 Edge：`fixtures/fingerprint/edge-members.json`
 *   （`npm run fingerprint:members`，969 原型 / 8957 成员；成员顺序保留）
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

import {
  NODE_VERSION_DEPENDENT_MEMBERS,
  expectedMissingForNode,
  expectedMissingMemberForNode,
} from '../src/infra/baseline/known-differences.js';
import { WINDOW_GLOBAL_ORDER } from '../src/surface/install/window-surface-order.js';

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

/**
 * NV8 完全没有的原型。
 *
 * 从 `src/surface/install/window-surface-order.js` 的 `pending` 字段读，不在这里另列
 * 一份名单——旧版本这里写死三个名字并注“理由见 edge-surface-parity-test.js”，
 * 那就是同一份账目挂在三处。
 */
const KNOWN_MISSING_PROTOTYPES = Object.freeze(
  WINDOW_GLOBAL_ORDER
    .filter((entry) => entry[2]?.pending !== undefined)
    .map((entry) => entry[0])
);

/**
 * 剔除由宿主 Node 版本造成的缺口。
 *
 * `Iterator` / `ArrayBuffer.prototype.transfer` / `Set` 的集合运算都是 V8 语言
 * 内建，旧版 Node 的 V8 里压根没有。它们**不是** NV8 的缺口，登记在
 * `src/infra/baseline/known-differences.js`（与 baseline 共用同一份登记表，
 * 各写一份必然漂移）。
 *
 * 不这么做的后果是 Node 18/20 上永久红 5 项——而永久红的断言和没有断言等价，
 * 很快就会被学会忽略，真正的回归也就跟着被忽略。
 *
 * @param {ReadonlyArray<object>} rows `diffMembers()` 的输出
 * @returns {object[]} 过滤后的差异行；整条被解释掉的会被移除
 */
function withoutNodeVersionGaps(rows) {
  const kept = [];
  for (const row of rows) {
    if (row.absent) {
      if (expectedMissingForNode(row.name) !== null) continue;
      kept.push(row);
      continue;
    }
    const missing = row.missing.filter(
      (key) => expectedMissingMemberForNode(row.name, key) === null,
    );
    if (missing.length === 0 && row.extra.length === 0) continue;
    kept.push({ ...row, missing });
  }
  return kept;
}

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
      const { captureFullSurface } = await import('../src/infra/baseline/full-surface.js');
      const { createSandbox } = await import('../src/public/create-sandbox.js');
      const { edge152Fingerprint } = await import('../src/infra/fingerprint/edge-152.js');
      const sandbox = await createSandbox('https://baseline.test/', {
        page: { html: '<!doctype html><html><head></head><body></body></html>' },
        // 采集基准是真实 Edge **152**，所以对比也必须用 152 profile。
        //
        // 之前用默认的 150 profile 对比 152 fixture，凡是 `edge151Surface`
        // 门控的成员都会被误报成缺口——`FontFaceSet`、`PerformanceEntry.navigationId`、
        // `WheelEvent.momentum`、`AnimationEvent.animation` 都是这么进登记表的。
        // 版本差异不是缺陷；基准版本必须与 profile 对齐。
        fingerprint: { ...edge152Fingerprint, browserMajorVersion: 152 },
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

/**
 * 已登记的 descriptor 形状差异。
 *
 * 目标是保持为空。152 基准下实测 8957 个成员的形状逐字段一致，因此没有
 * 条目。形状本身（可写数据属性 vs 访问器 / getter+setter 组合）就是可检测
 * 特征，新增条目必须写明为什么对不上、由谁收敛。
 */
const KNOWN_DESCRIPTOR_DIFFERENCES = Object.freeze({});

/**
 * 把 fixture / NV8 采到的 descriptor 压成可比对、可读的形状。
 *
 * fixture 的 JSON 无法表达 `undefined`：数据属性的 `getter` / `setter` 是
 * `false`、访问器的 `writable` 是 `null`。两边采集口径一致，所以直接逐字段
 * 比较布尔与 null，不做 `undefined` 回填。
 */
function descriptorShapeOf(descriptor) {
  return {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    writable: descriptor.writable,
    getter: descriptor.getter,
    setter: descriptor.setter,
    valueType: descriptor.valueType,
  };
}

/**
 * 逐成员比对 descriptor 形状，返回 `{ compared, diffs }`。
 *
 * 只断言 fixture 有信息的部分：descriptor 为 `null` 或 `unreadable` 的成员
 * 跳过。NV8 侧缺失的成员（宿主 Node 版本的 V8 语言内建缺口）同样跳过——
 * 「成员名缺失」由 `diffMembers()` 与登记表负责，这里不重复报。
 */
function diffDescriptors(snapshot) {
  const diffs = [];
  let compared = 0;
  for (const [name, entry] of Object.entries(realPrototypes)) {
    const nv8 = snapshot.globals[name];
    if (nv8 === undefined || nv8.prototypeMembers === null) continue;
    const nv8ByName = new Map(
      nv8.prototypeMembers.map((member) => [member.name, member]),
    );
    for (const member of entry.members) {
      const expectedDescriptor = member.descriptor;
      if (expectedDescriptor === null || expectedDescriptor === undefined) continue;
      if (expectedDescriptor.unreadable === true) continue;
      const actualDescriptor = nv8ByName.get(member.name)?.descriptor ?? null;
      if (actualDescriptor === null || actualDescriptor.unreadable === true) continue;
      compared += 1;
      const expected = descriptorShapeOf(expectedDescriptor);
      const actual = descriptorShapeOf(actualDescriptor);
      if (JSON.stringify(expected) !== JSON.stringify(actual)) {
        diffs.push({ key: `${name}.${member.name}`, expected, actual });
      }
    }
  }
  return { compared, diffs };
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

    // 真实 Edge 152 的实测结果，逐字段对齐
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

  for (const row of withoutNodeVersionGaps(diffMembers(snapshot))) {
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

// ---------------------------------------------------- descriptor 形状

test('descriptor shapes match real Edge for every comparable member', async () => {
  const snapshot = await captureNv8Surface();
  const { compared, diffs } = diffDescriptors(snapshot);
  const total = Object.values(realPrototypes)
    .reduce((sum, entry) => sum + entry.members.length, 0);

  // 覆盖率下限而不是固定值：宿主 Node 版本会砍掉少数 V8 语言内建
  // （见 `known-differences.js`），但 969 个原型的主体必须都比到。
  // 只在可比对的子集上断言，避免把「宿主缺成员」误报成 descriptor 回归。
  assert.ok(
    compared >= 8500,
    `descriptor sample too small: ${compared} of ${total} captured members`
  );
  assert.ok(
    compared / total >= 0.9,
    `descriptor sample covers only ${compared}/${total} captured members`
  );

  // 断言消息带成员名与期望/实际形状，失败时不需要再去翻 fixture
  const failures = diffs
    .filter((diff) => KNOWN_DESCRIPTOR_DIFFERENCES[diff.key] === undefined)
    .map((diff) => `${diff.key}\n    真实: ${JSON.stringify(diff.expected)}`
      + `\n    NV8 : ${JSON.stringify(diff.actual)}`);

  assert.deepEqual(
    failures,
    [],
    'these descriptor shapes are detectable deviations; fix them or register '
    + 'them in KNOWN_DESCRIPTOR_DIFFERENCES with a reason'
  );
});

test('the descriptor registry has no stale entries', async () => {
  const snapshot = await captureNv8Surface();
  const actual = new Set(diffDescriptors(snapshot).diffs.map((diff) => diff.key));

  // 登记了但其实已经一致的条目要删掉，否则清单会慢慢变成谎言
  const stale = [];
  for (const [key, reason] of Object.entries(KNOWN_DESCRIPTOR_DIFFERENCES)) {
    assert.ok(reason.length > 10, `${key} needs a real explanation, not a placeholder`);
    if (!actual.has(key)) stale.push(key);
  }

  assert.deepEqual(stale, [], 'these descriptor shapes now match; drop them from the registry');
});

// ---------------------------------------------------- 覆盖率下限

test('prototype-level parity stays above the recorded floor', async () => {
  const snapshot = await captureNv8Surface();
  const rows = withoutNodeVersionGaps(diffMembers(snapshot));
  const total = Object.keys(realPrototypes).length;
  const identical = total - rows.length;

  // 152 profile 下实测 969 个原型的成员集全部一致。下限只允许上调。
  //
  // 宿主 Node 版本造成的缺口先剔除，否则同一份代码在 Node 18/20 上会因为
  // V8 没有 `Set.prototype.union` 之类而"覆盖率下降"——那不是覆盖率问题。
  assert.ok(
    identical >= 963,
    `only ${identical}/${total} prototypes match exactly; expected at least 963`
  );
});

test('the member gap stays small enough to be meaningful', async () => {
  const snapshot = await captureNv8Surface();
  const rows = withoutNodeVersionGaps(diffMembers(snapshot));
  const missingCount = rows.reduce((sum, row) => sum + row.missing.length, 0);

  // 上限只允许下调。152 基准切换后新增的 Range、value range 和元素表面也必须保持
  // 零缺失，不能通过放宽上限隐藏回归。
  assert.ok(
    missingCount <= 0,
    `missing members grew to ${missingCount}; implement some before registering more`
  );
});

/**
 * 版本门控不能变成万能豁免。
 *
 * 登记表里的每条都必须在**当前** Node 上真的解释掉了某个缺口，或者当前 Node
 * 高于它的门槛。否则一条写错原型名的条目会永远静静躺着，看起来像已经处理过。
 */
test('the Node-version member registry has no dead entries', () => {
  const dead = [];
  for (const entry of NODE_VERSION_DEPENDENT_MEMBERS) {
    if (realPrototypes[entry.prototype] === undefined) {
      dead.push(`${entry.prototype} is not a prototype real Edge exposes`);
      continue;
    }
    const realNames = new Set(
      realPrototypes[entry.prototype].members.map((member) => member.name),
    );
    for (const member of entry.members) {
      if (!realNames.has(member)) {
        dead.push(`${entry.prototype}.${member} does not exist in real Edge either`);
      }
    }
  }
  assert.deepEqual(dead, [], 'these registry entries explain nothing');
});
