/**
 * Runtime Artifact
 *
 * 运行时工件是 NV8 Runtime 与 Protocol 层之间唯一的数据契约。
 *
 * 边界规则：
 * - 工件是纯数据（canonical JSON 可表示），不含函数、句柄或 Realm 引用。
 * - 工件由 Runtime 生成（目标脚本求值结果），Protocol 只读消费。
 * - 工件带 `schemaVersion`；Protocol 适配器声明可消费范围。
 * - 工件不包含真实网络能力、凭据来源或代理配置。
 */

import { canonicalDigest, canonicalByteLength, canonicalJson } from './canonical-json.js';
import { ArtifactInvalidError, ArtifactExpiredError, ProtocolError, ProtocolErrorCode } from './errors.js';

/** 当前工件 schema 版本（major.minor） */
export const ARTIFACT_SCHEMA_VERSION = '1.0';

/**
 * 工件类型。
 * 每种类型对应一类协议输入，决定它可以被哪些 transform 消费。
 */
export const ArtifactKind = {
  /** 签名值，如 X-Sign、_signature */
  SIGNATURE: 'signature',
  /** 令牌，如 Bearer token、csrf token */
  TOKEN: 'token',
  /** 风控挑战应答，如 Akamai _abck、Kasada x-kpsdk-ct */
  CHALLENGE: 'challenge',
  /** Cookie 值 */
  COOKIE: 'cookie',
  /** 单个 header 值 */
  HEADER: 'header',
  /** query 参数 */
  QUERY: 'query',
  /** 请求体片段或完整请求体 */
  BODY: 'body',
  /** 设备指纹 / 环境快照 */
  FINGERPRINT: 'fingerprint',
  /** 不参与请求变换的诊断信息 */
  METADATA: 'metadata',
};

const ARTIFACT_KINDS = new Set(Object.values(ArtifactKind));

const ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/;

export const DEFAULT_ARTIFACT_LIMITS = Object.freeze({
  maxArtifacts: 256,
  maxArtifactBytes: 256 * 1024,
  maxTotalBytes: 2 * 1024 * 1024,
});

function parseSchemaVersion(version, context) {
  if (typeof version !== 'string') {
    throw new ArtifactInvalidError('schemaVersion must be a string', { context });
  }
  const match = /^(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new ArtifactInvalidError(
      `schemaVersion must be "major.minor", received "${version}"`,
      { context }
    );
  }
  return { major: Number(match[1]), minor: Number(match[2]) };
}

/**
 * 解析并校验 schemaVersion
 * @param {string} version
 * @returns {{ major: number, minor: number }}
 */
export function parseArtifactSchemaVersion(version) {
  return parseSchemaVersion(version, { schemaVersion: version });
}

/**
 * 判断工件 schema 是否可被消费者接受。
 * major 必须相等；工件 minor 不得高于消费者支持的 minor。
 *
 * @param {string} artifactVersion
 * @param {string} consumerVersion
 * @returns {boolean}
 */
export function isArtifactSchemaCompatible(artifactVersion, consumerVersion) {
  const artifact = parseArtifactSchemaVersion(artifactVersion);
  const consumer = parseArtifactSchemaVersion(consumerVersion);
  if (artifact.major !== consumer.major) return false;
  return artifact.minor <= consumer.minor;
}

/**
 * 创建一个只读运行时工件。
 *
 * @param {object} input
 * @param {string} input.id 稳定标识，用于 transform 引用
 * @param {string} input.kind {@link ArtifactKind}
 * @param {unknown} input.value canonical JSON 可表示的值
 * @param {string} [input.schemaVersion]
 * @param {string} [input.producer] 生成者（插件 ID / adapter ID）
 * @param {number} [input.createdAt] epoch ms
 * @param {number} [input.expiresAt] epoch ms，过期后禁止应用
 * @param {Record<string, unknown>} [input.metadata] 附加诊断信息
 * @returns {Readonly<object>}
 */
