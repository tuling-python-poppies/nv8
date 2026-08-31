/**
 * Evidence Bundle Errors
 * 
 * Evidence Bundle 相关的错误定义
 */

import { DiagnosticError } from '../core/diagnostics/errors.js';

/**
 * Evidence Bundle 错误基类
 */
export class EvidenceError extends DiagnosticError {
  constructor(code, message, details = {}) {
    super(code, message, details);
    this.name = 'EvidenceError';
  }
}

/**
 * Bundle 未找到
 */
export class EvidenceNotFoundError extends EvidenceError {
  constructor(path) {
    super(
      'EVIDENCE_NOT_FOUND',
      `Evidence bundle not found: ${path}`,
      { path }
    );
  }
}

/**
 * Manifest 无效
 */
export class EvidenceInvalidManifestError extends EvidenceError {
  constructor(reason, details = {}) {
    super(
      'EVIDENCE_INVALID_MANIFEST',
      `Invalid manifest: ${reason}`,
      details
    );
  }
}

/**
 * Schema 版本不支持
 */
export class EvidenceSchemaUnsupportedError extends EvidenceError {
  constructor(version, supportedVersions) {
    super(
      'EVIDENCE_SCHEMA_UNSUPPORTED',
      `Schema version ${version} is not supported. Supported versions: ${supportedVersions.join(', ')}`,
      { version, supportedVersions }
    );
  }
}

/**
 * 路径不安全
 */
export class EvidencePathUnsafeError extends EvidenceError {
  constructor(path, reason) {
    super(
      'EVIDENCE_PATH_UNSAFE',
      `Unsafe path: ${path} (${reason})`,
      { path, reason }
    );
  }
}

/**
 * 符号链接被拒绝
 */
export class EvidenceSymlinkRejectedError extends EvidenceError {
  constructor(path) {
    super(
      'EVIDENCE_SYMLINK_REJECTED',
      `Symlink rejected: ${path}`,
      { path }
    );
  }
}

/**
 * 文件缺失
 */
export class EvidenceFileMissingError extends EvidenceError {
  constructor(path) {
    super(
      'EVIDENCE_FILE_MISSING',
      `File missing: ${path}`,
      { path }
    );
  }
}

/**
 * 未声明的文件
 */
export class EvidenceFileUndeclaredError extends EvidenceError {
  constructor(path) {
    super(
      'EVIDENCE_FILE_UNDECLARED',
      `File not declared in manifest: ${path}`,
      { path }
    );
  }
}

/**
 * Hash 不匹配
 */
export class EvidenceHashMismatchError extends EvidenceError {
  constructor(path, expected, actual) {
    super(
      'EVIDENCE_HASH_MISMATCH',
      `Hash mismatch for ${path}: expected ${expected}, got ${actual}`,
      { path, expected, actual }
    );
  }
}

/**
 * 媒体类型不匹配
 */
export class EvidenceMediaTypeMismatchError extends EvidenceError {
  constructor(path, expected, role) {
    super(
      'EVIDENCE_MEDIA_TYPE_MISMATCH',
      `Media type mismatch for ${path}: expected ${expected} for role ${role}`,
      { path, expected, role }
    );
  }
}

/**
 * 超出限制
 */
export class EvidenceLimitExceededError extends EvidenceError {
  constructor(limitName, limit, actual) {
    super(
      'EVIDENCE_LIMIT_EXCEEDED',
      `Limit exceeded: ${limitName} (limit: ${limit}, actual: ${actual})`,
      { limitName, limit, actual }
    );
  }
}

/**
 * 入口点无效
 */
export class EvidenceEntrypointInvalidError extends EvidenceError {
  constructor(entrypoint, reason) {
    super(
      'EVIDENCE_ENTRYPOINT_INVALID',
      `Invalid entrypoint: ${entrypoint} (${reason})`,
      { entrypoint, reason }
    );
  }
}

/**
 * 信任策略拒绝
 */
export class EvidenceTrustPolicyRejectedError extends EvidenceError {
  constructor(path, policy) {
    super(
      'EVIDENCE_TRUST_POLICY_REJECTED',
      `Script rejected by trust policy: ${path} (policy: ${policy})`,
      { path, policy }
    );
  }
}

/**
 * Fixture 无效
 */
export class EvidenceFixtureInvalidError extends EvidenceError {
  constructor(path, reason) {
    super(
      'EVIDENCE_FIXTURE_INVALID',
      `Invalid fixture: ${path} (${reason})`,
      { path, reason }
    );
  }
}
