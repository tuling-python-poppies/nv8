/**
 * Protocol / Evidence 修复回归
 * （Gitee: IKFDA1 canonicalJson 稀疏数组 + maxBodyBytes；IKFDA2 签名密钥迭代器
 *  与 evidence.useNetworkReplay 透传）
 */

import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { generateKeyPairSync } from 'node:crypto';

import {
  ArtifactKind,
  BodyEncoding,
  canonicalDigest,
  canonicalJson,
  createRequestPlan,
  createRuntimeArtifact,
  deserializeArtifact,
  serializeArtifactToJson,
} from '../src/collection/request-protocol/index.js';
import {
  signEvidenceManifest,
  verifyEvidenceManifest,
} from '../src/collection/evidence/index.js';
import { createNv8, domPreset } from '../src/index.js';
import { streamsPlugin } from '../src/plugins/streams/index.js';
import { fetchPlugin } from '../src/plugins/fetch/index.js';

// ------------------------------------------------------------ IKFDA1 JSON

test('canonicalJson renders sparse-array holes as null like JSON.stringify', () => {
  // eslint-disable-next-line no-sparse-arrays
  const sparse = [1, , 3];
  assert.equal(canonicalJson(sparse), '[1,null,3]');
  assert.equal(canonicalJson(JSON.parse(canonicalJson(sparse))), '[1,null,3]');
  assert.equal(
    canonicalDigest(sparse),
    canonicalDigest([1, null, 3]),
    'holes and explicit null must share a digest',
  );
});

test('sparse-array artifacts survive a serialization round-trip', () => {
  // eslint-disable-next-line no-sparse-arrays
  const artifact = createRuntimeArtifact({
    id: 'sparse',
    kind: ArtifactKind.BODY,
    // eslint-disable-next-line no-sparse-arrays
    value: [1, , 3],
    createdAt: 1000,
  });
  const restored = deserializeArtifact(serializeArtifactToJson(artifact));
  assert.deepEqual(restored.value, [1, null, 3]);
});

test('maxBodyBytes applies to the serialized json body', () => {
  assert.throws(
    () => createRequestPlan({
      method: 'POST',
      url: 'https://target.test/',
      body: { encoding: BodyEncoding.JSON, value: { pad: 'x'.repeat(64) } },
      limits: { maxBodyBytes: 16 },
    }),
    /exceeds maxBodyBytes/,
  );

  const ok = createRequestPlan({
    method: 'POST',
    url: 'https://target.test/',
    body: { encoding: BodyEncoding.JSON, value: { a: 1 } },
    limits: { maxBodyBytes: 16 },
  });
  assert.equal(ok.body.encoding, BodyEncoding.JSON);
});

test('maxBodyBytes applies to the serialized form body', () => {
  assert.throws(
    () => createRequestPlan({
      method: 'POST',
      url: 'https://target.test/',
      body: { encoding: BodyEncoding.FORM, value: [['pad', 'x'.repeat(64)]] },
      limits: { maxBodyBytes: 16 },
    }),
    /exceeds maxBodyBytes/,
  );

  const ok = createRequestPlan({
    method: 'POST',
    url: 'https://target.test/',
    body: { encoding: BodyEncoding.FORM, value: [['a', '1']] },
    limits: { maxBodyBytes: 16 },
  });
  assert.equal(ok.body.encoding, BodyEncoding.FORM);
});

// -------------------------------------------------------- IKFDA2 签名

function signedFixture() {
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  const signed = signEvidenceManifest({
    schemaVersion: '1.0',
    bundleId: 'iterable-keys',
    files: [],
    entrypoints: [],
  }, privateKey, { keyId: 'release-1' });
  return { signed, publicKey };
}

test('trustedKeys accepts an iterable of [keyId, key] pairs', () => {
  const { signed, publicKey } = signedFixture();
  assert.deepEqual(verifyEvidenceManifest(signed, [['release-1', publicKey]]), {
    valid: true,
    algorithm: 'ed25519',
    keyId: 'release-1',
  });
  assert.deepEqual(verifyEvidenceManifest(signed, new Set([['release-1', publicKey]])), {
    valid: true,
    algorithm: 'ed25519',
    keyId: 'release-1',
  });
  assert.deepEqual(verifyEvidenceManifest(signed, new Map([['release-1', publicKey]])), {
    valid: true,
    algorithm: 'ed25519',
    keyId: 'release-1',
  });
});

