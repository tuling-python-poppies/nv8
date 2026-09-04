/**
 * 指纹自洽性与真实 Edge 校准测试
 *
 * 分两层：
 *
 * 1. **自洽性**——不需要真实浏览器，纯逻辑一致性。UA 与
 *    `userAgentData.brands` 必须指向同一个浏览器和版本，自相矛盾的组合
 *    是最容易被检测的破绽。
 * 2. **校准**——与 `fixtures/fingerprint/edge-real.json` 对比。该文件由
 *    `scripts/collect-edge-fingerprint.mjs` 从真实 Edge 采集。
 *
 * 校准只比对**浏览器身份**字段。`hardwareConcurrency`、`deviceMemory`、
 * `languages`、屏幕尺寸属于采集机器特有，照抄会把指纹绑定到某台具体机器，
 * 反而更可疑。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import { edge150Fingerprint } from '../src/infra/fingerprint/edge-150.js';

const REAL_FIXTURE_URL = new URL('../fixtures/fingerprint/edge-real.json', import.meta.url);
const hasRealFixture = existsSync(REAL_FIXTURE_URL);
const realFingerprint = hasRealFixture
  ? JSON.parse(await readFile(REAL_FIXTURE_URL, 'utf8'))
  : null;

/** 从 UA 提取 Chrome 主版本 */
function chromeMajor(userAgent) {
  return Number(/Chrome\/(\d+)/.exec(userAgent)?.[1] ?? 0);
}

/** 从 UA 提取 Edg 主版本 */
function edgeMajor(userAgent) {
  return Number(/Edg\/(\d+)/.exec(userAgent)?.[1] ?? 0);
}

const PROFILES = [
  ['edge-150', edge150Fingerprint],
];

// ------------------------------------------------------------- 自洽性

test('every profile declares the Edg/ token', async () => {
  const { edge151Fingerprint } = await import('../src/infra/fingerprint/edge-151.js');
  const profiles = [...PROFILES, ['edge-151', edge151Fingerprint]];

  for (const [name, fingerprint] of profiles) {
    const userAgent = fingerprint.navigator.userAgent;
    // 缺 Edg/ 时 UA 说的是 Chrome，而 brands 声明 Microsoft Edge——
    // 这两者自相矛盾，是很容易被识别的组合。
    assert.match(
      userAgent,
      /\bEdg\/\d+/,
      `${name}: an Edge profile must carry the Edg/ token`
    );
  }
});

test('Chrome and Edg major versions agree within a profile', async () => {
  const { edge151Fingerprint } = await import('../src/infra/fingerprint/edge-151.js');
  for (const [name, fingerprint] of [...PROFILES, ['edge-151', edge151Fingerprint]]) {
    const userAgent = fingerprint.navigator.userAgent;
    assert.equal(
      edgeMajor(userAgent),
      chromeMajor(userAgent),
      `${name}: Chrome and Edg majors must match`
    );
  }
});

