/**
 * Evidence Bundle Schema
 * 
 * 定义 Evidence Bundle 的结构和验证规则
 */

/**
 * Evidence Bundle Schema Version
 */
export const SCHEMA_VERSION = '1.0';

/**
 * 支持的文件角色
 */
export const FILE_ROLES = {
  PAGE: 'page',
  SCRIPT: 'script',
  STYLESHEET: 'stylesheet',
  NETWORK_REPLAY: 'network-replay',
  NETWORK_BODY: 'network-body',
  RUNTIME_FIXTURE: 'runtime-fixture',
  TRACE: 'trace',
};

/**
 * 支持的媒体类型
 */
export const MEDIA_TYPES = {
  HTML: 'text/html',
  JAVASCRIPT: 'text/javascript',
  JSON: 'application/json',
  CSS: 'text/css',
  BINARY: 'application/octet-stream',
  JSONL: 'application/x-ndjson',
};

/**
 * 默认限制
 */
export const DEFAULT_LIMITS = {
  maxFiles: 10_000,
  maxFileBytes: 50 * 1024 * 1024, // 50MB
  maxTotalBytes: 512 * 1024 * 1024, // 512MB
  maxManifestBytes: 2 * 1024 * 1024, // 2MB
  maxJsonDepth: 100,
  maxArrayLength: 100_000,
  maxStringLength: 10 * 1024 * 1024, // 10MB
};

/**
 * 受信任脚本策略
 */
export const TRUST_POLICIES = {
  REGISTERED_ONLY: 'registered-only', // 只允许 manifest 明确声明的脚本
  ALLOWLIST: 'allowlist', // 允许 allowlist 中的脚本
  DENY_ALL: 'deny-all', // 拒绝所有脚本执行
};

/**
 * Manifest Schema
 */
export const MANIFEST_SCHEMA = {
  schemaVersion: { type: 'string', required: true },
  bundleId: { type: 'string', required: true },
  target: {
    type: 'object',
    required: true,
    properties: {
      url: { type: 'string', required: true },
      origin: { type: 'string', required: true },
      capturedAt: { type: 'string', required: true }, // ISO 8601
    },
  },
  profile: {
    type: 'object',
    required: false,
    properties: {
      id: { type: 'string', required: false },
      versionRange: { type: 'string', required: false },
      requiredCapabilities: { type: 'array', required: false },
      pluginPins: { type: 'object', required: false },
    },
  },
  files: {
    type: 'array',
    required: true,
    items: {
      path: { type: 'string', required: true },
      role: { type: 'string', required: true, enum: Object.values(FILE_ROLES) },
      mediaType: { type: 'string', required: true },
      bytes: { type: 'number', required: true },
      sha256: { type: 'string', required: true, pattern: /^[a-f0-9]{64}$/ },
    },
  },
  entrypoints: { type: 'array', required: false },
  replay: {
    type: 'object',
    required: false,
    properties: {
      fixture: { type: 'string', required: true },
      matching: { type: 'string', required: true },
    },
  },
  redaction: {
    type: 'object',
    required: false,
    properties: {
      secretsRemoved: { type: 'boolean', required: false },
      tracePolicy: { type: 'string', required: false },
    },
  },
};

/**
 * 验证路径安全性
 */
export function isPathSafe(path) {
  if (!path || typeof path !== 'string') {
    return false;
  }
  
  // 拒绝绝对路径
  if (path.startsWith('/') || path.startsWith('\\')) {
    return false;
  }
  
  // 拒绝 ..
  if (path.includes('..')) {
    return false;
  }
  
  // 拒绝反斜杠（统一使用正斜杠）
  if (path.includes('\\')) {
    return false;
  }
  
  // 拒绝 NUL 字符
  if (path.includes('\0')) {
    return false;
  }
  
  // 拒绝空路径
  if (path.trim().length === 0) {
    return false;
  }
  
  return true;
}

/**
 * 验证 SHA-256 哈希
 */
export function isValidSha256(hash) {
  return typeof hash === 'string' && /^[a-f0-9]{64}$/.test(hash);
}

/**
 * 验证媒体类型
 */
export function isValidMediaType(mediaType, role) {
  if (!Object.values(MEDIA_TYPES).includes(mediaType)) {
    return false;
  }
  
  // 角色和媒体类型的合理组合
  const validCombinations = {
    [FILE_ROLES.PAGE]: [MEDIA_TYPES.HTML],
    [FILE_ROLES.SCRIPT]: [MEDIA_TYPES.JAVASCRIPT],
    [FILE_ROLES.STYLESHEET]: [MEDIA_TYPES.CSS],
    [FILE_ROLES.NETWORK_REPLAY]: [MEDIA_TYPES.JSON],
    [FILE_ROLES.NETWORK_BODY]: [MEDIA_TYPES.BINARY, MEDIA_TYPES.JSON, MEDIA_TYPES.HTML],
    [FILE_ROLES.RUNTIME_FIXTURE]: [MEDIA_TYPES.JSON],
    [FILE_ROLES.TRACE]: [MEDIA_TYPES.JSONL, MEDIA_TYPES.JSON],
  };
  
  const allowedTypes = validCombinations[role];
  return allowedTypes ? allowedTypes.includes(mediaType) : true;
}

/**
 * 验证 URL
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证 ISO 8601 日期时间
 */
export function isValidIso8601(dateString) {
  if (typeof dateString !== 'string') {
    return false;
  }
  
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString() === dateString;
}
