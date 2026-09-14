/**
 * uaFullVersion 单一事实源（IKFDAA）。
 *
 * 运行时的 `getHighEntropyValues(['uaFullVersion'])` 走
 * `navigator-ua-data-state.js` 的 build 版本表；profile 导出走
 * `edge-150.js` / `edge-151.js` / `edge-152.js` 的
 * `userAgentData.uaFullVersion`。两处曾经矛盾：edge-151 声明
 * 151.0.7849.46，运行时给 151.0.4129.101。
 *
 * 这里用**真实沙箱**跑 `getHighEntropyValues`，要求三个 profile 与运行时
 * 输出逐字一致。Edge 150 的 build 由本机 EdgeUpdate 日志补齐；Chromium 150
 * 的 build 号本机没有证据，运行时表显式登记为 null 并回退占位值。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { edge150Fingerprint } from '../src/infra/fingerprint/edge-150.js';
import { edge151Fingerprint } from '../src/infra/fingerprint/edge-151.js';
import { edge152Fingerprint } from '../src/infra/fingerprint/edge-152.js';

const PAGE_HTML = '<!doctype html><html><head></head><body></body></html>';

async function readUaFullVersion(fingerprint) {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://ua.test/page', {
    page: { html: PAGE_HTML },
    fingerprint,
    limits: { timeoutMs: 30_000 },
  });
  try {
    return await sandbox.run(
      "navigator.userAgentData"
      + ".getHighEntropyValues(['uaFullVersion'])"
      + ".then((values) => values.uaFullVersion)",
    );
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

for (const [name, fingerprint] of [
  ['edge-150', edge150Fingerprint],
  ['edge-151', edge151Fingerprint],
  ['edge-152', edge152Fingerprint],
]) {
  test(`${name} profile uaFullVersion matches the sandbox output`, async () => {
    const declared = fingerprint.navigator.userAgentData.uaFullVersion;
    assert.match(declared, /^\d+\.\d+\.\d+\.\d+$/, `${name} must declare a build`);
    const reported = await readUaFullVersion(fingerprint);
    assert.equal(
      reported,
      declared,
      `${name}: profile and runtime high-entropy output must come from one source`,
    );
  });
}

test('edge-150 registers the real Edge build but keeps Chromium pending', async () => {
  // Edge 150 的 build 来自本机 EdgeUpdate 日志；Chromium 150 的 build 不在
  // 任何本机证据里，运行时表登记 null，fullVersionList 里回退到占位值。
  // 这个断言把「缺口」显式记录在案：拿到真实 Chromium 150 build 后应更新。
  const { configureNavigatorProfile } = await import(
    '../src/surface/api/navigator/navigator-state.js'
  );
  const { highEntropyUaData } = await import(
    '../src/surface/api/navigator/navigator-ua-data-state.js'
  );
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
  const list = highEntropyUaData(['fullVersionList']).fullVersionList;
  const edge = list.find((entry) => entry.brand === 'Microsoft Edge');
  const chromium = list.find((entry) => entry.brand === 'Chromium');
  assert.equal(edge.version, '150.0.4078.105');
  assert.equal(
    chromium.version,
    '150.0.0.0',
    'Chromium 150 build is not collected; the placeholder must stay documented',
  );
});
