/**
 * Evidence Bundle 测试
 * 
 * 测试 Evidence Bundle 加载、验证和 replay 功能
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  loadEvidenceBundle,
  TRUST_POLICIES,
  FILE_ROLES,
  EvidenceNotFoundError,
  EvidenceInvalidManifestError,
  EvidencePathUnsafeError,
  EvidenceFileMissingError,
  EvidenceFileUndeclaredError,
  EvidenceHashMismatchError,
  createNetworkReplay,
  MATCH_STRATEGY,
  REPLAY_RESULT,
} from '../src/collection/evidence/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_DIR = path.join(__dirname, 'fixtures', 'evidence-bundles');

/**
 * 创建测试用 Bundle
 */
async function createTestBundle(bundlePath, manifest, files) {
  await fs.mkdir(bundlePath, { recursive: true });
  
  // 写入文件
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(bundlePath, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    
    if (typeof content === 'string') {
      await fs.writeFile(fullPath, content, 'utf8');
    } else {
      await fs.writeFile(fullPath, content);
    }
  }
  
  // 计算文件哈希并更新 manifest
  for (const file of manifest.files) {
    const fullPath = path.join(bundlePath, file.path);
    const content = await fs.readFile(fullPath);
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    const stat = await fs.stat(fullPath);
    
    file.sha256 = hash;
    file.bytes = stat.size;
  }
  
  // 写入 manifest
  await fs.writeFile(
    path.join(bundlePath, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );
}

/**
 * 清理测试 Bundle
 */
async function cleanupTestBundle(bundlePath) {
  try {
    await fs.rm(bundlePath, { recursive: true, force: true });
  } catch (error) {
    // Ignore
  }
}

describe('Evidence Bundle Loader', () => {
  it('应该加载有效的 Bundle', async () => {
    const bundlePath = path.join(FIXTURES_DIR, 'valid-bundle');
    
    const manifest = {
      schemaVersion: '1.0',
      bundleId: 'test-bundle-001',
      target: {
        url: 'https://example.com/',
        origin: 'https://example.com',
        capturedAt: '2026-01-01T00:00:00.000Z',
      },
      files: [
        {
          path: 'scripts/main.js',
          role: FILE_ROLES.SCRIPT,
          mediaType: 'text/javascript',
          bytes: 0,
          sha256: '',
        },
        {
          path: 'pages/index.html',
          role: FILE_ROLES.PAGE,
          mediaType: 'text/html',
          bytes: 0,
          sha256: '',
        },
      ],
      entrypoints: ['scripts/main.js'],
    };
    
    const files = {
      'scripts/main.js': 'console.log("Hello from bundle");',
      'pages/index.html': '<html><body>Test</body></html>',
    };
    
    try {
      await createTestBundle(bundlePath, manifest, files);
      
      const bundle = await loadEvidenceBundle(bundlePath);
      
      assert.strictEqual(bundle.manifest.bundleId, 'test-bundle-001');
      assert.strictEqual(bundle.getFiles().length, 2);
      assert.strictEqual(bundle.hasFile('scripts/main.js'), true);
      assert.strictEqual(bundle.hasFile('nonexistent.js'), false);
      
      const scriptContent = await bundle.readFile('scripts/main.js');
      assert.strictEqual(scriptContent, 'console.log("Hello from bundle");');
      
      const entrypoints = bundle.getEntrypoints();
      assert.strictEqual(entrypoints.length, 1);
      assert.strictEqual(entrypoints[0], 'scripts/main.js');
    } finally {
      await cleanupTestBundle(bundlePath);
    }
  });
  
  it('应该拒绝不存在的 Bundle', async () => {
    const bundlePath = path.join(FIXTURES_DIR, 'nonexistent-bundle');
    
    await assert.rejects(
      async () => await loadEvidenceBundle(bundlePath),
      EvidenceNotFoundError
    );
  });
  
  it('应该拒绝缺少 manifest.json 的 Bundle', async () => {
    const bundlePath = path.join(FIXTURES_DIR, 'no-manifest-bundle');
    
    try {
      await fs.mkdir(bundlePath, { recursive: true });
      
      await assert.rejects(
        async () => await loadEvidenceBundle(bundlePath),
        EvidenceInvalidManifestError
      );
    } finally {
      await cleanupTestBundle(bundlePath);
    }
  });
  
  it('应该拒绝不安全的路径', async () => {
    const bundlePath = path.join(FIXTURES_DIR, 'unsafe-path-bundle');
    
    const manifest = {
      schemaVersion: '1.0',
      bundleId: 'unsafe-path-bundle',
      target: {
        url: 'https://example.com/',
        origin: 'https://example.com',
        capturedAt: '2026-01-01T00:00:00.000Z',
      },
      files: [
        {
          path: '../../../etc/passwd',
          role: FILE_ROLES.SCRIPT,
          mediaType: 'text/javascript',
          bytes: 0,
          sha256: '',
        },
      ],
    };
    
    try {
      await fs.mkdir(bundlePath, { recursive: true });
      await fs.writeFile(
        path.join(bundlePath, 'manifest.json'),
        JSON.stringify(manifest, null, 2),
        'utf8'
      );
      
      // 不创建文件，直接测试路径验证
      await assert.rejects(
        async () => await loadEvidenceBundle(bundlePath),
        EvidencePathUnsafeError
      );
    } finally {
      await cleanupTestBundle(bundlePath);
    }
  });
  
  it('应该检测文件缺失', async () => {
    const bundlePath = path.join(FIXTURES_DIR, 'missing-file-bundle');
    
    const manifest = {
      schemaVersion: '1.0',
      bundleId: 'missing-file-bundle',
      target: {
        url: 'https://example.com/',
        origin: 'https://example.com',
        capturedAt: '2026-01-01T00:00:00.000Z',
      },
      files: [
        {
          path: 'scripts/main.js',
          role: FILE_ROLES.SCRIPT,
          mediaType: 'text/javascript',
          bytes: 100,
          sha256: 'a'.repeat(64),
        },
      ],
    };
    
    try {
      await fs.mkdir(bundlePath, { recursive: true });
      await fs.writeFile(
        path.join(bundlePath, 'manifest.json'),
        JSON.stringify(manifest, null, 2),
        'utf8'
      );
      
      await assert.rejects(
        async () => await loadEvidenceBundle(bundlePath),
        EvidenceFileMissingError
      );
    } finally {
      await cleanupTestBundle(bundlePath);
    }
  });
  
  it('应该检测 hash 不匹配', async () => {
    const bundlePath = path.join(FIXTURES_DIR, 'hash-mismatch-bundle');
    
    const manifest = {
      schemaVersion: '1.0',
      bundleId: 'hash-mismatch-bundle',
      target: {
        url: 'https://example.com/',
        origin: 'https://example.com',
        capturedAt: '2026-01-01T00:00:00.000Z',
      },
      files: [
        {
          path: 'scripts/main.js',
          role: FILE_ROLES.SCRIPT,
          mediaType: 'text/javascript',
          bytes: 0,
          sha256: 'deadbeef'.repeat(8), // 错误的 hash
        },
      ],
    };
    
    const files = {
      'scripts/main.js': 'console.log("test");',
    };
    
    try {
      await fs.mkdir(bundlePath, { recursive: true });
      await fs.mkdir(path.join(bundlePath, 'scripts'), { recursive: true });
      await fs.writeFile(
        path.join(bundlePath, 'scripts/main.js'),
        files['scripts/main.js'],
        'utf8'
      );
      
      const stat = await fs.stat(path.join(bundlePath, 'scripts/main.js'));
      manifest.files[0].bytes = stat.size;
      
      await fs.writeFile(
        path.join(bundlePath, 'manifest.json'),
        JSON.stringify(manifest, null, 2),
        'utf8'
      );
      
      await assert.rejects(
        async () => await loadEvidenceBundle(bundlePath),
        EvidenceHashMismatchError
      );
    } finally {
      await cleanupTestBundle(bundlePath);
    }
  });
  
  it('应该拒绝 Manifest 未声明的文件', async () => {
    const bundlePath = path.join(FIXTURES_DIR, 'undeclared-file-bundle');
    const script = 'globalThis.declared = true;';
    const manifest = {
      schemaVersion: '1.0',
      bundleId: 'undeclared-file-bundle',
      target: {
        url: 'https://example.com/',
        origin: 'https://example.com',
        capturedAt: '2026-01-01T00:00:00.000Z',
      },
      files: [{
        path: 'scripts/main.js',
        role: FILE_ROLES.SCRIPT,
        mediaType: 'text/javascript',
        bytes: Buffer.byteLength(script),
        sha256: crypto.createHash('sha256').update(script).digest('hex'),
      }],
    };
    try {
      await fs.mkdir(path.join(bundlePath, 'scripts'), { recursive: true });
      await fs.writeFile(path.join(bundlePath, 'scripts/main.js'), script, 'utf8');
      await fs.writeFile(path.join(bundlePath, 'extra.txt'), 'undeclared', 'utf8');
      await fs.writeFile(
        path.join(bundlePath, 'manifest.json'),
        JSON.stringify(manifest),
        'utf8',
      );
      await assert.rejects(
        () => loadEvidenceBundle(bundlePath),
        EvidenceFileUndeclaredError,
      );
    } finally {
      await cleanupTestBundle(bundlePath);
    }
  });
});

describe('Network Replay', () => {
  it('应该匹配简单的请求', async () => {
    const bundlePath = path.join(FIXTURES_DIR, 'replay-bundle');
    
    const manifest = {
      schemaVersion: '1.0',
      bundleId: 'replay-bundle',
      target: {
        url: 'https://example.com/',
        origin: 'https://example.com',
        capturedAt: '2026-01-01T00:00:00.000Z',
      },
      files: [
        {
          path: 'network/replay.json',
          role: FILE_ROLES.NETWORK_REPLAY,
          mediaType: 'application/json',
          bytes: 0,
          sha256: '',
        },
      ],
      replay: {
        fixture: 'network/replay.json',
        matching: MATCH_STRATEGY.METHOD_URL,
      },
    };
    
    const replayFixture = {
      requests: [
        {
          id: 'request-001',
          request: {
            method: 'GET',
            url: 'https://api.example.com/data',
          },
          response: {
            status: 200,
            statusText: 'OK',
            headers: [{ name: 'content-type', value: 'application/json' }],
            body: '{"result": "success"}',
          },
          repeat: 'once',
        },
      ],
    };
    
    const files = {
      'network/replay.json': JSON.stringify(replayFixture, null, 2),
    };
    
    try {
      await createTestBundle(bundlePath, manifest, files);
      
      const bundle = await loadEvidenceBundle(bundlePath);
      const replay = await createNetworkReplay(bundle);
      
      assert.ok(replay);
      
      // 匹配请求
      const result = await replay.match({
        method: 'GET',
        url: 'https://api.example.com/data',
      });
      
      assert.strictEqual(result.result, REPLAY_RESULT.MATCHED);
      assert.strictEqual(result.response.status, 200);
      assert.strictEqual(result.response.body, '{"result": "success"}');
      
      // 第二次请求应该失败（repeat: once）
      const result2 = await replay.match({
        method: 'GET',
        url: 'https://api.example.com/data',
      });
      
      assert.strictEqual(result2.result, REPLAY_RESULT.NOT_FOUND);
      
      // 检查统计信息
      const stats = replay.getStats();
      assert.strictEqual(stats.total, 2);
      assert.strictEqual(stats.matched, 1);
      assert.strictEqual(stats.notFound, 1);
    } finally {
      await cleanupTestBundle(bundlePath);
    }
  });
  
  it('应该处理未找到的请求', async () => {
    const bundlePath = path.join(FIXTURES_DIR, 'replay-not-found-bundle');
    
    const manifest = {
      schemaVersion: '1.0',
      bundleId: 'replay-not-found-bundle',
      target: {
        url: 'https://example.com/',
        origin: 'https://example.com',
        capturedAt: '2026-01-01T00:00:00.000Z',
      },
      files: [
        {
          path: 'network/replay.json',
          role: FILE_ROLES.NETWORK_REPLAY,
          mediaType: 'application/json',
          bytes: 0,
          sha256: '',
        },
      ],
      replay: {
        fixture: 'network/replay.json',
        matching: MATCH_STRATEGY.METHOD_URL,
      },
    };
    
    const replayFixture = {
      requests: [],
    };
    
    const files = {
      'network/replay.json': JSON.stringify(replayFixture, null, 2),
    };
    
    try {
      await createTestBundle(bundlePath, manifest, files);
      
      const bundle = await loadEvidenceBundle(bundlePath);
      const replay = await createNetworkReplay(bundle);
      
      const result = await replay.match({
        method: 'GET',
        url: 'https://api.example.com/nonexistent',
      });
      
      assert.strictEqual(result.result, REPLAY_RESULT.NOT_FOUND);
      assert.strictEqual(result.response, null);
    } finally {
      await cleanupTestBundle(bundlePath);
    }
  });
});
