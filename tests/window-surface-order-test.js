/**
 * Window 全局的枚举顺序与 descriptor 形状
 *
 * 这是与真实 Edge 对齐的第四条轴。前三条各有归属：
 * `edge-surface-parity-test.js` 比全局名的**存在性**，
 * `edge-member-parity-test.js` 比**原型成员**，
 * `edge-behavior-parity-test.js` 比**运行时行为**。
 * 谁都没有比过 `Object.getOwnPropertyNames(window)` 的**顺序**，以及 window
 * 自身那 1175 个 own property 的 descriptor flag。
 *
 * ## 为什么必须同时断言多个 profile 版本
 *
 * 这份测试抓住的 bug 只在「profile 版本 ≠ 数据表默认版本」时可见：
 * `FontFaceSet` 只在 `browserMajorVersion >= 151` 暴露，而旧的顺序实现是一份
 * 1.5 万行生成代码、表达不了版本门控，于是它落在索引 **61**（紧随 V8 内建之后），
 * 真实 Edge 是 **517**——其后 1171 个全局的索引全部偏移一位。
 *
 * 只测默认 150 profile 永远是绿的，因为 150 下这一项本来就不该存在。这与
 * `intl-default-locale-test.js` / `ua-default-font-locale-test.js` 是同一类
 * 陷阱：在与 profile 同维度的默认值上测试，看不见跟随失败。
 *
 * ## 为什么行为探针验不了这一层
 *
 * 探针的期望值来自真实 Edge 的一次采集，而顺序是 1175 项的一个序列——把它
 * 写成探针等于把 fixture 抄进断言。这里比的是「实现是否忠实于数据表」与
 * 「数据表是否忠实于采集」，属于内部一致性，与 ADR-0006 的三层职责不重叠。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  WINDOW_GLOBAL_ORDER,
  WINDOW_GLOBAL_SHAPES,
} from '../src/surface/install/window-surface-order.js';
import {
  V8_BUILTIN_PREFIX,
  buildOrderRows,
  parseOrderRows,
  renderOrderTable,
  shapeNameOf,
} from '../scripts/build-window-surface-order.mjs';
import { edge150Fingerprint } from '../src/infra/fingerprint/edge-150.js';
import { edge151Fingerprint } from '../src/infra/fingerprint/edge-151.js';
import {
  CAPABILITY_STATUS,
  detectHostCapabilities,
} from '../src/engine/core/host-capabilities.js';

const FIXTURE_URL = new URL('../fixtures/fingerprint/edge-globals.json', import.meta.url);
const TABLE_URL = new URL('../src/surface/install/window-surface-order.js', import.meta.url);

const fixture = JSON.parse(await readFile(FIXTURE_URL, 'utf8'));
const tableSource = await readFile(TABLE_URL, 'utf8');

const tableNames = WINDOW_GLOBAL_ORDER.map((entry) => entry[0]);
const shapeSet = new Set(Object.values(WINDOW_GLOBAL_SHAPES));

// ------------------------------------------------------------ 实时捕获

/**
 * 每个 profile 版本各起一个 sandbox，把 window 的 own property 名与 descriptor
 * 一次性取出来供全部断言复用。
 *
 * @type {Map<number, Promise<{names: string[], descriptors: Record<string, object>}>>}
 */
const captures = new Map();

function captureWindow(fingerprint) {
  const major = fingerprint.browserMajorVersion;
  if (!captures.has(major)) {
    captures.set(major, (async () => {
      const { createSandbox } = await import('../src/public/create-sandbox.js');
      const sandbox = await createSandbox('https://surface-order.test/', {
        page: { html: '<!doctype html><html><head></head><body></body></html>' },
        fingerprint,
        // 全表面自省是重型操作，默认 1000ms 超时是给不受信页面脚本的安全上限，
        // 不是「自省该有多快」的断言。绑在默认值上会在并行负载下随机超时。
        limits: { maxOutputBytes: 16 * 1024 * 1024, timeoutMs: 30_000 },
      });
      try {
        return JSON.parse(await sandbox.run(`JSON.stringify((() => {
          const names = Object.getOwnPropertyNames(globalThis);
          const descriptors = {};
          for (const name of names) {
            const entry = Object.getOwnPropertyDescriptor(globalThis, name);
            descriptors[name] = {
              kind: (entry.get !== undefined || entry.set !== undefined)
                ? 'accessor' : 'value',
              writable: 'writable' in entry ? entry.writable : null,
              enumerable: entry.enumerable,
              configurable: entry.configurable,
              hasGet: typeof entry.get === 'function',
              hasSet: typeof entry.set === 'function',
            };
          }
          return { names, descriptors };
        })())`));
      } finally {
        await sandbox.close();
        createSandbox.drain();
      }
    })());
  }
  return captures.get(major);
}

