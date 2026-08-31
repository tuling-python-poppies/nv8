import vm from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createSandbox } from '../src/public/create-sandbox.js';
import { createNv8, domPreset } from '../src/index.js';
import { streamsPlugin } from '../src/plugins/streams/index.js';
import { fetchPlugin } from '../src/plugins/fetch/index.js';
import { waitForValue } from './helpers/async-wait.js';

async function writeEvidenceBundle(root) {
  const files = {
    'pages/index.html': '<!doctype html><html><body><main id="app">bundle</main></body></html>',
    'scripts/boot.js': `globalThis.evidenceBoot = "loaded";
      globalThis.evidenceCurrentScript = document.currentScript?.src ?? null;
      globalThis.evidenceLifecycle = [];
      document.addEventListener("DOMContentLoaded", () => evidenceLifecycle.push("DOMContentLoaded"));
      window.addEventListener("load", () => evidenceLifecycle.push("load"));`,
    'scripts/dynamic.js': 'globalThis.dynamicEvidenceBoot = "loaded-dynamically";',
    'network/replay.json': JSON.stringify({
      requests: [{
        id: 'get-data',
        request: {
          method: 'GET',
          url: 'https://api.example.test/data',
        },
        response: {
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'text/plain' },
          body: 'replayed-response',
        },
      }],
    }),
  };
  const manifest = {
    schemaVersion: '1.0',
    bundleId: 'runtime-integration',
    target: {
      url: 'https://example.test/',
      origin: 'https://example.test',
      capturedAt: '2026-01-01T00:00:00.000Z',
    },
    files: [],
    entrypoints: ['scripts/boot.js'],
    replay: {
      fixture: 'network/replay.json',
      matching: 'method-url',
    },
  };
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(root, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, 'utf8');
    const bytes = Buffer.byteLength(content, 'utf8');
    manifest.files.push({
      path: filePath,
      role: filePath.endsWith('.html')
        ? 'page'
        : filePath.endsWith('.js')
          ? 'script'
          : 'network-replay',
      mediaType: filePath.endsWith('.html')
        ? 'text/html'
        : filePath.endsWith('.js')
          ? 'text/javascript'
          : 'application/json',
      bytes,
      sha256: crypto.createHash('sha256').update(content).digest('hex'),
    });
  }
  await fs.writeFile(
    path.join(root, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8',
  );
}

if (typeof vm.SourceTextModule !== 'function') {
  test('Evidence Bundle integrates with the public sandbox runtime', {
    skip: 'Node must enable vm.SourceTextModule for the legacy runtime',
  }, () => {});
} else {
  test('Evidence Bundle integrates with the public sandbox runtime', async () => {
    const bundlePath = await fs.mkdtemp(path.join(os.tmpdir(), 'nv8-evidence-'));
    let sandbox;
    try {
      await writeEvidenceBundle(bundlePath);
      sandbox = await createSandbox('https://example.test/', {
        evidence: { bundlePath },
      });
      assert.equal(await sandbox.run('globalThis.evidenceBoot'), 'loaded');
      assert.equal(
        await sandbox.run('document.querySelector("#app").textContent'),
        'bundle',
      );
      assert.equal(
        await sandbox.run(
          'fetch("https://api.example.test/data").then(response => response.text())',
        ),
        'replayed-response',
      );
      await sandbox.run(`(() => {
        const script = document.createElement('script');
        script.src = '/scripts/dynamic.js';
        document.head.insertBefore(script, document.head.firstChild);
      })()`);
      // 动态脚本是异步注入的，等它真的执行完，而不是赌一个时长
      await waitForValue(
        () => sandbox.run('globalThis.dynamicEvidenceBoot ?? null'),
        'loaded-dynamically',
        { label: 'dynamicEvidenceBoot (public runtime)' },
      );
      assert.equal(
        await sandbox.run('globalThis.dynamicEvidenceBoot'),
        'loaded-dynamically',
      );
    } finally {
      await sandbox?.close();
      await fs.rm(bundlePath, { recursive: true, force: true });
      createSandbox.drain();
    }
  });

  test('Evidence Bundle injects scripts through the Core DOM mutation path', async () => {
    const bundlePath = await fs.mkdtemp(path.join(os.tmpdir(), 'nv8-core-evidence-'));
    let nv8;
    try {
      await writeEvidenceBundle(bundlePath);
      nv8 = await createNv8({
        plugins: [...domPreset, streamsPlugin, fetchPlugin],
        profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/' },
        evidence: { bundlePath },
        logger: { info() {}, warn() {}, error() {}, trace() {} },
      });
      const realm = await nv8.sandbox.createRealm({ type: 'root' });
      assert.equal(realm.evaluate('globalThis.evidenceBoot'), 'loaded');
      assert.equal(
        realm.evaluate('globalThis.evidenceCurrentScript'),
        'https://example.test/scripts/boot.js',
      );
      assert.equal(
        realm.evaluate('JSON.stringify(globalThis.evidenceLifecycle)'),
        JSON.stringify(['DOMContentLoaded', 'load']),
      );
      assert.equal(
        await realm.evaluate(
          'fetch("https://api.example.test/data").then(response => response.text())',
        ),
        'replayed-response',
      );
      realm.evaluate(`(() => {
        const script = document.createElement('script');
        script.src = '/scripts/dynamic.js';
        document.head.insertBefore(script, document.head.firstChild);
      })()`);
      await waitForValue(
        () => realm.evaluate('globalThis.dynamicEvidenceBoot ?? null'),
        'loaded-dynamically',
        { label: 'dynamicEvidenceBoot (core runtime)' },
      );
      assert.equal(realm.evaluate('globalThis.dynamicEvidenceBoot'), 'loaded-dynamically');
      await nv8.destroy();
      nv8 = null;
    } finally {
      await nv8?.destroy();
      await fs.rm(bundlePath, { recursive: true, force: true });
    }
  });
}