test('iterable trustedKeys still rejects an unknown keyId', () => {
  const { signed, publicKey } = signedFixture();
  assert.equal(verifyEvidenceManifest(signed, [['other', publicKey]]).valid, false);
  assert.equal(verifyEvidenceManifest(signed, []).valid, false);
});

// ------------------------------------ IKFDA2 evidence.useNetworkReplay

async function writeEvidenceBundle(root) {
  const replay = JSON.stringify({
    requests: [{
      id: 'get-data',
      request: { method: 'GET', url: 'https://api.example.test/data' },
      response: {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'text/plain' },
        body: 'replayed-response',
      },
    }],
  });
  const files = {
    'pages/index.html': '<!doctype html><html><body><main id="app">bundle</main></body></html>',
    'network/replay.json': replay,
  };
  const manifest = {
    schemaVersion: '1.0',
    bundleId: 'use-network-replay',
    target: {
      url: 'https://example.test/',
      origin: 'https://example.test',
      capturedAt: '2026-01-01T00:00:00.000Z',
    },
    files: [],
    entrypoints: [],
    replay: { fixture: 'network/replay.json', matching: 'method-url' },
  };
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(root, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, 'utf8');
    manifest.files.push({
      path: filePath,
      role: filePath.endsWith('.html') ? 'page' : 'network-replay',
      mediaType: filePath.endsWith('.html') ? 'text/html' : 'application/json',
      bytes: Buffer.byteLength(content, 'utf8'),
      sha256: crypto.createHash('sha256').update(content).digest('hex'),
    });
  }
  await fs.writeFile(
    path.join(root, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8',
  );
}

const silentLogger = { info() {}, warn() {}, error() {}, trace() {} };

async function withNv8(options, body) {
  const bundlePath = await fs.mkdtemp(path.join(os.tmpdir(), 'nv8-use-network-replay-'));
  let nv8;
  try {
    await writeEvidenceBundle(bundlePath);
    nv8 = await createNv8({
      plugins: [...domPreset, streamsPlugin, fetchPlugin],
      profile: {
        id: 'use-network-replay',
        version: '1.0.0',
        name: 'Use Network Replay',
        url: 'https://example.test/',
      },
      evidence: { bundlePath, ...(options.evidence ?? {}) },
      replay: options.replay,
      logger: silentLogger,
    });
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    await body(realm);
    await nv8.destroy();
    nv8 = null;
  } finally {
    await nv8?.destroy();
    await fs.rm(bundlePath, { recursive: true, force: true });
  }
}

const FETCH_SETTLE = 'fetch("https://api.example.test/data")'
  + '.then(response => response.text())'
  + '.then(text => ({ ok: true, text }), error => ({ ok: false, message: String(error?.message ?? error) }))';

if (typeof vm.SourceTextModule !== 'function') {
  test('evidence.useNetworkReplay integration', {
    skip: 'Node must enable vm.SourceTextModule for the legacy runtime',
  }, () => {});
} else {
  test('evidence.useNetworkReplay:false disables the bundle replay', async () => {
    await withNv8({ evidence: { useNetworkReplay: false } }, async (realm) => {
      const outcome = await realm.evaluate(FETCH_SETTLE);
      assert.equal(outcome.ok, false, 'fetch must not replay when evidence replay is disabled');
      assert.match(outcome.message, /replay/i);
    });
  });

  test('an explicit options.replay still wins when useNetworkReplay is false', async () => {
    await withNv8({
      evidence: { useNetworkReplay: false },
      replay: [{
        url: 'https://api.example.test/data',
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'text/plain' },
        body: 'explicit-replay',
      }],
    }, async (realm) => {
      const outcome = await realm.evaluate(FETCH_SETTLE);
      assert.equal(outcome.ok, true);
      assert.equal(outcome.text, 'explicit-replay');
    });
  });

  test('evidence replay is loaded by default', async () => {
    await withNv8({}, async (realm) => {
      const outcome = await realm.evaluate(FETCH_SETTLE);
      assert.equal(outcome.ok, true);
      assert.equal(outcome.text, 'replayed-response');
    });
  });

  test('useNetworkReplay must be a boolean', async () => {
    await assert.rejects(
      () => createNv8({
        plugins: [...domPreset],
        evidence: { bundlePath: 'irrelevant', useNetworkReplay: 'yes' },
        logger: silentLogger,
      }),
      /useNetworkReplay must be a boolean/,
    );
  });
}
