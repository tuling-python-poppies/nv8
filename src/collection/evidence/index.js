/**
 * Evidence Bundle Index
 * 
 * Evidence 相关模块的统一导出
 */

export {
  SCHEMA_VERSION,
  FILE_ROLES,
  MEDIA_TYPES,
  DEFAULT_LIMITS,
  TRUST_POLICIES,
  isPathSafe,
  isValidSha256,
  isValidMediaType,
  isValidUrl,
  isValidIso8601,
} from './schema.js';

export {
  SUPPORTED_SCHEMA_VERSIONS,
  parseSchemaVersion,
  compareSchemaVersions,
  resolveSchemaCompatibility,
  isSchemaVersionCompatible,
} from './schema-compatibility.js';

export {
  EvidenceError,
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
  EvidenceTrustPolicyRejectedError,
  EvidenceFixtureInvalidError,
  EvidenceSignatureRequiredError,
  EvidenceSignatureInvalidError,
} from './errors.js';

export {
  BUNDLE_SIGNATURE_ALGORITHM,
  BUNDLE_SIGNATURE_VERSION,
  signEvidenceManifest,
  verifyEvidenceManifest,
  manifestSigningBytes,
} from './bundle-signature.js';

export {
  loadEvidenceBundle,
} from './loader.js';

export {
  createEvidenceSource,
  createInMemoryEvidenceSource,
} from './evidence-source.js';

// ScriptInjector 是纯运行时机制，与 Bundle 格式无关，已迁入 Core。
// 保留转导出以兼容现有引用。
export {
  ScriptInjector,
  createScriptInjector,
  SCRIPT_LOAD_STRATEGY,
} from '../../engine/core/script-injector.js';

export {
  NetworkReplay,
  createNetworkReplay,
  MATCH_STRATEGY,
  REPLAY_RESULT,
} from './network-replay.js';
