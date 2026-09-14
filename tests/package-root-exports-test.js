/**
 * 包根导出契约（消费方导入形状）。
 *
 * 消费方（skill Provider / 采集工程）按文档写的是
 * `import { EdgeSandbox, createSandbox, edge152Fingerprint } from 'nv8'`。
 * 这个测试用**包名自引用**（Node 的 self-reference，走 package.json exports）
 * 锁定该形状：任何 root 导出被移除或改名，这里先失败。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  EdgeSandbox,
  createSandbox,
  edge150Fingerprint,
  edge151Fingerprint,
  edge152Fingerprint,
} from 'nv8';
import { EdgeSandbox as DirectEdgeSandbox } from '../src/public/edge-sandbox.js';
import { createSandbox as directCreateSandbox } from '../src/public/create-sandbox.js';

test('package root re-exports the public sandbox entries', () => {
  assert.equal(typeof EdgeSandbox, 'function');
  assert.equal(typeof createSandbox, 'function');
  assert.equal(EdgeSandbox, DirectEdgeSandbox, 'root re-export must be the same class');
  assert.equal(createSandbox, directCreateSandbox, 'root re-export must be the same function');
});

test('package root re-exports the frozen Edge fingerprints', () => {
  for (const [name, fingerprint] of [
    ['edge150Fingerprint', edge150Fingerprint],
    ['edge151Fingerprint', edge151Fingerprint],
    ['edge152Fingerprint', edge152Fingerprint],
  ]) {
    assert.equal(typeof fingerprint, 'object', `${name} must be exported`);
    assert.match(fingerprint.navigator.userAgent, /Edg\//u, `${name} must be an Edge profile`);
    assert.ok(Object.isFrozen(fingerprint), `${name} must stay frozen`);
  }
});

test('the fingerprint subpath stays aligned with the root export', async () => {
  const subpath = await import('nv8/fingerprint/edge-152');
  assert.equal(subpath.edge152Fingerprint, edge152Fingerprint);
});