/** 只保留两侧都有的名字，比它们的相对顺序。 */
function sharedOrder(names, reference) {
  const present = new Set(names);
  const referenceSet = new Set(reference);
  return {
    expected: reference.filter((name) => present.has(name)),
    actual: names.filter((name) => referenceSet.has(name)),
  };
}

/**
 * 只取数据表管的那一段。
 *
 * V8 内建段不由 NV8 安装也不由它重排（见数据表的头部注释），把它掺进
 * “NV8 是否忠实于表”的断言里，会让宿主 V8 的注册顺序差异污染结论。
 * 宿主那一段单独一条断言。
 */
function managedSegment(names) {
  const managed = new Set(tableNames);
  return names.filter((name) => managed.has(name));
}

/**
 * 找出「最少要挑出哪几项才能让两个序列一致」。
 *
 * 逐位比不能用：一项错位会把其后所有项都报成差异（实测 Node 22 上
 * `Iterator` 一项错位报出 20 项）。取最长递增子序列，剩下的就是真正换了
 * 位置的那几项。
 */
function misplacedAgainst(actual, expected) {
  const rank = new Map(expected.map((name, index) => [name, index]));
  const positions = actual.map((name) => rank.get(name));
  const best = new Array(positions.length).fill(1);
  const previous = new Array(positions.length).fill(-1);
  let endIndex = 0;
  for (let i = 0; i < positions.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (positions[j] < positions[i] && best[j] + 1 > best[i]) {
        best[i] = best[j] + 1;
        previous[i] = j;
      }
    }
    if (best[i] > best[endIndex]) endIndex = i;
  }
  const keep = new Set();
  for (let i = endIndex; i !== -1; i = previous[i]) keep.add(actual[i]);
  return actual.filter((name) => !keep.has(name));
}

// -------------------------------------------------- 宿主级限制的豁免

/**
 * Node 18/20 上全局枚举顺序**做不到**与真实 Edge 一致。
 *
 * V8 10.x / 11.x 在 dictionary 模式的 global object 上把可枚举键排在不可枚举键
 * 之前，不按插入序。而 `enumerable` 本身是要复现的契约值，不能为了顺序去改——
 * 所以这不是能绕过去的实现问题，是宿主限制，与 ICU 数据版本、V8 的 Intl 错误
 * 文案同类。探针在 `src/core/host-capabilities.js` 的 `vm.global-property-order`，
 * `npm run capabilities` 能直接看到。
 *
 * 豁免用**反向断言**而不是 `return` 跳过：宿主哪天修好了，反向断言会红，逼人
 * 删掉豁免。沉默跳过的分支和不存在的断言等价。
 */
const GLOBAL_ORDER_IS_INSERTION = detectHostCapabilities()
  .capabilities['vm.global-property-order'].status === CAPABILITY_STATUS.AVAILABLE;

function assertOrder(actual, expected, label) {
  if (GLOBAL_ORDER_IS_INSERTION) {
    assert.deepEqual(actual, expected, label);
    return;
  }
  assert.notDeepEqual(
    actual,
    expected,
    `${label}：宿主的 vm.global-property-order 报 broken，顺序本该不一致。`
    + '现在一致了说明宿主修好了——删掉这个豁免，别让它继续放行。'
  );
}

