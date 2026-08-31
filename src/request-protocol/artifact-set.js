/**
 * Artifact Set
 *
 * 有界的工件集合。Runtime 产出工件后放入 ArtifactSet，Protocol 适配器
 * 只能通过它按 id / kind 读取，不能修改。
 *
 * 限制策略与 Core limits 一致：超出数量或字节上限时抛结构化错误，
 * 不静默丢弃。
 */

import { canonicalDigest } from './canonical-json.js';
import {
  DEFAULT_ARTIFACT_LIMITS,
  createRuntimeArtifact,
  isArtifactExpired,
  serializeArtifact,
} from './artifact.js';
import { ProtocolError, ProtocolErrorCode } from './errors.js';

export class ArtifactSet {
  #artifacts = new Map();
  #totalBytes = 0;
  #limits;

  constructor(options = {}) {
    const limits = { ...DEFAULT_ARTIFACT_LIMITS, ...(options.limits ?? {}) };
    for (const key of ['maxArtifacts', 'maxArtifactBytes', 'maxTotalBytes']) {
      const value = limits[key];
      if (!Number.isInteger(value) || value <= 0) {
        throw new ProtocolError(
          ProtocolErrorCode.ARTIFACT_INVALID,
          `limits.${key} must be a positive integer`,
          { context: { key, value } }
        );
      }
    }
    this.#limits = Object.freeze(limits);
  }

  get limits() {
    return this.#limits;
  }

  get size() {
    return this.#artifacts.size;
  }

  get totalBytes() {
    return this.#totalBytes;
  }

  /**
   * 添加工件。传入普通对象时会先经过 {@link createRuntimeArtifact} 校验。
   * @param {object} input
   * @returns {Readonly<object>} 已冻结的工件
   */
  add(input) {
    const artifact = Object.isFrozen(input) && typeof input.digest === 'string'
      ? input
      : createRuntimeArtifact(input);

    if (this.#artifacts.has(artifact.id)) {
      throw new ProtocolError(
        ProtocolErrorCode.ARTIFACT_DUPLICATE_ID,
        `Artifact "${artifact.id}" already exists`,
        {
          context: { id: artifact.id },
          suggestions: ['Use replace() to overwrite an existing artifact'],
        }
      );
    }

    if (artifact.byteLength > this.#limits.maxArtifactBytes) {
      throw new ProtocolError(
        ProtocolErrorCode.ARTIFACT_LIMIT_BYTES,
        `Artifact "${artifact.id}" exceeds maxArtifactBytes`,
        {
          context: { id: artifact.id },
          limit: this.#limits.maxArtifactBytes,
          actual: artifact.byteLength,
        }
      );
    }

    if (this.#artifacts.size + 1 > this.#limits.maxArtifacts) {
      throw new ProtocolError(
        ProtocolErrorCode.ARTIFACT_LIMIT_COUNT,
        'Artifact count exceeds maxArtifacts',
        {
          limit: this.#limits.maxArtifacts,
          actual: this.#artifacts.size + 1,
        }
      );
    }

    if (this.#totalBytes + artifact.byteLength > this.#limits.maxTotalBytes) {
      throw new ProtocolError(
        ProtocolErrorCode.ARTIFACT_LIMIT_BYTES,
        'Total artifact bytes exceeds maxTotalBytes',
        {
          limit: this.#limits.maxTotalBytes,
          actual: this.#totalBytes + artifact.byteLength,
        }
      );
    }

    this.#artifacts.set(artifact.id, artifact);
    this.#totalBytes += artifact.byteLength;
    return artifact;
  }

  /**
   * 替换已有工件（或新增）。
   * @param {object} input
   * @returns {Readonly<object>}
   */
  replace(input) {
    const artifact = Object.isFrozen(input) && typeof input.digest === 'string'
      ? input
      : createRuntimeArtifact(input);
    const previous = this.#artifacts.get(artifact.id);
    if (previous) {
      this.#artifacts.delete(artifact.id);
      this.#totalBytes -= previous.byteLength;
    }
    try {
      return this.add(artifact);
    } catch (error) {
      // 恢复原状态，保证失败不产生部分修改
      if (previous) {
        this.#artifacts.set(previous.id, previous);
        this.#totalBytes += previous.byteLength;
      }
      throw error;
    }
  }

  has(id) {
    return this.#artifacts.has(id);
  }

  /**
   * 读取工件，不存在时返回 undefined
   * @param {string} id
   */
  get(id) {
    return this.#artifacts.get(id);
  }

  /**
   * 读取工件，不存在时抛错
   * @param {string} id
   */
  require(id) {
    const artifact = this.#artifacts.get(id);
    if (!artifact) {
      throw new ProtocolError(
        ProtocolErrorCode.ARTIFACT_NOT_FOUND,
        `Artifact "${id}" not found`,
        {
          context: { id, available: [...this.#artifacts.keys()] },
        }
      );
    }
    return artifact;
  }

  /**
   * 按 kind 过滤
   * @param {string} kind
   * @returns {Readonly<object>[]}
   */
  byKind(kind) {
    const result = [];
    for (const artifact of this.#artifacts.values()) {
      if (artifact.kind === kind) result.push(artifact);
    }
    return result;
  }

  /** @returns {string[]} 按字典序排序的 id 列表 */
  ids() {
    return [...this.#artifacts.keys()].sort();
  }

  /** @returns {Readonly<object>[]} 按 id 排序的工件列表 */
  list() {
    return this.ids().map((id) => this.#artifacts.get(id));
  }

  /**
   * 移除已过期工件
   * @param {number} [now]
   * @returns {string[]} 被移除的 id
   */
  pruneExpired(now = Date.now()) {
    const removed = [];
    for (const [id, artifact] of this.#artifacts) {
      if (isArtifactExpired(artifact, now)) {
        this.#artifacts.delete(id);
        this.#totalBytes -= artifact.byteLength;
        removed.push(id);
      }
    }
    return removed.sort();
  }

  delete(id) {
    const artifact = this.#artifacts.get(id);
    if (!artifact) return false;
    this.#artifacts.delete(id);
    this.#totalBytes -= artifact.byteLength;
    return true;
  }

  clear() {
    this.#artifacts.clear();
    this.#totalBytes = 0;
  }

  /**
   * 整个集合的确定性摘要，用于 lock、trace 和缓存键
   * @returns {string} hex digest
   */
  digest() {
    return canonicalDigest(this.list().map((artifact) => artifact.digest));
  }

  /**
   * JSON 快照（可写入 Evidence / trace）
   */
  toJSON() {
    return {
      schemaVersion: this.list()[0]?.schemaVersion ?? null,
      count: this.#artifacts.size,
      totalBytes: this.#totalBytes,
      digest: this.digest(),
      artifacts: this.list().map(serializeArtifact),
    };
  }

  /**
   * 从快照恢复
   * @param {object} snapshot
   * @param {object} [options]
   * @returns {ArtifactSet}
   */
  static fromJSON(snapshot, options = {}) {
    const set = new ArtifactSet(options);
    const artifacts = Array.isArray(snapshot?.artifacts) ? snapshot.artifacts : [];
    for (const raw of artifacts) {
      set.add(createRuntimeArtifact(raw));
    }
    return set;
  }
}

/**
 * 便捷构造：从工件数组创建集合
 * @param {object[]} artifacts
 * @param {object} [options]
 * @returns {ArtifactSet}
 */
export function createArtifactSet(artifacts = [], options = {}) {
  const set = new ArtifactSet(options);
  for (const artifact of artifacts) set.add(artifact);
  return set;
}
