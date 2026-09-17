/**
 * Evidence Bundle Loader
 * 
 * 加载、校验和解析 Evidence Bundle
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import {
  FILE_ROLES,
  DEFAULT_LIMITS,
  TRUST_POLICIES,
  isPathSafe,
  isValidSha256,
  isValidMediaType,
  isValidUrl,
  isValidIso8601,
} from './schema.js';
import {
  SUPPORTED_SCHEMA_VERSIONS,
  resolveSchemaCompatibility,
} from './schema-compatibility.js';
import {
  EvidenceNotFoundError,
  EvidenceInvalidManifestError,
  EvidenceSchemaUnsupportedError,
  EvidencePathUnsafeError,
  EvidenceSymlinkRejectedError,
  EvidenceFileMissingError,
  EvidenceFileUndeclaredError,
  EvidenceHashMismatchError,
  EvidenceMediaTypeMismatchError,
  EvidenceLimitExceededError,
  EvidenceEntrypointInvalidError,
  EvidenceFixtureInvalidError,
  EvidenceSignatureRequiredError,
  EvidenceSignatureInvalidError,
} from './errors.js';
import { verifyEvidenceManifest } from './bundle-signature.js';
import { canonicalSnapshot } from '../request-protocol/canonical-json.js';

/**
 * 加载 Evidence Bundle
 * 
 * @param {string} bundlePath - Bundle 目录路径
 * @param {Object} options - 加载选项
 * @returns {Promise<EvidenceBundle>}
 */
export async function loadEvidenceBundle(bundlePath, options = {}) {
  const {
    limits = DEFAULT_LIMITS,
    trustedScriptPolicy = TRUST_POLICIES.REGISTERED_ONLY,
    signaturePolicy = 'optional',
    trustedKeys,
    allowLegacySchema = true,
    supportedSchemaVersions = SUPPORTED_SCHEMA_VERSIONS,
  } = options;
  if (!['optional', 'required', 'disabled'].includes(signaturePolicy)) {
    throw new TypeError('signaturePolicy must be optional, required, or disabled');
  }
  
  const loader = new EvidenceBundleLoader(
    bundlePath,
    limits,
    trustedScriptPolicy,
    signaturePolicy,
    trustedKeys,
    allowLegacySchema,
    supportedSchemaVersions,
  );
  return await loader.load();
}

/**
 * Evidence Bundle Loader 实现
 */
class EvidenceBundleLoader {
  constructor(
    bundlePath,
    limits,
    trustedScriptPolicy,
    signaturePolicy,
    trustedKeys,
    allowLegacySchema,
    supportedSchemaVersions,
  ) {
    this.bundlePath = bundlePath;
    this.limits = limits;
    this.trustedScriptPolicy = trustedScriptPolicy;
    this.signaturePolicy = signaturePolicy;
    this.trustedKeys = trustedKeys;
    this.allowLegacySchema = allowLegacySchema;
    this.supportedSchemaVersions = [...supportedSchemaVersions];
    this.manifest = null;
    this.files = new Map(); // path -> file metadata
    this.contents = new Map();
    this.loadedAt = null;
  }
  
  /**
   * 加载 Bundle
   */
  async load() {
    this.loadedAt = new Date().toISOString();
    
    // 1. 检查 Bundle 目录存在性
    await this.checkBundleExists();
    
    // 2. 加载和解析 manifest.json
    await this.loadManifest();
    
    // 3. 验证 Manifest
    await this.validateManifest();
    
    // 4. 验证所有文件
    await this.validateFiles();
    await this.validateBundleContents();
    
    // 5. 验证入口点
    await this.validateEntrypoints();
    
    // 6. 创建只读 Bundle 对象
    return this.createBundle();
  }
  
  /**
   * 检查 Bundle 目录存在性
   */
  async checkBundleExists() {
    try {
      const stat = await fs.stat(this.bundlePath);
      if (!stat.isDirectory()) {
        throw new EvidenceNotFoundError(this.bundlePath);
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new EvidenceNotFoundError(this.bundlePath);
      }
      throw error;
    }
  }
  
