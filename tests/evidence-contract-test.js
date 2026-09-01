/**
 * Evidence 契约解耦测试（Gate 1 / Gate 4）
 *
 * 断言两件事：
 * 1. Core 只依赖抽象 EvidenceSource，可以用内存实现驱动，无需磁盘 Bundle
 * 2. Core 源码不 import 任何 Evidence 具体实现（格式解耦是结构性的，不靠约定）
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  EVIDENCE_SOURCE_METHODS,
  EvidenceContractErrorCode,
  TRUSTED_SCRIPT_POLICY,
  assertEvidenceSource,
  isEvidenceSource,
  normalizeTrustedScriptPolicy,
  resolveTrustedScriptIds,
} from '../src/core/evidence-contract.js';

import { createInMemoryEvidenceSource } from '../src/evidence/evidence-source.js';

const CORE_DIR = new URL('../src/core/', import.meta.url);

function source(overrides = {}) {
  return createInMemoryEvidenceSource({
    resources: {
      'scripts/entry.js': 'globalThis.__ran = true;',
      'scripts/helper.js': 'globalThis.__helper = 1;',
      'pages/index.html': '<!doctype html><html><body></body></html>',
    },
    entryScripts: ['scripts/entry.js'],
    scripts: ['scripts/entry.js', 'scripts/helper.js'],
    pages: ['pages/index.html'],
    ...overrides,
  });
}

// ------------------------------------------------------------ 契约形状

test('in-memory source satisfies the EvidenceSource contract', () => {
  const evidence = source();
  assert.equal(isEvidenceSource(evidence), true);
  assert.equal(assertEvidenceSource(evidence), evidence);

  for (const method of EVIDENCE_SOURCE_METHODS) {
    assert.equal(typeof evidence[method], 'function', `missing ${method}`);
  }
});

test('assertEvidenceSource names every missing method', () => {
  assert.throws(
    () => assertEvidenceSource({ has() {}, readText() {} }, 'testSource'),
    (error) => {
      assert.equal(error.code, EvidenceContractErrorCode.SOURCE_INVALID);
      assert.match(error.message, /testSource is missing required method/);
      assert.match(error.message, /listEntryScripts/);
      return true;
    }
  );
});

test('assertEvidenceSource rejects non-objects', () => {
  for (const invalid of [null, undefined, 42, 'bundle']) {
    assert.throws(
      () => assertEvidenceSource(invalid),
      (error) => error.code === EvidenceContractErrorCode.SOURCE_INVALID
    );
  }
});

test('isEvidenceSource never throws for arbitrary input', () => {
  assert.equal(isEvidenceSource(null), false);
  assert.equal(isEvidenceSource({}), false);
  assert.equal(isEvidenceSource(() => {}), false);
});

// -------------------------------------------------------- 读取与描述

test('source reads text and binary resources', async () => {
  const evidence = source();
  assert.equal(await evidence.readText('scripts/entry.js'), 'globalThis.__ran = true;');
  assert.ok(Buffer.isBuffer(await evidence.readBinary('scripts/entry.js')));
  assert.equal(evidence.has('scripts/entry.js'), true);
  assert.equal(evidence.has('scripts/missing.js'), false);
});

test('reading an unknown resource fails with a locatable error', async () => {
  const evidence = source();
  await assert.rejects(
    () => evidence.readText('scripts/nope.js'),
    (error) => {
      assert.equal(error.code, 'ERR_NV8_EVIDENCE_RESOURCE_NOT_FOUND');
      assert.match(error.message, /scripts\/nope\.js/);
      return true;
    }
  );
});

test('describe exposes counts without resource contents', () => {
  const described = source().describe();
  assert.equal(described.fileCount, 3);
  assert.ok(described.totalBytes > 0);
  assert.ok(!JSON.stringify(described).includes('__ran'));
});

test('listPages and listScripts return opaque ids', async () => {
  const evidence = source();
  const [page] = await evidence.listPages();
  assert.equal(page.id, 'pages/index.html');
  const scripts = await evidence.listScripts();
  assert.deepEqual(scripts.map((entry) => entry.id).sort(), [
    'scripts/entry.js',
    'scripts/helper.js',
  ]);
});

// ------------------------------------------------------------ 信任策略

test('default policy executes entry scripts only', async () => {
  const ids = await resolveTrustedScriptIds(source());
  assert.deepEqual(ids, ['scripts/entry.js']);
});

test('registered-only is accepted as a legacy alias', async () => {
  const normalized = normalizeTrustedScriptPolicy({ trustedScriptPolicy: 'registered-only' });
  assert.equal(normalized.policy, TRUSTED_SCRIPT_POLICY.ENTRYPOINTS_ONLY);

  const ids = await resolveTrustedScriptIds(source(), {
    trustedScriptPolicy: 'registered-only',
  });
  assert.deepEqual(ids, ['scripts/entry.js']);
});

test('deny-all executes nothing', async () => {
  const ids = await resolveTrustedScriptIds(source(), {
    trustedScriptPolicy: TRUSTED_SCRIPT_POLICY.DENY_ALL,
  });
  assert.deepEqual(ids, []);
});

test('allowlist executes exactly the listed scripts', async () => {
  const ids = await resolveTrustedScriptIds(source(), {
    trustedScriptPolicy: TRUSTED_SCRIPT_POLICY.ALLOWLIST,
    scriptAllowlist: ['scripts/helper.js'],
  });
  assert.deepEqual(ids, ['scripts/helper.js']);
});

test('allowlist rejects undeclared scripts instead of silently skipping', async () => {
  await assert.rejects(
    () => resolveTrustedScriptIds(source(), {
      trustedScriptPolicy: TRUSTED_SCRIPT_POLICY.ALLOWLIST,
      scriptAllowlist: ['scripts/injected.js'],
    }),
    (error) => {
      assert.equal(error.code, EvidenceContractErrorCode.POLICY_REJECTED);
      assert.match(error.message, /scripts\/injected\.js/);
      return true;
    }
  );
});

test('allowlist policy requires a non-empty allowlist', () => {
  assert.throws(
    () => normalizeTrustedScriptPolicy({
      trustedScriptPolicy: TRUSTED_SCRIPT_POLICY.ALLOWLIST,
    }),
    (error) => error.code === EvidenceContractErrorCode.POLICY_INVALID
  );
});

test('unknown policies are rejected with actionable suggestions', () => {
  assert.throws(
    () => normalizeTrustedScriptPolicy({ trustedScriptPolicy: 'allow-everything' }),
    (error) => {
      assert.equal(error.code, EvidenceContractErrorCode.POLICY_INVALID);
      assert.ok(error.suggestions.some((hint) => hint.includes('entrypoints-only')));
      return true;
    }
  );
});

test('scriptAllowlist must contain only strings', () => {
  assert.throws(
    () => normalizeTrustedScriptPolicy({
      trustedScriptPolicy: TRUSTED_SCRIPT_POLICY.ALLOWLIST,
      scriptAllowlist: ['ok', 42],
    }),
    /scriptAllowlist must be an array of strings/
  );
});

// ------------------------------------------------- 结构性解耦断言

/**
 * 递归列出 Core 目录下的所有 .js 文件
 */
