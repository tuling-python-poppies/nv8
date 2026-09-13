/**
 * uaFullVersion 单一事实源（IKFDAA）。
 *
 * 运行时的 `getHighEntropyValues(['uaFullVersion'])` 走
 * `navigator-ua-data-state.js` 的 build 版本表；profile 导出走
 * `edge-151.js` / `edge-152.js` 的 `userAgentData.uaFullVersion`。
 * 两处曾经矛盾：edge-151 声明 151.0.7849.46，运行时给 151.0.4129.101。
 *
 * 这里用**真实沙箱**跑 `getHighEntropyValues`，要求 151 / 152 两个 profile
 * 与运行时输出逐字一致。Edge 150 在仓库内没有真实 build 号证据，保持
 * `${major}.0.0.0` 占位，并由返回 undefined 的 profile 显式记录待采集。
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

test('edge-150 has no collected build and keeps the documented placeholder', async () => {
  // 仓库内（fixtures / docs / 采集脚本产物）没有 Edge 150 的真实 build 号，
  // 因此 profile 不登记 uaFullVersion，运行时回退到占位值，待采集后统一。
  assert.equal(
    edge150Fingerprint.navigator.userAgentData.uaFullVersion,
    undefined,
    'do not invent an Edge 150 build number',
  );
  const reported = await readUaFullVersion(edge150Fingerprint);
  assert.equal(reported, '150.0.0.0');
});