  /**
   * 加载 Manifest
   */
  async loadManifest() {
    const manifestPath = path.join(this.bundlePath, 'manifest.json');
    
    try {
      const content = await fs.readFile(manifestPath, 'utf8');
      
      // 检查 Manifest 大小
      const byteLength = Buffer.byteLength(content, 'utf8');
      if (byteLength > this.limits.maxManifestBytes) {
        throw new EvidenceLimitExceededError(
          'maxManifestBytes',
          this.limits.maxManifestBytes,
          byteLength
        );
      }
      
      this.manifest = JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new EvidenceInvalidManifestError('manifest.json not found');
      }
      if (error instanceof SyntaxError) {
        throw new EvidenceInvalidManifestError('invalid JSON', { error: error.message });
      }
      throw error;
    }
  }
  
  /**
   * 验证 Manifest
   */
  async validateManifest() {
    const m = this.manifest;
    
    // 检查 schema 版本
    if (!m.schemaVersion) {
      throw new EvidenceInvalidManifestError('missing schemaVersion');
    }
    
    const compatibility = resolveSchemaCompatibility(
      m.schemaVersion,
      this.supportedSchemaVersions,
      { allowLegacy: this.allowLegacySchema },
    );
    if (!compatibility.compatible) {
      throw new EvidenceSchemaUnsupportedError(
        m.schemaVersion,
        this.supportedSchemaVersions,
        compatibility.reason,
      );
    }
    
    // 检查必需字段
    if (!m.bundleId || typeof m.bundleId !== 'string') {
      throw new EvidenceInvalidManifestError('missing or invalid bundleId');
    }
    
    if (!m.target || typeof m.target !== 'object') {
      throw new EvidenceInvalidManifestError('missing or invalid target');
    }
    
    if (!isValidUrl(m.target.url)) {
      throw new EvidenceInvalidManifestError('invalid target.url');
    }
    
    if (!isValidUrl(m.target.origin)) {
      throw new EvidenceInvalidManifestError('invalid target.origin');
    }
    
    if (!isValidIso8601(m.target.capturedAt)) {
      throw new EvidenceInvalidManifestError('invalid target.capturedAt (must be ISO 8601)');
    }
    
    this.validateSignature();

    // 检查 files 数组
    if (!Array.isArray(m.files)) {
      throw new EvidenceInvalidManifestError('missing or invalid files array');
    }
    
    if (m.files.length === 0) {
      throw new EvidenceInvalidManifestError('files array is empty');
    }
    
    if (m.files.length > this.limits.maxFiles) {
      throw new EvidenceLimitExceededError('maxFiles', this.limits.maxFiles, m.files.length);
    }
    
    // 验证每个文件条目
    const seenPaths = new Set();
    let totalBytes = 0;
    
    for (const file of m.files) {
      // 检查必需字段
      if (!file.path || typeof file.path !== 'string') {
        throw new EvidenceInvalidManifestError('file missing path');
      }
      
      // 检查路径安全性
      if (!isPathSafe(file.path)) {
        throw new EvidencePathUnsafeError(file.path, 'path contains unsafe characters');
      }
      
      // 检查重复路径
      if (seenPaths.has(file.path)) {
        throw new EvidenceInvalidManifestError(`duplicate file path: ${file.path}`);
      }
      seenPaths.add(file.path);
      
      // 检查角色
      if (!file.role || !Object.values(FILE_ROLES).includes(file.role)) {
        throw new EvidenceInvalidManifestError(`invalid role for ${file.path}: ${file.role}`);
      }
      
      // 检查媒体类型
      if (!file.mediaType || !isValidMediaType(file.mediaType, file.role)) {
        throw new EvidenceMediaTypeMismatchError(file.path, file.mediaType, file.role);
      }
      
      // 检查文件大小
      if (typeof file.bytes !== 'number' || file.bytes < 0) {
        throw new EvidenceInvalidManifestError(`invalid bytes for ${file.path}`);
      }
      
      if (file.bytes > this.limits.maxFileBytes) {
        throw new EvidenceLimitExceededError('maxFileBytes', this.limits.maxFileBytes, file.bytes);
      }
      
      totalBytes += file.bytes;
      
      // 检查 SHA-256
      if (!isValidSha256(file.sha256)) {
        throw new EvidenceInvalidManifestError(`invalid sha256 for ${file.path}`);
      }
      
      // 保存文件元数据
      this.files.set(file.path, {
        path: file.path,
        role: file.role,
        mediaType: file.mediaType,
        bytes: file.bytes,
        sha256: file.sha256,
      });
    }
    
    // 检查总大小
    if (totalBytes > this.limits.maxTotalBytes) {
      throw new EvidenceLimitExceededError('maxTotalBytes', this.limits.maxTotalBytes, totalBytes);
    }
  }
  
  /**
   * 验证 manifest 签名。签名是可选的以保持旧 Bundle 兼容；一旦 Bundle
   * 携带签名，必须使用调用方显式提供的受信任 key 验证。
   */
  validateSignature() {
    const hasSignature = this.manifest.signature !== undefined;
    if (this.signaturePolicy === 'disabled') return;
    if (!hasSignature) {
      if (this.signaturePolicy === 'required') {
        throw new EvidenceSignatureRequiredError();
      }
      return;
    }
    const result = verifyEvidenceManifest(this.manifest, this.trustedKeys);
    if (!result.valid) {
      throw new EvidenceSignatureInvalidError(result.reason);
    }
  }

  /**
   * 验证所有文件
   */
  async validateFiles() {
    const tasks = [];
    
    for (const [filePath, metadata] of this.files.entries()) {
      tasks.push(this.validateFile(filePath, metadata));
    }
    
    await Promise.all(tasks);
  }
  
  /**
   * 验证单个文件
   */
  async validateFile(filePath, metadata) {
    const fullPath = path.join(this.bundlePath, filePath);
    
    try {
      // 检查文件存在性
      const stat = await fs.lstat(fullPath);
      
      // 拒绝符号链接
      if (stat.isSymbolicLink()) {
        throw new EvidenceSymlinkRejectedError(filePath);
      }
      
      // 检查是否为普通文件
      if (!stat.isFile()) {
        throw new EvidenceFileMissingError(filePath);
      }
      
      // 检查文件大小
      if (stat.size !== metadata.bytes) {
        throw new EvidenceInvalidManifestError(
          `file size mismatch for ${filePath}: manifest says ${metadata.bytes}, actual ${stat.size}`
        );
      }
      
      // 计算并验证 SHA-256
      const content = await fs.readFile(fullPath);
      if (content.length !== metadata.bytes) {
        throw new EvidenceInvalidManifestError(`file size changed for ${filePath}`);
      }
      const actualHash = crypto.createHash('sha256').update(content).digest('hex');
      if (actualHash !== metadata.sha256) {
        throw new EvidenceHashMismatchError(filePath, metadata.sha256, actualHash);
      }
      this.contents.set(filePath, content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new EvidenceFileMissingError(filePath);
      }
      throw error;
    }
  }
  
  /**
   * 计算文件的 SHA-256
   */
  async computeFileSha256(fullPath) {
    const hash = crypto.createHash('sha256');
    const stream = await fs.open(fullPath, 'r');
    
    try {
      for await (const chunk of stream.createReadStream()) {
        hash.update(chunk);
      }
      return hash.digest('hex');
    } finally {
      await stream.close();
    }
  }
  
  /**
   * 扫描 Bundle 目录，拒绝 Manifest 未声明的文件和任意符号链接。
   */
  async validateBundleContents() {
    const walk = async (directory) => {
      const entries = await fs.readdir(directory, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        const relativePath = path.relative(this.bundlePath, fullPath)
          .split(path.sep)
          .join('/');
        
        if (entry.isSymbolicLink()) {
          throw new EvidenceSymlinkRejectedError(relativePath);
        }
        if (entry.isDirectory()) {
          await walk(fullPath);
          continue;
        }
        if (!entry.isFile()) {
          throw new EvidencePathUnsafeError(relativePath, 'unsupported filesystem entry');
        }
        if (relativePath === 'manifest.json') continue;
        if (!this.files.has(relativePath)) {
          throw new EvidenceFileUndeclaredError(relativePath);
        }
      }
    };
    
    await walk(this.bundlePath);
  }
  
  /**
   * 验证入口点
   */
  async validateEntrypoints() {
    if (!this.manifest.entrypoints || !Array.isArray(this.manifest.entrypoints)) {
      return; // 入口点是可选的
    }
    
    for (const entrypoint of this.manifest.entrypoints) {
      if (!this.files.has(entrypoint)) {
        throw new EvidenceEntrypointInvalidError(entrypoint, 'file not found in manifest');
      }
      
      const file = this.files.get(entrypoint);
      if (file.role !== FILE_ROLES.SCRIPT) {
        throw new EvidenceEntrypointInvalidError(entrypoint, `expected role 'script', got '${file.role}'`);
      }
      
    }
  }
  
  /**
   * 创建只读 Bundle 对象
   */
  createBundle() {
    const bundlePath = this.bundlePath;
    const manifest = canonicalSnapshot(this.manifest);
    const files = new Map([...this.files].map(([key, value]) => [key, canonicalSnapshot(value)]));
    const contents = this.contents;
    const loadedAt = this.loadedAt;
    
    return Object.freeze({
      /**
       * Manifest 数据
       */
      get manifest() {
        return Object.freeze({ ...manifest });
      },
      
      /**
       * 获取所有文件元数据
       */
      getFiles(role = null) {
        const allFiles = Array.from(files.values());
        if (role) {
          return allFiles.filter(f => f.role === role);
        }
        return allFiles;
      },
      
      /**
       * 获取文件元数据
       */
      getFile(filePath) {
        return files.get(filePath) || null;
      },
      
      /**
       * 检查文件是否存在
       */
      hasFile(filePath) {
        return files.has(filePath);
      },
      
      /**
       * 读取文件内容
       */
      async readFile(filePath, encoding = 'utf8') {
        if (!files.has(filePath)) {
          throw new EvidenceFileMissingError(filePath);
        }
        
        const content = contents.get(filePath);
        return encoding === null ? Buffer.from(content) : content.toString(encoding);
      },
      
      /**
       * 读取文件为 Buffer
       */
      async readFileBuffer(filePath) {
        if (!files.has(filePath)) {
          throw new EvidenceFileMissingError(filePath);
        }
        
        return Buffer.from(contents.get(filePath));
      },
      
      /**
       * 读取 JSON 文件
       */
      async readJson(filePath) {
        const content = await this.readFile(filePath, 'utf8');
        try {
          return JSON.parse(content);
        } catch (error) {
          throw new EvidenceFixtureInvalidError(filePath, 'invalid JSON');
        }
      },
      
      /**
       * 获取脚本列表
       */
      getScripts() {
        return this.getFiles(FILE_ROLES.SCRIPT);
      },
      
      /**
       * 获取入口点
       */
      getEntrypoints() {
        return [...(manifest.entrypoints || [])];
      },
      
      /**
       * 获取页面列表
       */
      getPages() {
        return this.getFiles(FILE_ROLES.PAGE);
      },
      
      /**
       * 获取网络 replay fixture
       */
      async getNetworkReplay() {
        if (!manifest.replay || !manifest.replay.fixture) {
          return null;
        }
        
        return await this.readJson(manifest.replay.fixture);
      },
      
      /**
       * 获取验证信息
       */
      getVerification() {
        return Object.freeze({
          schemaVersion: manifest.schemaVersion,
          bundleId: manifest.bundleId,
          fileCount: files.size,
          totalBytes: Array.from(files.values()).reduce((sum, f) => sum + f.bytes, 0),
          loadedAt,
        });
      },
      
      /**
       * 导出摘要
       */
      toString() {
        return `EvidenceBundle(${manifest.bundleId}, ${files.size} files, loaded at ${loadedAt})`;
      },
    });
  }
}

/**
 * @typedef {Object} EvidenceBundle
 * @property {Object} manifest - Manifest 数据
 * @property {function} getFiles - 获取所有文件元数据
 * @property {function} getFile - 获取文件元数据
 * @property {function} hasFile - 检查文件是否存在
 * @property {function} readFile - 读取文件内容
 * @property {function} readFileBuffer - 读取文件为 Buffer
 * @property {function} readJson - 读取 JSON 文件
 * @property {function} getScripts - 获取脚本列表
 * @property {function} getEntrypoints - 获取入口点
 * @property {function} getPages - 获取页面列表
 * @property {function} getNetworkReplay - 获取网络 replay fixture
 * @property {function} getVerification - 获取验证信息
 */
