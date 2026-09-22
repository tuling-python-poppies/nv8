/**
 * 与真实 Edge 的 surface 差异清单
 *
 * Baseline 保证「NV8 自己前后一致」，保证不了「与真实浏览器一致」。这份测试
 * 补上后者：把 NV8 暴露的全局与真实 Edge 采集结果逐个对比，差异必须**登记**。
 *
 * 差异分两类，严重程度不同：
 *
 * - **多出**（NV8 有、Edge 没有）：宿主特征泄漏，比缺少 API 更容易被识别。
 *   目标是 0。
 * - **缺少**（Edge 有、NV8 没有）：功能缺口。目标脚本用到才会暴露，
 *   按需补齐。
 *
 * 采集：`npm run fingerprint:collect` 之外还需要全局列表，见
 * `scripts/collect-edge-globals.mjs`。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import process from 'node:process';

import { expectedMissingForNode } from '../src/infra/baseline/known-differences.js';
import { WINDOW_GLOBAL_ORDER } from '../src/surface/install/window-surface-order.js';
import { edge150Fingerprint } from '../src/infra/fingerprint/edge-150.js';

const REAL_GLOBALS_URL = new URL('../fixtures/fingerprint/edge-globals.json', import.meta.url);
const SURFACE_URL = new URL('../fixtures/baseline/full-surface.json', import.meta.url);

const hasRealGlobals = existsSync(REAL_GLOBALS_URL);
const realGlobals = hasRealGlobals
  ? new Set(JSON.parse(await readFile(REAL_GLOBALS_URL, 'utf8')).globals)
  : null;
const surface = JSON.parse(await readFile(SURFACE_URL, 'utf8'));

function surfaceTier() {
  const major = Number(/^(\d+)/.exec(process.versions.node)[1]);
  return `node${major}`;
}

/**
 * 已登记的缺失全局。
 *
 * **不在这份文件里维护**：名单住在 `src/install/window-surface-order.js`，
 * 因为那张表同时拿着**位置**信息——实现好了只需删掉 `pending` 字段，
 * 全局就自动落在正确的枚举索引上。在这里再挂一份名单必然漂移。
 *
 * @type {Map<string, string>} 全局名 → 为什么还没补
 */
const PENDING_GLOBALS = new Map(
  WINDOW_GLOBAL_ORDER
    .filter((entry) => entry[2]?.pending !== undefined)
    .map((entry) => [entry[0], entry[2].pending])
);

/**
 * baseline 用默认 150 profile 采，而 fixture 采自当前真实 Edge 152。
 *
 * 差一个 major 就会把版本门控的全局误报成缺失——这个坑踩过两次，
 * `FontFaceSet` 就是这么进登记表的。门控进了数据表后这类差异能自动解释，
 * 不需要人工登记。
 */
const BASELINE_MAJOR = edge150Fingerprint.browserMajorVersion;

/** 表里因版本门控而在 baseline profile 下不存在的全局。 */
const VERSION_GATED_GLOBALS = new Set(
  WINDOW_GLOBAL_ORDER
    .filter((entry) => {
      const gate = entry[2];
      if (gate === undefined || gate.pending !== undefined) return false;
      if (gate.since !== undefined && BASELINE_MAJOR < gate.since) return true;
      return gate.before !== undefined && BASELINE_MAJOR >= gate.before;
    })
    .map((entry) => entry[0])
);

/**
 * 已登记的多余全局。
 *
 * 目标是保持为空——多出一个真实浏览器没有的全局就是可识别特征。
 */
const KNOWN_EXTRA = Object.freeze({});

// -------------------------------------------------------------- 前提

test('the real-Edge global list fixture is present', () => {
  assert.ok(
    hasRealGlobals,
    'run: node scripts/collect-edge-globals.mjs --out fixtures/fingerprint/edge-globals.json'
  );
  assert.ok(realGlobals.size > 1000, `expected a full browser surface, got ${realGlobals.size}`);
  // 抽查几个必然存在的全局，确认采集没被截断
  for (const name of ['window', 'document', 'fetch', 'Element', 'Promise']) {
    assert.ok(realGlobals.has(name), `collected list is missing ${name}`);
  }
});

// ------------------------------------------------ NV8 不应多出全局