/**
 * 断言某个全局的**绝对**索引。
 *
 * 期望值不能直接用 fixture 的索引：宿主缺 `Iterator`（Node < 22）之类的 V8 内建
 * 时，其后每一项都平移一位。按「fixture 里排在它前面、且宿主也有的名字数」算，
 * 对任何宿主缺失都自动正确，不必再维护一份版本登记表。
 */
function assertIndex(names, target, label) {
  const present = new Set(names);
  const expected = fixture.globals
    .slice(0, fixture.globals.indexOf(target))
    .filter((name) => present.has(name)).length;
  if (GLOBAL_ORDER_IS_INSERTION) {
    assert.equal(names.indexOf(target), expected, label);
    return;
  }
  assert.notEqual(
    names.indexOf(target),
    expected,
    `${label}：宿主 vm.global-property-order 报 broken，索引本该错位。`
    + '现在对上了说明宿主修好了——删掉这个豁免。'
  );
}

// -------------------------------------------------------- 数据表自洽性

test('the order table has no duplicate names', () => {
  assert.equal(new Set(tableNames).size, tableNames.length);
});

test('every row references a known descriptor shape', () => {
  for (const entry of WINDOW_GLOBAL_ORDER) {
    assert.ok(shapeSet.has(entry[1]), `${entry[0]} 的形状不在 WINDOW_GLOBAL_SHAPES 里`);
  }
});

test('the order table covers the fixture exactly, minus the V8 builtin prefix', () => {
  assert.deepEqual(
    fixture.globals.slice(0, V8_BUILTIN_PREFIX.length),
    [...V8_BUILTIN_PREFIX],
    'V8 内建前缀变了；引擎侧注册顺序变化必须人工核对，不能顺手对齐常量'
  );
  assert.deepEqual(tableNames, fixture.globals.slice(V8_BUILTIN_PREFIX.length));
});

test('the table on disk round-trips through the build script', () => {
  // 校验脚本能原样重建磁盘上的表，否则 `--write` 会引入无关 diff，
  // 换基准时就分不清哪些改动是采集带来的。
  const header = tableSource.slice(0, tableSource.indexOf('export const WINDOW_GLOBAL_ORDER'));
  const rows = parseOrderRows(tableSource);
  const { rows: rebuilt } = buildOrderRows({
    fixtureGlobals: fixture.globals,
    fixtureDescriptors: fixture.descriptors ?? null,
    existingRows: rows,
  });
  assert.equal(renderOrderTable({ rows: rebuilt, header }), tableSource);
});

test('gate fields only use the documented keys', () => {
  const allowed = new Set(['since', 'before', 'pending']);
  for (const entry of WINDOW_GLOBAL_ORDER) {
    if (entry[2] === undefined) continue;
    for (const key of Object.keys(entry[2])) {
      assert.ok(allowed.has(key), `${entry[0]} 的门控里有未定义的键 ${key}`);
    }
    if (entry[2].pending !== undefined) {
      assert.ok(
        typeof entry[2].pending === 'string' && entry[2].pending.length > 10,
        `${entry[0]} 的 pending 需要实质理由，不是占位符`
      );
    }
  }
});

// --------------------------------------------- 采集 fixture 的 descriptors

test('the globals fixture predates the descriptors field', () => {
  // 采集器现在会输出 `descriptors`，但仓库里这份 fixture 采于 Edge 151，
  // 而本机 Edge 已是 152——不能为了补字段就把基准偷换成 152（"采集基准版本
  // 必须与 profile 一致"，这个坑踩过两次）。
  //
  // 这条断言是个 forcing function：换基准重采后它会红，逼人删掉它并打开
  // 下面那条真正的形状校验。写成 `if (fixture.descriptors) { ... }` 就成了
  // 永远不执行的分支——那和没有断言等价。
  assert.equal(
    fixture.descriptors,
    undefined,
    '重采过了？删掉这条断言，并把下一条改成无条件执行'
  );
  assert.match(fixture.userAgent, /Edg\/151\./);
});

