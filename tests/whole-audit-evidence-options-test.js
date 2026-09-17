/**
 * 全仓审计收尾回归（F-E1）：Evidence 签名选项贯通。
 *
 * 覆盖进程内 createNv8 与公共 EdgeSandbox（child-process / worker-thread）
 * 两条入口：signaturePolicy 与 trustedKeys 必须真正到达 loadEvidenceBundle。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash, generateKeyPairSync } from 'node:crypto';
import { createNv8, minimalPreset } from '../src/index.js';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';
import { signEvidenceManifest } from '../src/collection/evidence/index.js';
import { drainTasks } from './helpers/async-wait.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

const ENTRY_SOURCE = 'globalThis.__evidenceRan = true;';

function buildManifest(signed = null) {
  const bytes = Buffer.from(ENTRY_SOURCE);
  const manifest = {
    schemaVersion: '1.0',
    bundleId: 'closeout-evidence',
    target: {
      url: 'https://evidence.test/page',
      origin: 'https://evidence.test',
      capturedAt: '2026-01-01T00:00:00.000Z',
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
  return signed === null ? manifest : signed(manifest);
}

async function withBundle(manifest, callback) {
  const dir = await mkdtemp(join(tmpdir(), 'nv8-evidence-options-'));
  try {
    await writeFile(join(dir, 'manifest.json'), JSON.stringify(manifest));
    await writeFile(join(dir, 'entry.js'), ENTRY_SOURCE);
    return await callback(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test('F-E1 Core createNv8 enforces signaturePolicy and trustedKeys', async () => {
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  const publicPem = publicKey.export({ type: 'spki', format: 'pem' });
  const signed = buildManifest(m => signEvidenceManifest(m, privateKey, { keyId: 'release-1' }));

  // required + 无签名 bundle：必须在创建阶段被拒绝，而不是静默降级。
  await withBundle(buildManifest(), async bundlePath => {
    await assert.rejects(
      createNv8({
        plugins: minimalPreset,
        logger,
        evidence: { bundlePath, signaturePolicy: 'required' },
      }),
      error => /signature/i.test(`${error.message} ${error.code ?? ''}`),
    );
  });

  // required + 正确公钥（PEM 字符串）：加载成功且证据脚本真的执行。
  await withBundle(signed, async bundlePath => {
    const nv8 = await createNv8({
      plugins: minimalPreset,
      logger,
      evidence: {
        bundlePath,
        signaturePolicy: 'required',
        trustedKeys: { 'release-1': publicPem },
      },
    });
    try {
      const realm = await nv8.sandbox.createRealm();
      assert.equal(await realm.evaluate('globalThis.__evidenceRan === true'), true);
    } finally {
      await nv8.destroy();
    }
  });

  // required + 错误公钥：验证必须失败。
  const other = generateKeyPairSync('ed25519').publicKey.export({ type: 'spki', format: 'pem' });
  await withBundle(signed, async bundlePath => {
    await assert.rejects(
      createNv8({
        plugins: minimalPreset,
        logger,
        evidence: {
          bundlePath,
          signaturePolicy: 'required',
          trustedKeys: { 'release-1': other },
        },
      }),
      error => /signature/i.test(`${error.message} ${error.code ?? ''}`),
    );
  });

  // 非法枚举值必须报错而不是忽略。
  await withBundle(signed, async bundlePath => {
    await assert.rejects(
      createNv8({
        plugins: minimalPreset,
        logger,
        evidence: { bundlePath, signaturePolicy: 'strict' },
      }),
      /signaturePolicy/,
    );
  });
});

for (const backend of ['child-process', 'worker-thread']) {
  test(`F-E1 public EdgeSandbox carries signature options across ${backend}`, async () => {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519');
    const publicPem = publicKey.export({ type: 'spki', format: 'pem' });
    const signed = buildManifest(m => signEvidenceManifest(m, privateKey, { keyId: 'release-1' }));

    await withBundle(signed, async bundlePath => {
      const sandbox = await EdgeSandbox.create({
        execution: { backend },
        page: { url: 'https://evidence.test/page' },
        limits: { timeoutMs: 10_000 },
        evidence: {
          bundlePath,
          signaturePolicy: 'required',
          trustedKeys: { 'release-1': publicPem },
        },
      });
      try {
        assert.equal(
          (await sandbox.evaluate('globalThis.__evidenceRan === true')).value,
          true,
        );
      } finally {
        await sandbox.close();
      }
    });

    await withBundle(buildManifest(), async bundlePath => {
      await assert.rejects(
        EdgeSandbox.create({
          execution: { backend },
          page: { url: 'https://evidence.test/page' },
          limits: { timeoutMs: 10_000 },
          evidence: { bundlePath, signaturePolicy: 'required' },
        }),
        error => /signature/i.test(`${error.message} ${error.code ?? ''}`),
      );
      await drainTasks();
    });
  });
}
