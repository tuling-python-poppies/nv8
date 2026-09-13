/**
 * Protocol Registry
 *
 * 注册和编排协议适配器。负责：
 * - 适配器唯一性和确定性顺序
 * - 工件需求校验
 * - transform 收集、冲突检测和应用
 * - 生成可审计的 ProtocolResult（含 transform 溯源和 plan diff）
 *
 * Registry 不持有网络能力。它的输出是 RequestPlan，交给 Collector 执行。
 */

import { canonicalDigest } from './canonical-json.js';
import { assertAdapterRequirements } from './adapter.js';
import { assertArtifactFresh } from './artifact.js';
import { ArtifactSet } from './artifact-set.js';
import { createRequestPlan, requestPlanToJSON } from './request-plan.js';
import { applyTransforms, diffRequestPlans, findTransformConflicts, transformsDigest } from './transforms.js';
import { ProtocolError, ProtocolErrorCode } from './errors.js';
import { PROTOCOL_SCHEMA_VERSION, assertProtocolSchemaCompatible } from './schema-version.js';

export class ProtocolRegistry {
  #adapters = new Map();
  #order = [];

  /**
   * 注册适配器
   * @param {object} adapter 由 defineProtocolAdapter 创建
   * @returns {this}
   */
  register(adapter) {
    if (adapter === null || typeof adapter !== 'object' || typeof adapter.plan !== 'function') {
      throw new ProtocolError(
        ProtocolErrorCode.PROTOCOL_INVALID_DEFINITION,
        'adapter must be created via defineProtocolAdapter()'
      );
    }
    if (this.#adapters.has(adapter.id)) {
      throw new ProtocolError(
        ProtocolErrorCode.PROTOCOL_DUPLICATE_ID,
        `Protocol adapter "${adapter.id}" is already registered`,
        { context: { id: adapter.id } }
      );
    }
    this.#adapters.set(adapter.id, adapter);
    this.#order.push(adapter.id);
    return this;
  }

  has(id) {
    return this.#adapters.has(id);
  }

  get(id) {
    return this.#adapters.get(id);
  }