test('when the fixture carries descriptors they must match the table', () => {
  if (fixture.descriptors === undefined) {
    // 上一条断言保证了这个分支只在重采前成立，不是沉默跳过。
    return;
  }
  const byName = new Map(WINDOW_GLOBAL_ORDER.map((entry) => [entry[0], entry[1]]));
  for (const [name, descriptor] of Object.entries(fixture.descriptors)) {
    const shape = byName.get(name);
    if (shape === undefined) continue;
    assert.equal(
      shapeNameOf(descriptor),
      Object.keys(WINDOW_GLOBAL_SHAPES).find((key) => WINDOW_GLOBAL_SHAPES[key] === shape),
      `${name} 的形状与采集值不符`
    );
  }
});

// ------------------------------------------------ 实现忠实于表：150 profile

test('at the 150 profile the enumeration order matches real Edge verbatim', async () => {
  const { names } = await captureWindow(edge150Fingerprint);
  const { expected, actual } = sharedOrder(managedSegment(names), tableNames);
  assertOrder(actual, expected, '150 profile 下数据表管的那一段');
});

test('the V8 builtin prefix precedes everything the table manages', async () => {
  // finalize 生效的直接证据：表内 1175 项全删后重装，必然排在未删除的
  // V8 内建之后。Node 18/20 就是在这里碎的：238 项跑到了内建前面。
  const { names } = await captureWindow(edge150Fingerprint);
  const builtins = new Set(V8_BUILTIN_PREFIX);
  const lastBuiltin = names.reduce(
    (last, name, index) => (builtins.has(name) ? index : last),
    -1,
  );
  const firstManaged = names.findIndex((name) => tableNames.includes(name));
  if (GLOBAL_ORDER_IS_INSERTION) {
    assert.ok(
      lastBuiltin < firstManaged,
      `V8 内建段末尾在 ${lastBuiltin}，表管的第一项在 ${firstManaged}`
    );
    return;
  }
  assert.ok(
    lastBuiltin > firstManaged,
    '宿主 vm.global-property-order 报 broken，内建段本该被打散。'
    + '现在没被打散说明宿主修好了——删掉这个豁免。'
  );
});

test('V8 builtin ordering deviations from Chromium are registered', async () => {
  // 内建段的顺序由宿主 V8 决定。它与 Chromium 不一致就是一处真实的指纹偏差，
  // 所以要登记，不能因为“不是 NV8 装的”就不算。
  //
  // 实测（Node 22 vs Chromium 152）就两组：
  //   TypedArray 家族  V8 12.4：Float32 Float64 Uint8Clamped BigUint64 BigInt64
  //                     Chromium：BigUint64 BigInt64 Uint8Clamped Float32 Float64
  //   Iterator          V8 12.4 排在 console 之后（索引 60），Chromium 在 Set 之后（44）
  // Node 24 与 Chromium 逐位一致。
  //
  // 抹平它需要把重排起点从 `Option` 前移到 TypedArray 段，即把下半截 V8 内建
  // 也删除重装。整段重排做不到：`undefined` / `NaN` / `Infinity` 不可配置，
  // 删不掉。已登记为独立项（REMAINING_TASKS.md）。
  //
  // **不做过时登记检查**：登记是跟宿主的，某一档上没出现不等于登记过时
  // （Node 24 上一项也不会出现）。这与其他登记表的规矩不同，理由写在这里
  // 以免被当成遗漏。
  const registered = new Set([
    // TypedArray 家族的组内重排
    'Uint8ClampedArray', 'BigUint64Array', 'BigInt64Array',
    'Float32Array', 'Float64Array', 'Atomics',
    // Iterator 的位置
    'Iterator',
  ]);

  const { names } = await captureWindow(edge150Fingerprint);
  const builtins = new Set(V8_BUILTIN_PREFIX);
  const actual = names.filter((name) => builtins.has(name));
  const expected = fixture.globals
    .filter((name) => builtins.has(name) && actual.includes(name));
  const unregistered = misplacedAgainst(actual, expected)
    .filter((name) => !registered.has(name));
  assert.deepEqual(
    unregistered,
    [],
    `这些 V8 内建的位置与 Chromium 不同且未登记：${unregistered.join(', ')}`
  );
});

