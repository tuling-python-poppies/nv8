import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash, generateKeyPairSync } from 'node:crypto';

import {
  EvidenceSignatureInvalidError,
  EvidenceSignatureRequiredError,
  loadEvidenceBundle,
  manifestSigningBytes,
  signEvidenceManifest,
  verifyEvidenceManifest,
} from '../src/collection/evidence/index.js';

function keys() {
  return generateKeyPairSync('ed25519');
}

function manifest(content = 'export default 1;') {
  const bytes = Buffer.from(content);
  return {
    schemaVersion: '1.0',
    bundleId: 'signed-test',
    target: {
      url: 'https://target.test/page',
      origin: 'https://target.test',
      capturedAt: '2025-01-01T00:00:00.000Z',
    },
    files: [{
      path: 'entry.js',
      role: 'script',
      mediaType: 'text/javascript',
      bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    }],
    entrypoints: ['entry.js'],
  };
}

async function writeBundle(signedManifest, content = 'export default 1;') {
  const directory = await mkdtemp(join(tmpdir(), 'nv8-evidence-signature-'));
  await writeFile(join(directory, 'manifest.json'), JSON.stringify(signedManifest));
  await writeFile(join(directory, 'entry.js'), content);
  return directory;
}

async function withBundle(signedManifest, callback) {
  const directory = await writeBundle(signedManifest);
  try {
    return await callback(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test('signEvidenceManifest signs canonical manifest bytes with Ed25519', () => {
  const { privateKey, publicKey } = keys();
  const signed = signEvidenceManifest(manifest(), privateKey, { keyId: 'release-1' });
  assert.deepEqual(verifyEvidenceManifest(signed, { 'release-1': publicKey }), {
    valid: true,
    algorithm: 'ed25519',
    keyId: 'release-1',
  });
  assert.equal(typeof signed.signature.value, 'string');
  assert.equal('publicKey' in signed.signature, false);
});

test('canonical signing bytes ignore only the signature field', () => {
  const original = manifest();
  const signed = { ...original, signature: { value: 'ignored' } };
  assert.equal(manifestSigningBytes(original).toString(), manifestSigningBytes(signed).toString());
});

test('verification rejects a changed manifest', () => {
  const { privateKey, publicKey } = keys();
  const signed = signEvidenceManifest(manifest(), privateKey, { keyId: 'release-1' });
  const changed = { ...signed, files: [{ ...signed.files[0], bytes: 99 }] };
  assert.deepEqual(verifyEvidenceManifest(changed, { 'release-1': publicKey }), {
    valid: false,
    reason: 'signature-mismatch',
  });
});

test('verification requires a caller-trusted key', () => {
  const { privateKey } = keys();
  const signed = signEvidenceManifest(manifest(), privateKey, { keyId: 'release-1' });
  assert.deepEqual(verifyEvidenceManifest(signed, {}), {
    valid: false,
    reason: 'untrusted-key',
  });
});

test('verification rejects unsupported algorithms and malformed signatures', () => {
  const base = { ...manifest(), signature: {
    version: 1,
    algorithm: 'rsa-sha256',
    keyId: 'release-1',
    value: 'bad',
  } };
  assert.deepEqual(verifyEvidenceManifest(base, {}), {
    valid: false,
    reason: 'unsupported-algorithm',
  });
  assert.deepEqual(verifyEvidenceManifest({ ...manifest(), signature: null }, {}), {
    valid: false,
    reason: 'missing-signature',
  });
});

test('loader accepts unsigned legacy bundles by default', async () => {
  await withBundle(manifest(), async directory => {
    const bundle = await loadEvidenceBundle(directory);
    assert.equal(bundle.getVerification().bundleId, 'signed-test');
  });
});

test('loader verifies signed bundles with an explicit trusted key', async () => {
  const { privateKey, publicKey } = keys();
  const signed = signEvidenceManifest(manifest(), privateKey, { keyId: 'release-1' });
  await withBundle(signed, async directory => {
    const bundle = await loadEvidenceBundle(directory, {
      signaturePolicy: 'required',
      trustedKeys: { 'release-1': publicKey },
    });
    assert.equal(bundle.manifest.signature.keyId, 'release-1');
  });
});

test('loader rejects signed bundles with an unknown key', async () => {
  const { privateKey } = keys();
  const signed = signEvidenceManifest(manifest(), privateKey, { keyId: 'release-1' });
  await withBundle(signed, async directory => {
    await assert.rejects(
      loadEvidenceBundle(directory, { trustedKeys: {} }),
      error => error instanceof EvidenceSignatureInvalidError
        && error.context.reason === 'untrusted-key',
    );
  });
});

test('required signature policy rejects unsigned bundles', async () => {
  await withBundle(manifest(), async directory => {
    await assert.rejects(
      loadEvidenceBundle(directory, { signaturePolicy: 'required' }),
      error => error instanceof EvidenceSignatureRequiredError,
    );
  });
});

test('disabled signature policy preserves explicitly disabled verification', async () => {
  await withBundle({ ...manifest(), signature: { algorithm: 'invalid' } }, async directory => {
    const bundle = await loadEvidenceBundle(directory, { signaturePolicy: 'disabled' });
    assert.equal(bundle.getVerification().fileCount, 1);
  });
});