export function createRuntimeArtifact(input) {
  if (input === null || typeof input !== 'object') {
    throw new ArtifactInvalidError('artifact must be an object');
  }

  const {
    id,
    kind,
    value,
    schemaVersion = ARTIFACT_SCHEMA_VERSION,
    producer = null,
    createdAt = Date.now(),
    expiresAt = null,
    metadata = null,
  } = input;

  if (typeof id !== 'string' || !ID_PATTERN.test(id)) {
    throw new ArtifactInvalidError(
      'id must match /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/',
      { context: { id } }
    );
  }

  if (!ARTIFACT_KINDS.has(kind)) {
    throw new ProtocolError(
      ProtocolErrorCode.ARTIFACT_UNKNOWN_KIND,
      `Unknown artifact kind "${kind}"`,
      {
        context: { id, kind },
        suggestions: [`Use one of: ${[...ARTIFACT_KINDS].join(', ')}`],
      }
    );
  }

  parseSchemaVersion(schemaVersion, { id });

  if (value === undefined) {
    throw new ArtifactInvalidError('value must not be undefined', { context: { id } });
  }

  if (producer !== null && typeof producer !== 'string') {
    throw new ArtifactInvalidError('producer must be a string or null', { context: { id } });
  }

  if (!Number.isFinite(createdAt) || createdAt < 0) {
    throw new ArtifactInvalidError('createdAt must be a non-negative finite number', {
      context: { id, createdAt },
    });
  }

  if (expiresAt !== null) {
    if (!Number.isFinite(expiresAt) || expiresAt < 0) {
      throw new ArtifactInvalidError('expiresAt must be a non-negative finite number or null', {
        context: { id, expiresAt },
      });
    }
    if (expiresAt < createdAt) {
      throw new ArtifactInvalidError('expiresAt must not precede createdAt', {
        context: { id, createdAt, expiresAt },
      });
    }
  }

  if (metadata !== null && (typeof metadata !== 'object' || Array.isArray(metadata))) {
    throw new ArtifactInvalidError('metadata must be a plain object or null', {
      context: { id },
    });
  }

  const record = {
    schemaVersion,
    id,
    kind,
    value,
    producer,
    createdAt,
    expiresAt,
    metadata,
  };

  // canonical JSON 校验：不可确定性表示的值在此处失败，而不是在摘要阶段
  let digest;
  let byteLength;
  try {
    digest = canonicalDigest(record);
    byteLength = canonicalByteLength(record);
  } catch (error) {
    throw new ArtifactInvalidError(
      `value is not canonical-JSON representable: ${error.message}`,
      { context: { id, kind } }
    );
  }

  return Object.freeze({
    ...record,
    digest,
    byteLength,
  });
}

/**
 * 判断工件是否已过期
 * @param {object} artifact
 * @param {number} [now]
 * @returns {boolean}
 */
export function isArtifactExpired(artifact, now = Date.now()) {
  return artifact.expiresAt !== null && artifact.expiresAt <= now;
}

/**
 * 断言工件未过期，否则抛出 {@link ArtifactExpiredError}
 * @param {object} artifact
 * @param {number} [now]
 */
export function assertArtifactFresh(artifact, now = Date.now()) {
  if (isArtifactExpired(artifact, now)) {
    throw new ArtifactExpiredError(artifact.id, artifact.expiresAt, now);
  }
}

/**
 * 序列化工件为 canonical JSON（用于持久化和跨进程传递）
 * @param {object} artifact
 * @returns {string}
 */
export function serializeArtifact(artifact) {
  return {
    schemaVersion: artifact.schemaVersion,
    id: artifact.id,
    kind: artifact.kind,
    value: artifact.value,
    producer: artifact.producer,
    createdAt: artifact.createdAt,
    expiresAt: artifact.expiresAt,
    metadata: artifact.metadata,
  };
}

/**
 * 序列化为 canonical JSON 字符串（用于写盘、摘要或跨进程传输）
 * @param {object} artifact
 * @returns {string}
 */
export function serializeArtifactToJson(artifact) {
  return canonicalJson(serializeArtifact(artifact));
}

/**
 * 从 JSON 反序列化工件，并重新校验
 * @param {string|object} input
 * @returns {Readonly<object>}
 */
export function deserializeArtifact(input) {
  const raw = typeof input === 'string' ? JSON.parse(input) : input;
  return createRuntimeArtifact(raw);
}