test('at the 150 profile the V8 builtin prefix sits where real Edge has it', async () => {
  const { names } = await captureWindow(edge150Fingerprint);
  // 前缀由 V8 注册，NV8 不重排它。逐位对齐是"表里不含这 61 项"的前提，
  // 前提垮了整张表的索引都不对。`Iterator` 在 Node 22 上错位（已登记），
  // 所以只抽查不受它影响的两端。
  assertIndex(names, 'Object', 'Object 是第一项');
  assertIndex(names, 'Option', 'Option 是第一个 WebIDL 全局');
});

test('the host is explicit about whether global order can match at all', () => {
  // 把豁免的前提本身写成断言：上面那些反向断言只在 `broken` 时才成立，
  // 而「为什么 broken」必须有可行动的理由——否则下一个人只会看到一堆不知道
  // 为何反着写的断言。
  const record = detectHostCapabilities().capabilities['vm.global-property-order'];
  assert.ok(
    record.status === CAPABILITY_STATUS.AVAILABLE
    || record.status === CAPABILITY_STATUS.BROKEN,
    `意外的能力状态：${record.status}`
  );
  if (record.status === CAPABILITY_STATUS.BROKEN) {
    assert.match(record.reason, /insertion order/);
    assert.match(record.reason, /Node 22\+/);
  } else {
    assert.equal(record.reason, null);
  }
});

// ------------------------------------------------ 实现忠实于表：151 profile

test('at the 151 profile the enumeration order matches real Edge verbatim', async () => {
  const { names } = await captureWindow({
    ...edge151Fingerprint,
    browserMajorVersion: 151,
  });
  const { expected, actual } = sharedOrder(managedSegment(names), tableNames);
  assertOrder(actual, expected, '151 profile 下数据表管的那一段');
});

test('a since-gated global lands at its real index, not appended', async () => {
  // 这条就是被修掉的 bug。旧实现下 FontFaceSet 在 151 profile 里是索引 61；
  // 断言真实索引而不是"存在"，因为存在性早就是绿的。
  const { names } = await captureWindow({
    ...edge151Fingerprint,
    browserMajorVersion: 151,
  });
  assert.equal(names.includes('FontFaceSet'), true);
  assertIndex(names, 'FontFaceSet', 'FontFaceSet 落在真实索引上');
  assert.notEqual(
    names.indexOf('FontFaceSet'),
    V8_BUILTIN_PREFIX.length,
    '紧跟 V8 内建段就是旧实现"没进表所以排在最前"的症状'
  );
});

test('a since-gated global is absent below its version', async () => {
  const { names } = await captureWindow(edge150Fingerprint);
  assert.equal(names.includes('FontFaceSet'), false);
});

// ------------------------------------------------------------ pending 登记

test('pending globals are absent at every profile version', async () => {
  const pending = WINDOW_GLOBAL_ORDER
    .filter((entry) => entry[2]?.pending !== undefined)
    .map((entry) => entry[0]);
  assert.ok(pending.length > 0, 'pending 清空了？把这条测试改成断言 length === 0');

  for (const fingerprint of [
    edge150Fingerprint,
    { ...edge151Fingerprint, browserMajorVersion: 151 },
  ]) {
    const { names } = await captureWindow(fingerprint);
    for (const name of pending) {
      assert.equal(
        names.includes(name),
        false,
        `${name} 登记为未实现却存在于 ${fingerprint.browserMajorVersion} profile；`
        + '实现好了就删掉表里的 pending 字段'
      );
    }
  }
});

// ------------------------------------------------------ descriptor 形状

test('every window own descriptor matches the shape the table declares', async () => {
  const { descriptors } = await captureWindow({
    ...edge151Fingerprint,
    browserMajorVersion: 151,
  });
  const mismatched = [];
  for (const entry of WINDOW_GLOBAL_ORDER) {
    const [name, shape, gate] = entry;
    const actual = descriptors[name];
    if (actual === undefined) continue;
    const wrong = actual.kind !== (shape.accessor ? 'accessor' : 'value')
      || actual.enumerable !== shape.enumerable
      || actual.configurable !== shape.configurable
      || (!shape.accessor && actual.writable !== shape.writable);
    if (wrong) mismatched.push({ name, gate, actual, shape });
  }
  assert.deepEqual(mismatched, []);
});

