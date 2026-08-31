/**
 * Protocol Adapter
 *
 * 协议适配器把运行时工件翻译成请求变换。它是站点专属逻辑的载体，
 * 但被限制在一个非常窄的接口内。
 *
 * 契约：
 * - `consumes`: 声明需要的工件（id 或 kind），缺失时返回结构化诊断。
 * - `artifactSchema`: 声明可消费的工件 schema 版本范围。
 * - `plan(context)`: 纯函数，返回 transform 数组。禁止 IO。
 * - 适配器拿不到 socket、fs、credential 或 Collector 句柄。
 */

import { ProtocolDefinitionError, ProtocolError, ProtocolErrorCode } from './errors.js';
import { ARTIFACT_SCHEMA_VERSION, ArtifactKind, isArtifactSchemaCompatible } from './artifact.js';

const ID_PATTERN = /^[a-z][a-z0-9-]{0,63}$/;
const ARTIFACT_KINDS = new Set(Object.values(ArtifactKind));

/**
 * 定义一个协议适配器。
 *
 * @param {object} definition
 * @param {string} definition.id 小写 kebab-case
 * @param {string} definition.version SemVer 字符串
 * @param {string} [definition.description]
 * @param {string} [definition.artifactSchema] 支持的工件 schema 版本，默认当前版本
 * @param {Array<{id?:string,kind?:string,optional?:boolean}>} [definition.consumes]
 * @param {(context: object) => object[]} definition.plan
 * @returns {Readonly<object>}
 */
export function defineProtocolAdapter(definition) {
  if (definition === null || typeof definition !== 'object') {
    throw new ProtocolDefinitionError('definition must be an object');
  }

  const {
    id,
    version,
    description = '',
    artifactSchema = ARTIFACT_SCHEMA_VERSION,
    consumes = [],
    plan,
  } = definition;

  if (typeof id !== 'string' || !ID_PATTERN.test(id)) {
    throw new ProtocolDefinitionError(
      'id must be lowercase kebab-case matching /^[a-z][a-z0-9-]{0,63}$/',
      { context: { id } }
    );
  }

  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+(?:-[\w.]+)?$/.test(version)) {
    throw new ProtocolDefinitionError(
      'version must be a SemVer string like "1.0.0"',
      { context: { id, version } }
    );
  }

  if (typeof description !== 'string') {
    throw new ProtocolDefinitionError('description must be a string', { context: { id } });
  }

  if (typeof plan !== 'function') {
    throw new ProtocolDefinitionError('plan must be a function', { context: { id } });
  }

  if (!Array.isArray(consumes)) {
    throw new ProtocolDefinitionError('consumes must be an array', { context: { id } });
  }

  const normalizedConsumes = consumes.map((entry, index) => {
    if (entry === null || typeof entry !== 'object') {
      throw new ProtocolDefinitionError(
        `consumes[${index}] must be an object`,
        { context: { id } }
      );
    }
    const hasId = typeof entry.id === 'string' && entry.id.length > 0;
    const hasKind = typeof entry.kind === 'string' && entry.kind.length > 0;
    if (!hasId && !hasKind) {
      throw new ProtocolDefinitionError(
        `consumes[${index}] must declare "id" or "kind"`,
        { context: { id } }
      );
    }
    if (hasKind && !ARTIFACT_KINDS.has(entry.kind)) {
      throw new ProtocolDefinitionError(
        `consumes[${index}].kind "${entry.kind}" is not a known artifact kind`,
        { context: { id, kind: entry.kind } }
      );
    }
    return Object.freeze({
      id: hasId ? entry.id : null,
      kind: hasKind ? entry.kind : null,
      optional: entry.optional === true,
    });
  });

  return Object.freeze({
    id,
    version,
    description,
    artifactSchema,
    consumes: Object.freeze(normalizedConsumes),
    plan,
  });
}

/**
 * 校验工件集合是否满足适配器的 `consumes` 声明。
 *
 * @param {object} adapter
 * @param {import('./artifact-set.js').ArtifactSet} artifacts
 * @returns {{ satisfied: boolean, missing: object[], incompatible: object[] }}
 */
export function checkAdapterRequirements(adapter, artifacts) {
  const missing = [];
  const incompatible = [];

  for (const requirement of adapter.consumes) {
    let matched = [];

    if (requirement.id !== null) {
      const artifact = artifacts.get(requirement.id);
      if (artifact) matched = [artifact];
    } else {
      matched = artifacts.byKind(requirement.kind);
    }

    if (matched.length === 0) {
      if (!requirement.optional) missing.push(requirement);
      continue;
    }

    for (const artifact of matched) {
      if (!isArtifactSchemaCompatible(artifact.schemaVersion, adapter.artifactSchema)) {
        incompatible.push({
          artifactId: artifact.id,
          artifactSchema: artifact.schemaVersion,
          adapterSchema: adapter.artifactSchema,
        });
      }
    }
  }

  return {
    satisfied: missing.length === 0 && incompatible.length === 0,
    missing,
    incompatible,
  };
}

/**
 * 断言适配器需求已满足，否则抛结构化错误
 * @param {object} adapter
 * @param {import('./artifact-set.js').ArtifactSet} artifacts
 */
export function assertAdapterRequirements(adapter, artifacts) {
  const result = checkAdapterRequirements(adapter, artifacts);
  if (result.satisfied) return;

  if (result.incompatible.length > 0) {
    throw new ProtocolError(
      ProtocolErrorCode.PROTOCOL_SCHEMA_INCOMPATIBLE,
      `Adapter "${adapter.id}" cannot consume artifacts with incompatible schema`,
      {
        context: { adapter: adapter.id, incompatible: result.incompatible },
        suggestions: ['Regenerate artifacts, or update the adapter artifactSchema'],
      }
    );
  }

  const describe = (requirement) =>
    requirement.id !== null ? `id="${requirement.id}"` : `kind="${requirement.kind}"`;

  throw new ProtocolError(
    ProtocolErrorCode.ARTIFACT_NOT_FOUND,
    `Adapter "${adapter.id}" requires missing artifacts: ${result.missing.map(describe).join(', ')}`,
    {
      context: {
        adapter: adapter.id,
        missing: result.missing.map((requirement) => ({
          id: requirement.id,
          kind: requirement.kind,
        })),
        available: artifacts.ids(),
      },
      suggestions: [
        'Run the runtime stage that produces these artifacts before applying the protocol',
      ],
    }
  );
}
