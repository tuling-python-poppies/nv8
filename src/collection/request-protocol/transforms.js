/**
 * Request Transforms
 *
 * Protocol 适配器不直接修改 RequestPlan，而是声明一组窄范围 transform。
 * 这样做的原因：
 * - transform 可以被审计、序列化和 diff，便于诊断和回归。
 * - 冲突可以在应用前检测，而不是让最后一个写入者静默胜出。
 * - transform 无法表达"发起请求"，从结构上保证 Protocol 不越界。
 */

import { canonicalDigest } from './canonical-json.js';
import { BodyEncoding, createRequestPlan, requestPlanToJSON } from './request-plan.js';
import { ProtocolErrorCode, TransformError } from './errors.js';

export const TransformKind = {
  SET_HEADER: 'set-header',
  APPEND_HEADER: 'append-header',
  REMOVE_HEADER: 'remove-header',
  SET_COOKIE: 'set-cookie',
  REMOVE_COOKIE: 'remove-cookie',
  SET_QUERY: 'set-query',
  REMOVE_QUERY: 'remove-query',
  SET_BODY: 'set-body',
  MERGE_JSON_BODY: 'merge-json-body',
  SET_FORM_FIELD: 'set-form-field',
  SET_METHOD: 'set-method',
  SET_PATH: 'set-path',
};

const TRANSFORM_KINDS = new Set(Object.values(TransformKind));

export const DEFAULT_TRANSFORM_LIMITS = Object.freeze({
  maxTransforms: 256,
});

function invalid(reason, context) {
  return new TransformError(
    ProtocolErrorCode.TRANSFORM_INVALID,
    `Invalid transform: ${reason}`,
    { context }
  );
}

function requireString(value, label, context) {
  if (typeof value !== 'string' || value.length === 0) {
    throw invalid(`${label} must be a non-empty string`, context);
  }
  return value;
}

/**
 * 创建一个 transform。
 *
 * @param {string} kind {@link TransformKind}
 * @param {object} spec
 * @param {object} [options]
 * @param {string} [options.source] 产生该 transform 的 adapter ID
 * @param {string} [options.artifactId] 关联工件 ID（用于溯源）
 * @returns {Readonly<object>}
 */
export function createTransform(kind, spec = {}, options = {}) {
  if (!TRANSFORM_KINDS.has(kind)) {
    throw invalid(
      `unknown kind "${kind}"; expected one of ${[...TRANSFORM_KINDS].join(', ')}`,
      { kind }
    );
  }

  const source = options.source ?? null;
  const artifactId = options.artifactId ?? null;
  if (source !== null && typeof source !== 'string') {
    throw invalid('source must be a string or null', { kind });
  }
  if (artifactId !== null && typeof artifactId !== 'string') {
    throw invalid('artifactId must be a string or null', { kind });
  }

  const record = { kind, source, artifactId };

  switch (kind) {
    case TransformKind.SET_HEADER:
    case TransformKind.APPEND_HEADER:
      record.name = requireString(spec.name, 'name', { kind }).toLowerCase();
      record.value = requireString(spec.value, 'value', { kind, name: record.name });
      break;

    case TransformKind.REMOVE_HEADER:
      record.name = requireString(spec.name, 'name', { kind }).toLowerCase();
      break;

    case TransformKind.SET_COOKIE:
      record.name = requireString(spec.name, 'name', { kind });
      record.value = requireString(spec.value, 'value', { kind, name: record.name });
      break;

    case TransformKind.REMOVE_COOKIE:
      record.name = requireString(spec.name, 'name', { kind });
      break;

    case TransformKind.SET_QUERY:
      record.name = requireString(spec.name, 'name', { kind });
      record.value = requireString(spec.value, 'value', { kind, name: record.name });
      break;

    case TransformKind.REMOVE_QUERY:
      record.name = requireString(spec.name, 'name', { kind });
      break;

    case TransformKind.SET_BODY: {
      const encoding = spec.encoding ?? BodyEncoding.TEXT;
      if (!Object.values(BodyEncoding).includes(encoding)) {
        throw invalid(`unknown body encoding "${encoding}"`, { kind });
      }
      record.encoding = encoding;
      record.value = spec.value ?? null;
      break;
    }

    case TransformKind.MERGE_JSON_BODY:
      if (spec.patch === null || typeof spec.patch !== 'object' || Array.isArray(spec.patch)) {
        throw invalid('patch must be a plain object', { kind });
      }
      // 克隆而不是按引用存：否则创建后外部修改同一 patch 对象
      // 会静默改变已冻结 transform 的内容，破坏不可变与 digest 确定性。
      record.patch = structuredClone(spec.patch);
      break;

    case TransformKind.SET_FORM_FIELD:
      record.name = requireString(spec.name, 'name', { kind });
      record.value = requireString(spec.value, 'value', { kind, name: record.name });
      break;

    case TransformKind.SET_METHOD:
      record.method = requireString(spec.method, 'method', { kind }).toUpperCase();
      break;

    case TransformKind.SET_PATH:
      record.path = requireString(spec.path, 'path', { kind });
      if (!record.path.startsWith('/')) {
        throw invalid('path must start with "/"', { kind, path: record.path });
      }
      break;

    default:
      throw invalid(`unhandled kind "${kind}"`, { kind });
  }

  return Object.freeze(record);
}