test('NV8 exposes no global that real Edge lacks', () => {
  const tier = surface.tiers[surfaceTier()];
  assert.ok(tier, `surface fixture is missing tier ${surfaceTier()}`);

  const nv8Globals = Object.keys(tier.legacy.groups);
  const extra = nv8Globals
    .filter((name) => !realGlobals.has(name))
    .filter((name) => KNOWN_EXTRA[name] === undefined)
    .sort();

  // 多出的全局是宿主特征泄漏。此前有两个：
  //   AsyncIterator      — Node 24 的 V8 特性，Edge 152 没有
  //   webkitAudioContext — Edge 152 已移除的旧别名
  assert.deepEqual(
    extra,
    [],
    'these globals leak host characteristics; remove them or register them in KNOWN_EXTRA'
  );
});

test('AsyncIterator is not leaked into the sandbox', () => {
  const tier = surface.tiers[surfaceTier()];
  assert.equal(
    tier.legacy.groups.AsyncIterator,
    undefined,
    'AsyncIterator is a Node 24 V8 feature that real Edge 152 does not have'
  );
  assert.equal(realGlobals.has('AsyncIterator'), false, 'precondition: Edge lacks it');
});

test('webkitAudioContext is not exposed', () => {
  const tier = surface.tiers[surfaceTier()];
  assert.equal(
    tier.legacy.groups.webkitAudioContext,
    undefined,
    'Edge 152 removed this legacy alias'
  );
});

// ------------------------------------------------ 缺失全局必须登记

test('every missing global is registered with a reason', () => {
  const tier = surface.tiers[surfaceTier()];
  const nv8Globals = new Set(Object.keys(tier.legacy.groups));

  const missing = [...realGlobals]
    .filter((name) => !nv8Globals.has(name))
    .sort();

  const unregistered = missing
    // 宿主 Node 版本造成的缺失（如 `Iterator` 需要 Node 22+）另有登记表，
    // 与 baseline 共用同一份。不剔除的话 Node 18/20 上会永久红一项——
    // 而永久红的断言和没有断言等价。
    .filter((name) => expectedMissingForNode(name) === null)
    .filter((name) => !PENDING_GLOBALS.has(name))
    .filter((name) => !VERSION_GATED_GLOBALS.has(name));

  assert.deepEqual(
    unregistered,
    [],
    '把这些实现掉，或者在 src/install/window-surface-order.js 里给它们加 pending 理由：'
    + unregistered.join(', ')
  );
});

test('registered reasons are substantive', () => {
  for (const [name, reason] of PENDING_GLOBALS) {
    assert.ok(
      reason.length > 10,
      `${name} needs a real explanation, not a placeholder`
    );
  }
});

test('registered gaps name globals that real Edge actually has', () => {
  // 登记一个真实 Edge 都没有的名字意味着登记过时或拼错，而它看上去就像
  // 「已知缺口」，会一直赖在账上。
  for (const name of [...PENDING_GLOBALS.keys(), ...VERSION_GATED_GLOBALS]) {
    assert.ok(realGlobals.has(name), `${name} 不在采集结果里，这条登记已过时`);
  }
});

test('the missing list stays small enough to be meaningful', () => {
  const count = PENDING_GLOBALS.size;
  // 上限只允许下调。它不是"当前很完美"的证明，而是防止差异悄悄扩大。
  //
  // 历史：旧名单 4 项。其中 `FontFaceSet` 其实只是版本差异被误计为缺口（现在
  // 由数据表的门控自动解释），`InteractionContentfulPaint` /
  // `PerformanceSoftNavigation` 已实现。只剩 `HTMLUserMediaElement`。
  assert.ok(
    count <= 1,
    `missing globals grew to ${count}; implement some before registering more`
  );
});

// ------------------------------------------------ 覆盖率报告（信息性）

test('legacy surface covers the vast majority of the real browser', () => {
  const tier = surface.tiers[surfaceTier()];
  const nv8Globals = new Set(Object.keys(tier.legacy.groups));
  const covered = [...realGlobals].filter((name) => nv8Globals.has(name)).length;
  const ratio = covered / realGlobals.size;

  assert.ok(
    ratio > 0.99,
    `legacy covers ${(ratio * 100).toFixed(2)}% of real Edge globals; expected >99%`
  );
});