  require(id) {
    const adapter = this.#adapters.get(id);
    if (!adapter) {
      throw new ProtocolError(
        ProtocolErrorCode.PROTOCOL_NOT_FOUND,
        `Protocol adapter "${id}" not found`,
        { context: { id, registered: [...this.#adapters.keys()] } }
      );
    }
    return adapter;
  }

  /** 注册顺序（即默认应用顺序） */
  ids() {
    return [...this.#order];
  }

  get size() {
    return this.#adapters.size;
  }

  /**
   * 应用协议链，生成最终 RequestPlan。
   *
   * @param {object} options
   * @param {object} options.request 基础请求（createRequestPlan 的输入）
   * @param {ArtifactSet|object[]} options.artifacts 运行时工件
   * @param {string[]} [options.adapters] 指定顺序，默认注册顺序
   * @param {boolean} [options.allowConflicts=false]
   * @param {number} [options.now] 用于过期判定
   * @param {object} [options.limits]
   * @returns {Readonly<object>} ProtocolResult
   */
  apply(options = {}) {
    const now = options.now ?? Date.now();
    const artifacts = options.artifacts instanceof ArtifactSet
      ? options.artifacts
      : ArtifactSet.fromJSON({ artifacts: options.artifacts ?? [] });

    const basePlan = Object.isFrozen(options.request) && typeof options.request.digest === 'string'
      ? options.request
      : createRequestPlan(options.request ?? {});

    const selected = options.adapters ?? this.#order;
    const chain = selected.map((id) => this.require(id));

    const collected = [];
    const attribution = [];

    for (const adapter of chain) {
      assertAdapterRequirements(adapter, artifacts);

      // 过期工件不允许参与变换：宁可失败也不发出错误签名
      for (const requirement of adapter.consumes) {
        const matched = requirement.id !== null
          ? [artifacts.get(requirement.id)].filter(Boolean)
          : artifacts.byKind(requirement.kind);
        for (const artifact of matched) assertArtifactFresh(artifact, now);
      }

      let produced;
      try {
        produced = adapter.plan({
          request: basePlan,
          artifacts,
          now,
        });
      } catch (error) {
        if (error instanceof ProtocolError) throw error;
        throw new ProtocolError(
          ProtocolErrorCode.PROTOCOL_APPLY_FAILED,
          `Adapter "${adapter.id}" failed to plan: ${error.message}`,
          { context: { adapter: adapter.id }, cause: error }
        );
      }

      if (!Array.isArray(produced)) {
        throw new ProtocolError(
          ProtocolErrorCode.PROTOCOL_APPLY_FAILED,
          `Adapter "${adapter.id}" must return an array of transforms`,
          { context: { adapter: adapter.id } }
        );
      }

      // 强制 transform 溯源：未标注 source 的补上适配器 ID
      for (const transform of produced) {
        const attributed = transform.source === null || transform.source === undefined
          ? Object.freeze({ ...transform, source: adapter.id })
          : transform;
        collected.push(attributed);
        attribution.push({ adapter: adapter.id, kind: attributed.kind });
      }
    }

    const conflicts = findTransformConflicts(collected);

    const finalPlan = applyTransforms(basePlan, collected, {
      allowConflicts: options.allowConflicts === true,
      limits: options.limits,
      planLimits: options.planLimits,
    });

    return Object.freeze({
      schemaVersion: PROTOCOL_SCHEMA_VERSION,
      plan: finalPlan,
      basePlan,
      transforms: Object.freeze(collected),
      attribution: Object.freeze(attribution),
      conflicts: Object.freeze(conflicts.map((entry) => Object.freeze({
        key: entry.key,
        sources: Object.freeze(entry.transforms.map((t) => t.source)),
      }))),
      diff: Object.freeze(diffRequestPlans(basePlan, finalPlan)),
      adapters: Object.freeze(chain.map((adapter) => Object.freeze({
        id: adapter.id,
        version: adapter.version,
      }))),
      artifactsDigest: artifacts.digest(),
      transformsDigest: transformsDigest(collected),
      digest: canonicalDigest({
        base: basePlan.digest,
        final: finalPlan.digest,
        transforms: transformsDigest(collected),
        artifacts: artifacts.digest(),
      }),
    });
  }

  /**
   * 生成可序列化的协议 lock，用于回归与审计
   * @returns {object}
   */
  lock() {
    const adapters = this.#order.map((id) => {
      const adapter = this.#adapters.get(id);
      return {
        id: adapter.id,
        version: adapter.version,
        artifactSchema: adapter.artifactSchema,
        consumes: adapter.consumes.map((requirement) => ({
          id: requirement.id,
          kind: requirement.kind,
          optional: requirement.optional,
        })),
      };
    });
    return {
      schemaVersion: PROTOCOL_SCHEMA_VERSION,
      adapters,
      digest: canonicalDigest(adapters),
    };
  }
}

/**
 * 便捷构造
 * @param {object[]} [adapters]
 * @returns {ProtocolRegistry}
 */
export function createProtocolRegistry(adapters = []) {
  const registry = new ProtocolRegistry();
  for (const adapter of adapters) registry.register(adapter);
  return registry;
}

/**
 * ProtocolResult 的 JSON 快照
 * @param {object} result
 */
export function protocolResultToJSON(result) {
  assertProtocolSchemaCompatible(result.schemaVersion ?? PROTOCOL_SCHEMA_VERSION);
  return {
    schemaVersion: result.schemaVersion ?? PROTOCOL_SCHEMA_VERSION,
    plan: requestPlanToJSON(result.plan),
    basePlan: requestPlanToJSON(result.basePlan),
    transforms: result.transforms.map((entry) => ({ ...entry })),
    attribution: result.attribution.map((entry) => ({ ...entry })),
    conflicts: result.conflicts.map((entry) => ({ key: entry.key, sources: [...entry.sources] })),
    diff: result.diff.map((entry) => ({ ...entry })),
    adapters: result.adapters.map((entry) => ({ ...entry })),
    artifactsDigest: result.artifactsDigest,
    transformsDigest: result.transformsDigest,
    digest: result.digest,
  };
}
