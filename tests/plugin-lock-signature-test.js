import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { minimalPreset } from '../src/index.js';
import { createPluginLockPlan } from '../src/engine/core/plugin-lock-plan.js';
import {
  assertPluginLockSignature,
  signPluginLockPlan,
  verifyPluginLockPlan,
} from '../src/engine/core/plugin-lock-signature.js';

const { privateKey, publicKey } = generateKeyPairSync('ed25519');
const plan = createPluginLockPlan({ plugins: minimalPreset, profile: { id: 'signed-lock' } });

test('Plugin Lock signature is optional and excludes the signature field itself', () => {
  assert.equal(verifyPluginLockPlan(plan, { keyId: 'release-2026', publicKey }), false);
  const signed = signPluginLockPlan(plan, { keyId: 'release-2026', privateKey });
  assert.equal(signed.signature.algorithm, 'ed25519');
  assert.equal(signed.signature.keyId, 'release-2026');
  assert.match(signed.signature.value, /^[A-Za-z0-9+/]+=*$/);
  assert.equal(verifyPluginLockPlan(signed, { keyId: 'release-2026', publicKey }), true);
  assertPluginLockSignature(signed, { keyId: 'release-2026', publicKey });
});

test('changing any unsigned Lock Plan field invalidates its signature', () => {
  const signed = signPluginLockPlan(plan, { keyId: 'release-2026', privateKey });
  const changed = { ...signed, runtimeMode: 'plugin' };
  assert.equal(verifyPluginLockPlan(changed, { keyId: 'release-2026', publicKey }), false);
  assert.throws(
    () => assertPluginLockSignature(changed, { keyId: 'release-2026', publicKey }),
    error => error.code === 'PLUGIN_LOCK_SIGNATURE_INVALID',
  );
});

test('verification requires the caller-selected keyId and public key', () => {
  const signed = signPluginLockPlan(plan, { keyId: 'release-2026', privateKey });
  assert.equal(verifyPluginLockPlan(signed, { keyId: 'other-key', publicKey }), false);
  assert.equal(verifyPluginLockPlan(signed, { keyId: 'release-2026' }), false);
  assert.equal(verifyPluginLockPlan(signed, { keyId: 'release-2026', publicKey: privateKey }), false);
});

test('signing requires a bounded keyId and private key', () => {
  assert.throws(() => signPluginLockPlan(plan, { keyId: '', privateKey }), /keyId/);
  assert.throws(() => signPluginLockPlan(plan, { keyId: 'x'.repeat(129), privateKey }), /keyId/);
  assert.throws(() => signPluginLockPlan(plan, { keyId: 'release-2026' }), /privateKey/);
});

test('malformed or unsupported signatures fail closed', () => {
  const signed = signPluginLockPlan(plan, { keyId: 'release-2026', privateKey });
  assert.equal(verifyPluginLockPlan({ ...signed, signature: { ...signed.signature, algorithm: 'rsa' } }, {
    keyId: 'release-2026', publicKey,
  }), false);
  assert.equal(verifyPluginLockPlan({ ...signed, signature: { ...signed.signature, value: 'not-base64!' } }, {
    keyId: 'release-2026', publicKey,
  }), false);
});