/** transform 的冲突键：同一目标被两次"设置"即为冲突 */
function conflictKey(transform) {
  switch (transform.kind) {
    case TransformKind.SET_HEADER:
    case TransformKind.REMOVE_HEADER:
      return `header:${transform.name}`;
    case TransformKind.SET_COOKIE:
    case TransformKind.REMOVE_COOKIE:
      return `cookie:${transform.name}`;
    case TransformKind.SET_QUERY:
    case TransformKind.REMOVE_QUERY:
      return `query:${transform.name}`;
    case TransformKind.SET_BODY:
      return 'body';
    case TransformKind.SET_FORM_FIELD:
      return `form:${transform.name}`;
    case TransformKind.SET_METHOD:
      return 'method';
    case TransformKind.SET_PATH:
      return 'path';
    // APPEND_HEADER 和 MERGE_JSON_BODY 是可累积的，不参与冲突检测
    default:
      return null;
  }
}

/**
 * 检测 transform 列表中的冲突。
 *
 * @param {object[]} transforms
 * @returns {{ key: string, transforms: object[] }[]}
 */
export function findTransformConflicts(transforms) {
  const groups = new Map();
  for (const transform of transforms) {
    const key = conflictKey(transform);
    if (key === null) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(transform);
  }

  const conflicts = [];
  for (const [key, group] of groups) {
    if (group.length < 2) continue;
    // 同一 source 重复设置同一目标视为其自身逻辑，不算跨适配器冲突
    const sources = new Set(group.map((entry) => entry.source));
    if (sources.size < 2) continue;
    conflicts.push({ key, transforms: group });
  }
  return conflicts.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

function decodeJsonBody(body) {
  if (body.encoding === BodyEncoding.JSON) return body.value;
  if (body.encoding === BodyEncoding.NONE) return {};
  if (body.encoding === BodyEncoding.TEXT) {
    try {
      return JSON.parse(body.value);
    } catch {
      throw new TransformError(
        ProtocolErrorCode.TRANSFORM_INVALID,
        'merge-json-body requires a JSON-parseable body',
        { context: { encoding: body.encoding } }
      );
    }
  }
  throw new TransformError(
    ProtocolErrorCode.TRANSFORM_INVALID,
    `merge-json-body cannot operate on body encoding "${body.encoding}"`,
    { context: { encoding: body.encoding } }
  );
}

/**
 * 把 transform 列表应用到 RequestPlan，返回新的只读 plan。
 *
 * 应用顺序即数组顺序；冲突默认拒绝。
 *
 * @param {object} plan
 * @param {object[]} transforms
 * @param {object} [options]
 * @param {boolean} [options.allowConflicts=false]
 * @param {object} [options.limits]
 * @returns {Readonly<object>}
 */
export function applyTransforms(plan, transforms, options = {}) {
  if (!Array.isArray(transforms)) {
    throw invalid('transforms must be an array', {});
  }

  const limits = { ...DEFAULT_TRANSFORM_LIMITS, ...(options.limits ?? {}) };
  if (transforms.length > limits.maxTransforms) {
    throw new TransformError(
      ProtocolErrorCode.TRANSFORM_LIMIT_COUNT,
      'transform count exceeds maxTransforms',
      { limit: limits.maxTransforms, actual: transforms.length }
    );
  }

  if (options.allowConflicts !== true) {
    const conflicts = findTransformConflicts(transforms);
    if (conflicts.length > 0) {
      throw new TransformError(
        ProtocolErrorCode.TRANSFORM_CONFLICT,
        `Conflicting transforms for: ${conflicts.map((entry) => entry.key).join(', ')}`,
        {
          context: {
            conflicts: conflicts.map((entry) => ({
              key: entry.key,
              sources: entry.transforms.map((t) => t.source),
            })),
          },
          suggestions: [
            'Remove the duplicate transform, or pass { allowConflicts: true } to accept last-write-wins',
          ],
        }
      );
    }
  }

  const url = new URL(plan.url);
  const headers = new Map(plan.headers.map((entry) => [entry.name, [...entry.values]]));
  const cookies = new Map(plan.cookies.map((entry) => [entry.name, entry.value]));
  let method = plan.method;
  let body = { ...plan.body };
  let formFields = body.encoding === BodyEncoding.FORM
    ? new Map(body.value.map(([k, v]) => [k, v]))
    : null;

  for (const transform of transforms) {
    switch (transform.kind) {
      case TransformKind.SET_HEADER:
        headers.set(transform.name, [transform.value]);
        break;

      case TransformKind.APPEND_HEADER:
        if (headers.has(transform.name)) {
          headers.get(transform.name).push(transform.value);
        } else {
          headers.set(transform.name, [transform.value]);
        }
        break;

      case TransformKind.REMOVE_HEADER:
        headers.delete(transform.name);
        break;

      case TransformKind.SET_COOKIE:
        cookies.set(transform.name, transform.value);
        break;

      case TransformKind.REMOVE_COOKIE:
        cookies.delete(transform.name);
        break;

      case TransformKind.SET_QUERY:
        url.searchParams.set(transform.name, transform.value);
        break;

      case TransformKind.REMOVE_QUERY:
        url.searchParams.delete(transform.name);
        break;

      case TransformKind.SET_BODY:
        body = { encoding: transform.encoding, value: transform.value };
        formFields = transform.encoding === BodyEncoding.FORM
          ? new Map((transform.value ?? []).map(([k, v]) => [k, v]))
          : null;
        break;

      case TransformKind.MERGE_JSON_BODY: {
        const current = decodeJsonBody(body);
        if (current === null || typeof current !== 'object' || Array.isArray(current)) {
          throw new TransformError(
            ProtocolErrorCode.TRANSFORM_INVALID,
            'merge-json-body requires an object body',
            { context: { kind: transform.kind } }
          );
        }
        body = { encoding: BodyEncoding.JSON, value: { ...current, ...transform.patch } };
        formFields = null;
        break;
      }

      case TransformKind.SET_FORM_FIELD:
        if (formFields === null) {
          formFields = new Map();
        }
        formFields.set(transform.name, transform.value);
        body = { encoding: BodyEncoding.FORM, value: [...formFields.entries()] };
        break;

      case TransformKind.SET_METHOD:
        method = transform.method;
        break;

      case TransformKind.SET_PATH:
        url.pathname = transform.path;
        break;

      default:
        throw invalid(`unhandled kind "${transform.kind}"`, { kind: transform.kind });
    }
  }

  return createRequestPlan({
    method,
    url: url.href,
    headers: [...headers.entries()].flatMap(([name, values]) =>
      values.map((value) => ({ name, value }))
    ),
    cookies: [...cookies.entries()].map(([name, value]) => ({ name, value })),
    body,
    metadata: plan.metadata,
    limits: options.planLimits,
  });
}

/**
 * transform 列表的确定性摘要
 * @param {object[]} transforms
 * @returns {string}
 */
export function transformsDigest(transforms) {
  return canonicalDigest(transforms.map((entry) => ({ ...entry })));
}

/**
 * 生成 plan 变更的可读 diff，用于诊断和 trace
 * @param {object} before
 * @param {object} after
 */
export function diffRequestPlans(before, after) {
  const a = requestPlanToJSON(before);
  const b = requestPlanToJSON(after);
  const changes = [];

  if (a.method !== b.method) changes.push({ field: 'method', from: a.method, to: b.method });
  if (a.url !== b.url) changes.push({ field: 'url', from: a.url, to: b.url });

  const headerNames = new Set([
    ...a.headers.map((h) => h.name),
    ...b.headers.map((h) => h.name),
  ]);
  for (const name of [...headerNames].sort()) {
    const from = a.headers.find((h) => h.name === name)?.values ?? null;
    const to = b.headers.find((h) => h.name === name)?.values ?? null;
    if (JSON.stringify(from) !== JSON.stringify(to)) {
      changes.push({ field: `header:${name}`, from, to });
    }
  }

  const cookieNames = new Set([
    ...a.cookies.map((c) => c.name),
    ...b.cookies.map((c) => c.name),
  ]);
  for (const name of [...cookieNames].sort()) {
    const from = a.cookies.find((c) => c.name === name)?.value ?? null;
    const to = b.cookies.find((c) => c.name === name)?.value ?? null;
    if (from !== to) changes.push({ field: `cookie:${name}`, from, to });
  }

  if (JSON.stringify(a.body) !== JSON.stringify(b.body)) {
    changes.push({ field: 'body', from: a.body, to: b.body });
  }

  return changes;
}
