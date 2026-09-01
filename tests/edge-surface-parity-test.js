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

import { expectedMissingForNode } from '../src/baseline/known-differences.js';

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
 * 每条都要说明为什么还没补——「没注意到」不是理由。
 */
const KNOWN_MISSING = Object.freeze({
  // 采集基准是真实 Edge 151，而 baseline 用的是默认 150 profile。
  // FontFaceSet 在 151 profile 下**是存在的**（`browserMajorVersion >= 151`
  // 才暴露），所以它属于版本差异而非缺口。
  FontFaceSet: '151 profile 下已暴露；150 profile 刻意不暴露（Edge 150 尚无此接口）',
  HTMLUserMediaElement: 'Edge 151 新增元素接口；暴露它需要 finalize 生成器'
    + '支持按 browserMajorVersion 门控',
  InteractionContentfulPaint: '构造函数已在 performance-longtail-runtime.js 就绪，'
    + '但暴露为全局需要 finalize 生成器支持版本门控',
  PerformanceSoftNavigation: '同上：构造函数已就绪，等生成器支持版本门控',
});

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
  //   AsyncIterator      — Node 24 的 V8 特性，Edge 151 没有
  //   webkitAudioContext — Edge 151 已移除的旧别名
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
    'AsyncIterator is a Node 24 V8 feature that real Edge 151 does not have'
  );
  assert.equal(realGlobals.has('AsyncIterator'), false, 'precondition: Edge lacks it');
});

test('webkitAudioContext is not exposed', () => {
  const tier = surface.tiers[surfaceTier()];
  assert.equal(
    tier.legacy.groups.webkitAudioContext,
    undefined,
    'Edge 151 removed this legacy alias'
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
    .filter((name) => KNOWN_MISSING[name] === undefined);

  assert.deepEqual(
    unregistered,
    [],
    'add these to KNOWN_MISSING with a reason, or implement them: '
    + unregistered.join(', ')
  );
});

test('registered reasons are substantive', () => {
  for (const [name, reason] of Object.entries(KNOWN_MISSING)) {
    assert.ok(
      reason.length > 10,
      `${name} needs a real explanation, not a placeholder`
    );
  }
});

test('the missing list stays small enough to be meaningful', () => {
  const count = Object.keys(KNOWN_MISSING).length;
  // 上限只允许下调。它不是"当前很完美"的证明，而是防止差异悄悄扩大。
  assert.ok(
    count <= 4,
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