test('window.chrome is configurable, as real Edge has it', async () => {
  // 旧生成文件把它写成 `configurable: false`——1171 项里唯一的不可配置数据属性。
  // 实测真实 Edge 152 是 `configurable: true`，且 WebIDL 没有任何机制产生不可
  // 配置的数据属性（`[LegacyUnforgeable]` 产生的是访问器）。
  //
  // 后果不是形状好看不好看：不可配置会让 `delete window.chrome` 返回 false、
  // `Object.defineProperty(window, 'chrome', …)` 抛 TypeError，而改写
  // window.chrome 正是反爬脚本常做的事。
  const { descriptors } = await captureWindow(edge150Fingerprint);
  assert.deepEqual(
    {
      kind: descriptors.chrome.kind,
      writable: descriptors.chrome.writable,
      enumerable: descriptors.chrome.enumerable,
      configurable: descriptors.chrome.configurable,
    },
    { kind: 'value', writable: true, enumerable: true, configurable: true }
  );
});

test('the four unforgeable attributes stay non-configurable', async () => {
  const { descriptors } = await captureWindow(edge150Fingerprint);
  for (const name of ['window', 'document', 'location', 'top']) {
    assert.equal(descriptors[name].configurable, false, name);
    assert.equal(descriptors[name].kind, 'accessor', name);
  }
});

test('read-only window attributes expose no setter', async () => {
  // 表只声明 flag，get/set 取捕获值。真实 Edge 152 实测这 26 项只有 getter；
  // 多出一个 setter 是可识别特征，而 flag 层看不见。
  const readOnly = [
    'window', 'document', 'customElements', 'history', 'closed', 'top',
    'frameElement', 'navigator', 'styleMedia', 'isSecureContext',
    'crossOriginIsolated', 'trustedTypes', 'crypto', 'indexedDB',
    'localStorage', 'sessionStorage', 'crashReport', 'cookieStore', 'caches',
    'documentPictureInPicture', 'sharedStorage', 'originAgentCluster',
    'credentialless', 'fence', 'launchQueue', 'speechSynthesis',
  ];
  const { descriptors } = await captureWindow(edge150Fingerprint);
  const withSetter = readOnly.filter((name) => descriptors[name]?.hasSet === true);
  assert.deepEqual(withSetter, []);
});

// ------------------------------------------- 151 新增接口的原型成员顺序

/**
 * 原型成员的**枚举顺序**也是指纹的一维，而且是一个新发现的检测面：
 * `edge-member-parity-test.js` 比的是成员**集合**（fixture 里已经排过序），
 * 谁都没比过顺序。实测 963 个共有原型里有 22 个顺序不一致，已登记为独立项
 * （见 REMAINING_TASKS.md）。
 *
 * 这一节只守本轮新实现的两个接口，不把那 22 处一并括进来——永久红的断言
 * 和没有断言等价。期望值实测自真实 Edge 152。
 */
const EDGE_151_PROTOTYPE_ORDER = Object.freeze({
  // 注意 `constructor` 夹在中间：`paintTime` / `presentationTime` 在 Chromium 里
  // 是后置注册的。按「先装完所有成员再装 backlink」的惯例写会把 constructor
  // 排到末尾（`LargestContentfulPaint` 就是这么错的，在那 22 处里）。
  InteractionContentfulPaint: [
    'largestContentfulPaint', 'interactionId', 'toJSON',
    'constructor', 'paintTime', 'presentationTime',
  ],
  PerformanceSoftNavigation: [
    'navigationType', 'interactionId', 'getLargestInteractionContentfulPaint',
    'constructor', 'paintTime', 'presentationTime',
  ],
});