async function collectCoreFiles(dir = CORE_DIR) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) {
      files.push(...await collectCoreFiles(child));
    } else if (entry.name.endsWith('.js')) {
      files.push(child);
    }
  }
  return files;
}

test('the contract module itself imports nothing', async () => {
  const contents = await readFile(new URL('evidence-contract.js', CORE_DIR), 'utf8');
  const imports = [...contents.matchAll(/^import\s.+$/gm)].map((match) => match[0]);
  assert.deepEqual(
    imports,
    [],
    'evidence-contract.js must stay dependency-free so Core cannot leak format coupling'
  );
});

test('Core source never imports a concrete Evidence implementation', async () => {
  const files = await collectCoreFiles();
  assert.ok(files.length > 0, 'expected to scan Core files');

  const offenders = [];
  for (const file of files) {
    const contents = await readFile(file, 'utf8');
    // 匹配 import/export 语句中指向 evidence 目录的路径
    const pattern = /(?:import|export)[^;]*?from\s+['"]([^'"]*evidence[^'"]*)['"]/g;
    for (const match of contents.matchAll(pattern)) {
      const specifier = match[1];
      // 契约自身（./evidence-contract.js）是 Core 的一部分，允许
      if (specifier.includes('evidence-contract')) continue;
      offenders.push({
        file: path.relative(process.cwd(), fileURLToPath(file)),
        specifier,
      });
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `Core must depend on the EvidenceSource contract only, found: ${JSON.stringify(offenders)}`
  );
});

// -------------------------------------------- Core 可被内存 source 驱动

test('Core executes evidence scripts from an in-memory source with no bundle on disk', async () => {
  const { createSandbox } = await import('../src/core/sandbox.js');
  const { createPluginRegistry } = await import('../src/core/plugin-registry.js');
  const { fullPreset } = await import('../src/presets/index.js');

  const silent = { info() {}, warn() {}, error() {}, debug() {} };

  const evidenceSource = createInMemoryEvidenceSource({
    resources: { 'entry.js': 'globalThis.__fromEvidence = 7 * 6;' },
    entryScripts: ['entry.js'],
  });

  const registry = createPluginRegistry();
  for (const plugin of fullPreset) registry.register(plugin);

  const sandbox = await createSandbox({
    plugins: registry.resolve(),
    logger: silent,
    profile: { id: 'evidence-contract-test' },
    evidenceSource,
    evidence: {
      executeScripts: true,
      trustedScriptPolicy: TRUSTED_SCRIPT_POLICY.ENTRYPOINTS_ONLY,
    },
  });

  const realm = await sandbox.createRealm('window', { url: 'https://target.test/' });
  assert.equal(
    realm.evaluate('globalThis.__fromEvidence'),
    42,
    'evidence script must run through the abstract contract'
  );
});

test('deny-all prevents evidence scripts from running at all', async () => {
  const { createSandbox } = await import('../src/core/sandbox.js');
  const { createPluginRegistry } = await import('../src/core/plugin-registry.js');
  const { fullPreset } = await import('../src/presets/index.js');

  const silent = { info() {}, warn() {}, error() {}, debug() {} };

  const evidenceSource = createInMemoryEvidenceSource({
    resources: { 'entry.js': 'globalThis.__denied = true;' },
    entryScripts: ['entry.js'],
  });

  const registry = createPluginRegistry();
  for (const plugin of fullPreset) registry.register(plugin);

  const sandbox = await createSandbox({
    plugins: registry.resolve(),
    logger: silent,
    profile: { id: 'evidence-contract-deny' },
    evidenceSource,
    evidence: {
      executeScripts: true,
      trustedScriptPolicy: TRUSTED_SCRIPT_POLICY.DENY_ALL,
    },
  });

  const realm = await sandbox.createRealm('window', { url: 'https://target.test/' });
  assert.equal(realm.evaluate('globalThis.__denied'), undefined);
});

test('Core rejects an object that does not satisfy the contract', async () => {
  const { createSandbox } = await import('../src/core/sandbox.js');
  const { createPluginRegistry } = await import('../src/core/plugin-registry.js');
  const { fullPreset } = await import('../src/presets/index.js');

  const registry = createPluginRegistry();
  for (const plugin of fullPreset) registry.register(plugin);

  await assert.rejects(
    () => createSandbox({
      plugins: registry.resolve(),
      logger: { info() {}, warn() {}, error() {}, debug() {} },
      profile: { id: 'evidence-contract-invalid' },
      evidenceSource: { readText() {} },
    }),
    (error) => error.code === EvidenceContractErrorCode.SOURCE_INVALID
  );
});