test('appVersion is the userAgent without the Mozilla/ prefix', async () => {
  const { edge151Fingerprint } = await import('../src/infra/fingerprint/edge-151.js');
  for (const [name, fingerprint] of [...PROFILES, ['edge-151', edge151Fingerprint]]) {
    const { userAgent, appVersion } = fingerprint.navigator;
    if (appVersion === undefined) continue;
    assert.equal(
      appVersion,
      userAgent.replace(/^Mozilla\//, ''),
      `${name}: appVersion must mirror userAgent`
    );
  }
});

// --------------------------------------------------- brands 结构一致性

test('brand list order matches real Edge', async () => {
  const { lowEntropyUaData } = await import('../src/surface/api/navigator/navigator-ua-data-state.js');
  const { configureNavigatorProfile } = await import('../src/surface/api/navigator/navigator-state.js');

  configureNavigatorProfile(
    edge150Fingerprint.navigator.userAgent,
    'Win32',
    '5:zh-CN2:zh',
    'zh-CN',
    8,
    8,
    null,
    edge150Fingerprint.navigator,
  );

  const brands = lowEntropyUaData().brands.map((entry) => entry.brand);
  // 真实顺序是 GREASE → Microsoft Edge → Chromium。
  // 此前是 GREASE → Chromium → Microsoft Edge。
  assert.deepEqual(brands, ['Not=A?Brand', 'Microsoft Edge', 'Chromium']);
});

test('the GREASE brand matches the current Chromium form', async () => {
  const { lowEntropyUaData } = await import('../src/surface/api/navigator/navigator-ua-data-state.js');
  const brands = lowEntropyUaData().brands;
  // 真实是 `Not=A?Brand` / `99`；`Not A;Brand` / `8` 是更早 Chromium 的形态
  assert.equal(brands[0].brand, 'Not=A?Brand');
  assert.equal(brands[0].version, '99');
});

test('brand versions agree with the userAgent major', async () => {
  const { lowEntropyUaData } = await import('../src/surface/api/navigator/navigator-ua-data-state.js');
  const brands = lowEntropyUaData().brands;
  const major = chromeMajor(edge150Fingerprint.navigator.userAgent);
  for (const entry of brands) {
    if (entry.brand === 'Not=A?Brand') continue;
    assert.equal(
      Number(entry.version),
      major,
      `${entry.brand} version must match the userAgent major`
    );
  }
});

test('fullVersionList gives Edge and Chromium distinct builds', async () => {
  const { highEntropyUaData } = await import('../src/surface/api/navigator/navigator-ua-data-state.js');
  const { configureNavigatorProfile } = await import('../src/surface/api/navigator/navigator-state.js');
  const { edge151Fingerprint } = await import('../src/infra/fingerprint/edge-151.js');

  configureNavigatorProfile(
    edge151Fingerprint.navigator.userAgent,
    'Win32',
    '5:zh-CN2:zh',
    'zh-CN',
    8,
    8,
    null,
    edge151Fingerprint.navigator,
  );

  const list = highEntropyUaData(['fullVersionList']).fullVersionList;
  const edge = list.find((entry) => entry.brand === 'Microsoft Edge');
  const chromium = list.find((entry) => entry.brand === 'Chromium');

  // Edge 有独立发布线，build 号与 Chromium 不同步。
  // 此前两者相同，是很容易被识别的破绽。
  assert.notEqual(
    edge.version,
    chromium.version,
    'Edge and Chromium builds must differ, as they do in the real browser'
  );
  assert.match(edge.version, /^\d+\.\d+\.\d+\.\d+$/);
  assert.match(chromium.version, /^\d+\.\d+\.\d+\.\d+$/);
});

// -------------------------------------------- 与真实 Edge 采集结果校准

test('the real-Edge fixture is present and well formed', () => {
  assert.ok(
    hasRealFixture,
    'run scripts/collect-edge-fingerprint.mjs --out fixtures/fingerprint/edge-real.json'
  );
  assert.match(realFingerprint.navigator.userAgent, /\bEdg\/\d+/);
  assert.ok(Array.isArray(realFingerprint.userAgentData.brands));
  assert.equal(realFingerprint.userAgentData.platform, 'Windows');
});

test('the collector normalizes the headless userAgent', () => {
  // headless Edge 报 `HeadlessChrome/`，profile 必须写有头形态，
  // 否则目标站点一眼看出是无头浏览器。
  assert.doesNotMatch(realFingerprint.navigator.userAgent, /HeadlessChrome/);
  assert.match(realFingerprint.navigator.userAgentHeadless, /HeadlessChrome/);
});

test('profile brand order and names match the real browser', () => {
  const realBrands = realFingerprint.userAgentData.brands.map((entry) => entry.brand);
  assert.deepEqual(
    realBrands,
    ['Not=A?Brand', 'Microsoft Edge', 'Chromium'],
    'this is the order the profile is calibrated against'
  );
});

test('the registered build number matches the real browser', async () => {
  const { highEntropyUaData } = await import('../src/surface/api/navigator/navigator-ua-data-state.js');
  const realMajor = String(chromeMajor(realFingerprint.navigator.userAgent));
  const realFull = realFingerprint.userAgentData.highEntropy.uaFullVersion;

  const { configureNavigatorProfile } = await import('../src/surface/api/navigator/navigator-state.js');
  configureNavigatorProfile(
    realFingerprint.navigator.userAgent,
    'Win32',
    '5:zh-CN2:zh',
    'zh-CN',
    8,
    8,
    null,
    { userAgentData: {} },
  );

  const reported = highEntropyUaData(['uaFullVersion']).uaFullVersion;
  assert.equal(
    reported,
    realFull,
    `build number for Edge ${realMajor} must come from the collected fixture, not a guess`
  );
});

test('machine-specific values are deliberately not copied from the fixture', () => {
  // 采集机器是 28 核 / 16GB。照抄会把指纹绑定到那台机器。
  const profile = edge150Fingerprint.navigator;
  assert.notEqual(
    profile.hardwareConcurrency,
    realFingerprint.navigator.hardwareConcurrency,
    'hardwareConcurrency must stay a neutral default, not the collector machine value'
  );
  assert.deepEqual(
    profile.languages,
    ['zh-CN', 'zh'],
    'languages stay a neutral default rather than the collector locale list'
  );
});