test('the 151-only performance entries match real Edge member order', async () => {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://surface-order.test/', {
    page: { html: '<!doctype html><html><head></head><body></body></html>' },
    fingerprint: { ...edge151Fingerprint, browserMajorVersion: 151 },
    limits: { maxOutputBytes: 4 * 1024 * 1024, timeoutMs: 30_000 },
  });
  try {
    const observed = JSON.parse(await sandbox.run(`JSON.stringify((() => {
      const out = {};
      for (const name of ${JSON.stringify(Object.keys(EDGE_151_PROTOTYPE_ORDER))}) {
        const Constructor = globalThis[name];
        out[name] = {
          members: Object.getOwnPropertyNames(Constructor.prototype),
          inheritsPerformanceEntry:
            Object.getPrototypeOf(Constructor.prototype) === PerformanceEntry.prototype
            && Object.getPrototypeOf(Constructor) === PerformanceEntry,
          toStringTag: Object.getOwnPropertyDescriptor(
            Constructor.prototype, Symbol.toStringTag,
          ).value,
        };
      }
      return out;
    })())`));
    for (const [name, expected] of Object.entries(EDGE_151_PROTOTYPE_ORDER)) {
      assert.deepEqual(observed[name].members, [...expected], name);
      assert.equal(observed[name].inheritsPerformanceEntry, true, name);
      assert.equal(observed[name].toStringTag, name);
    }
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});

// ------------------------------------------------- 生成脚本的失败路径

test('buildOrderRows refuses a fixture whose builtin prefix drifted', () => {
  assert.throws(
    () => buildOrderRows({
      fixtureGlobals: ['NotObject', ...fixture.globals.slice(1)],
      fixtureDescriptors: null,
      existingRows: parseOrderRows(tableSource),
    }),
    /V8 内建前缀/
  );
});

test('buildOrderRows refuses to silently drop a name the fixture lost', () => {
  const rows = parseOrderRows(tableSource);
  const dropped = fixture.globals.filter((name) => name !== 'HTMLDivElement');
  assert.throws(
    () => buildOrderRows({
      fixtureGlobals: dropped,
      fixtureDescriptors: null,
      existingRows: rows,
    }),
    /HTMLDivElement/,
    '采集里少了一个已有全局时必须报错——静默删掉等于悄悄缩小 surface'
  );
});

test('buildOrderRows keeps a gated name the fixture version lacks, in place', () => {
  // 换基准时真实场景：某全局在新版 Edge 被移除，要改成 `{ before: N }` 而不是
  // 删掉，否则旧 profile 会静默少一个全局。位置靠现表里的前驱锚定。
  const rows = parseOrderRows(tableSource);
  const index = rows.findIndex((row) => row.name === 'HTMLDivElement');
  const patched = rows.map((row, position) => (
    position === index ? { ...row, gate: { before: 151 } } : row
  ));
  const { rows: rebuilt } = buildOrderRows({
    fixtureGlobals: fixture.globals.filter((name) => name !== 'HTMLDivElement'),
    fixtureDescriptors: null,
    existingRows: patched,
  });
  assert.equal(rebuilt.length, rows.length);
  assert.equal(rebuilt[index].name, 'HTMLDivElement');
  assert.deepEqual(rebuilt[index].gate, { before: 151 });
});

test('buildOrderRows refuses a new global with no shape source', () => {
  assert.throws(
    () => buildOrderRows({
      fixtureGlobals: [...fixture.globals, 'BrandNewInterface'],
      fixtureDescriptors: null,
      existingRows: parseOrderRows(tableSource),
    }),
    /BrandNewInterface/
  );
});

test('shapeNameOf refuses a descriptor combination outside the known shapes', () => {
  assert.throws(
    () => shapeNameOf({
      kind: 'value', writable: false, enumerable: false, configurable: false,
    }),
    /不在已知形状内/
  );
});

test('shapeNameOf classifies each known shape back to its own key', () => {
  for (const [key, flags] of Object.entries(WINDOW_GLOBAL_SHAPES)) {
    assert.equal(
      shapeNameOf({
        kind: flags.accessor ? 'accessor' : 'value',
        writable: flags.writable,
        enumerable: flags.enumerable,
        configurable: flags.configurable,
      }),
      key
    );
  }
});
