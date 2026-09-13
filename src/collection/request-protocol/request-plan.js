/**
 * Request Plan
 *
 * 请求计划是 Protocol 层的输出，也是 Collector 层的输入。
 *
 * 边界规则：
 * - RequestPlan 是纯数据描述，不含 socket、agent、凭据或重试逻辑。
 * - Protocol 生成 plan，但绝不执行它。执行权只属于 Collector。
 * - plan 里的 URL、header、cookie 和 body 都已完成变换，Collector 不再猜测。
 */

import { canonicalDigest } from './canonical-json.js';
import { ProtocolError, ProtocolErrorCode } from './errors.js';

export const REQUEST_PLAN_SCHEMA_VERSION = '1.0';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE']);
const NETWORK_SCHEMES = new Set(['http:', 'https:', 'ws:', 'wss:']);
const KNOWN_METHODS = new Set([
  'GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'TRACE',
]);

/** 允许的请求体表示 */
export const BodyEncoding = {
  NONE: 'none',
  TEXT: 'text',
  /** base64 编码的二进制 */
  BASE64: 'base64',
  /** 结构化 JSON，由 Collector 序列化 */
  JSON: 'json',
  /** application/x-www-form-urlencoded 键值对 */
  FORM: 'form',
};

const BODY_ENCODINGS = new Set(Object.values(BodyEncoding));

function invalid(reason, context) {
  return new ProtocolError(
    ProtocolErrorCode.REQUEST_PLAN_INVALID,
    `Invalid request plan: ${reason}`,
    { context }
  );
}

function normalizeMethod(method) {
  if (typeof method !== 'string' || method.length === 0) {
    throw invalid('method must be a non-empty string', { method });
  }
  const upper = method.toUpperCase();
  if (!/^[A-Z]+$/.test(upper)) {
    throw invalid(`method contains illegal characters: "${method}"`, { method });
  }
  return upper;
}

function normalizeUrl(url) {
  if (typeof url !== 'string' || url.length === 0) {
    throw invalid('url must be a non-empty string', { url });
  }
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw invalid(`url is not absolute or parseable: "${url}"`, { url });
  }
  if (!NETWORK_SCHEMES.has(parsed.protocol)) {
    throw invalid(
      `url protocol must be http:, https:, ws: or wss:, received "${parsed.protocol}"`,
      { url, protocol: parsed.protocol }
    );
  }
  return parsed;
}

/**
 * Header 名称归一化为小写。HTTP header 名大小写不敏感，
 * 统一小写可以让 transform 的冲突检测确定化。
 */
function normalizeHeaderName(name) {
  if (typeof name !== 'string' || name.length === 0) {
    throw invalid('header name must be a non-empty string', { name });
  }
  if (!/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(name)) {
    throw invalid(`header name contains illegal characters: "${name}"`, { name });
  }
  return name.toLowerCase();
}

function normalizeHeaderValue(name, value) {
  if (typeof value !== 'string') {
    throw invalid(`header "${name}" value must be a string`, { name, value });
  }
  if (/[\r\n\0]/.test(value)) {
    throw invalid(`header "${name}" value contains CR, LF or NUL`, { name });
  }
  return value;
}

function normalizeHeaders(headers) {
  const map = new Map();
  if (headers == null) return map;

  const entries = headers instanceof Map
    ? [...headers.entries()]
    : Array.isArray(headers)
      ? headers.map((entry) =>
        Array.isArray(entry) ? entry : [entry?.name, entry?.value])
      : Object.entries(headers);

  for (const [rawName, rawValue] of entries) {
    const name = normalizeHeaderName(rawName);
    // 多值 header 用数组表示，保持插入顺序
    const value = normalizeHeaderValue(name, rawValue);
    if (map.has(name)) {
      map.get(name).push(value);
    } else {
      map.set(name, [value]);
    }
  }
  return map;
}

function normalizeCookies(cookies) {
  const map = new Map();
  if (cookies == null) return map;

  const entries = cookies instanceof Map
    ? [...cookies.entries()]
    : Array.isArray(cookies)
      ? cookies.map((entry) =>
        Array.isArray(entry) ? entry : [entry?.name, entry?.value])
      : Object.entries(cookies);

  for (const [rawName, rawValue] of entries) {
    if (typeof rawName !== 'string' || rawName.length === 0) {
      throw invalid('cookie name must be a non-empty string', { name: rawName });
    }
    if (!/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(rawName)) {
      throw invalid(`cookie name contains illegal characters: "${rawName}"`, { name: rawName });
    }
    if (typeof rawValue !== 'string') {
      throw invalid(`cookie "${rawName}" value must be a string`, { name: rawName });
    }
    if (/[\r\n\0;]/.test(rawValue)) {
      throw invalid(`cookie "${rawName}" value contains CR, LF, NUL or ";"`, { name: rawName });
    }
    map.set(rawName, rawValue);
  }
  return map;
}

function normalizeBody(body) {
  if (body == null) {
    return { encoding: BodyEncoding.NONE, value: null };
  }

  if (typeof body === 'string') {
    return { encoding: BodyEncoding.TEXT, value: body };
  }

  if (typeof body !== 'object' || Array.isArray(body)) {
    throw invalid('body must be null, a string or a { encoding, value } object', {});
  }

  const { encoding, value } = body;
  if (!BODY_ENCODINGS.has(encoding)) {
    throw invalid(
      `body.encoding must be one of ${[...BODY_ENCODINGS].join(', ')}`,
      { encoding }
    );
  }

  switch (encoding) {
    case BodyEncoding.NONE:
      return { encoding, value: null };
    case BodyEncoding.TEXT:
      if (typeof value !== 'string') throw invalid('text body value must be a string', {});
      return { encoding, value };
    case BodyEncoding.BASE64:
      if (typeof value !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) {
        throw invalid('base64 body value must be a valid base64 string', {});
      }
      return { encoding, value };
    case BodyEncoding.JSON:
      if (value === undefined) throw invalid('json body value must not be undefined', {});
      return { encoding, value };
    case BodyEncoding.FORM: {
      const entries = value instanceof Map
        ? [...value.entries()]
        : Array.isArray(value)
          ? value
          : Object.entries(value ?? {});
      const pairs = [];
      for (const [key, entryValue] of entries) {
        if (typeof key !== 'string' || key.length === 0) {
          throw invalid('form body keys must be non-empty strings', {});
        }
        if (typeof entryValue !== 'string') {
          throw invalid(`form body value for "${key}" must be a string`, {});
        }
        pairs.push([key, entryValue]);
      }
      return { encoding, value: pairs };
    }
    default:
      throw invalid(`unhandled body encoding "${encoding}"`, { encoding });
  }
}

function validateWebSocketMetadata(websocket) {
  if (typeof websocket !== 'object' || websocket === null || Array.isArray(websocket)) {
    throw invalid('metadata.websocket must be an object or null', {});
  }

  const protocols = websocket.protocols ?? [];
  if (!Array.isArray(protocols)) {
    throw invalid('metadata.websocket.protocols must be an array', {});
  }
  const protocolToken = /^[^\x00-\x20\x7f(),/:;<=>?@[\\\\\]"]+$/;
  for (const protocol of protocols) {
    if (typeof protocol !== 'string' || protocol.length === 0 || !protocolToken.test(protocol)) {
      throw invalid('metadata.websocket.protocols contains an invalid token', {});
    }
  }
  if (new Set(protocols).size !== protocols.length) {
    throw invalid('metadata.websocket.protocols must not contain duplicates', {});
  }

  const send = websocket.send ?? [];
  if (!Array.isArray(send)) {
    throw invalid('metadata.websocket.send must be an array', {});
  }
  for (const message of send) {
    if (typeof message === 'string') continue;
    if (message === null || typeof message !== 'object' || Array.isArray(message)) {
      throw invalid('metadata.websocket messages must be strings or { type, data } objects', {});
    }
    const type = message.type ?? 'text';
    if (type !== 'text' && type !== 'binary') {
      throw invalid('metadata.websocket message type must be text or binary', {});
    }
    if (typeof message.data !== 'string') {
      throw invalid('metadata.websocket message data must be a string', {});
    }
    if (type === 'binary' && !isBase64String(message.data)) {
      throw invalid('binary WebSocket message data must be base64', {});
    }
  }

  for (const [name, value] of [
    ['maxFrames', websocket.maxFrames],
    ['maxMessageBytes', websocket.maxMessageBytes],
    ['maxTotalBytes', websocket.maxTotalBytes],
  ]) {
    if (value !== undefined && (!Number.isSafeInteger(value) || value < 1)) {
      throw invalid(`metadata.websocket.${name} must be a positive integer`, { value });
    }
  }
  if (websocket.closeOnFrames !== undefined && typeof websocket.closeOnFrames !== 'boolean') {
    throw invalid('metadata.websocket.closeOnFrames must be a boolean', {});
  }
  if (websocket.maxTotalBytes !== undefined
    && websocket.maxMessageBytes !== undefined
    && websocket.maxTotalBytes < websocket.maxMessageBytes
    && (websocket.maxFrames ?? 1) > 1) {
    throw invalid('metadata.websocket.maxTotalBytes must cover maxMessageBytes when receiving multiple frames', {});
  }
}

function isBase64String(value) {
  return value.length % 4 === 0
    && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value);
}

export const DEFAULT_REQUEST_PLAN_LIMITS = Object.freeze({
  maxUrlLength: 8 * 1024,
  maxHeaderCount: 128,
  maxHeaderBytes: 32 * 1024,
  maxCookieCount: 128,
  maxBodyBytes: 8 * 1024 * 1024,
});

/**
 * 创建一个只读请求计划。
 *
 * @param {object} input
 * @param {string} input.method
 * @param {string} input.url 绝对 http/https/ws/wss URL
 * @param {object|Array|Map} [input.headers]
 * @param {object|Array|Map} [input.cookies]
 * @param {string|object} [input.body]
 * @param {Record<string,unknown>} [input.metadata] 非网络语义的诊断信息
 * @param {object} [input.limits]
 * @returns {Readonly<object>}
 */
export function createRequestPlan(input) {
  if (input === null || typeof input !== 'object') {
    throw invalid('plan must be an object', {});
  }

  const limits = { ...DEFAULT_REQUEST_PLAN_LIMITS, ...(input.limits ?? {}) };

  // 未知方法不拒绝：逆向目标可能使用自定义方法。已知集合只用于诊断标注。
  const method = normalizeMethod(input.method);
  const wellKnownMethod = KNOWN_METHODS.has(method);

  const url = normalizeUrl(input.url);
  if (url.href.length > limits.maxUrlLength) {
    throw invalid('url exceeds maxUrlLength', {
      length: url.href.length,
      limit: limits.maxUrlLength,
    });
  }

  const headers = normalizeHeaders(input.headers);
  let headerCount = 0;
  let headerBytes = 0;
  for (const [name, values] of headers) {
    for (const value of values) {
      headerCount += 1;
      headerBytes += Buffer.byteLength(name, 'utf8') + Buffer.byteLength(value, 'utf8') + 4;
    }
  }
  if (headerCount > limits.maxHeaderCount) {
    throw invalid('header count exceeds maxHeaderCount', {
      actual: headerCount,
      limit: limits.maxHeaderCount,
    });
  }
  if (headerBytes > limits.maxHeaderBytes) {
    throw invalid('header bytes exceeds maxHeaderBytes', {
      actual: headerBytes,
      limit: limits.maxHeaderBytes,
    });
  }

  const cookies = normalizeCookies(input.cookies);
  if (cookies.size > limits.maxCookieCount) {
    throw invalid('cookie count exceeds maxCookieCount', {
      actual: cookies.size,
      limit: limits.maxCookieCount,
    });
  }

  const body = normalizeBody(input.body);
  if (body.encoding === BodyEncoding.TEXT || body.encoding === BodyEncoding.BASE64) {
    const size = Buffer.byteLength(body.value ?? '', 'utf8');
    if (size > limits.maxBodyBytes) {
      throw invalid('body exceeds maxBodyBytes', { actual: size, limit: limits.maxBodyBytes });
    }
  } else if (body.encoding === BodyEncoding.JSON || body.encoding === BodyEncoding.FORM) {
    // json/form 在传输层才序列化。上限必须按**序列化后**的 UTF-8 字节计，
    // 否则超大对象/表单会绕过此处检查，直到真正发送时才暴露。
    let serialized;
    try {
      serialized = body.encoding === BodyEncoding.JSON
        ? JSON.stringify(body.value)
        : new URLSearchParams(body.value).toString();
    } catch (error) {
      throw invalid(`body is not serializable: ${error.message}`, {});
    }
    const size = serialized === undefined ? 0 : Buffer.byteLength(serialized, 'utf8');
    if (size > limits.maxBodyBytes) {
      throw invalid('body exceeds maxBodyBytes', { actual: size, limit: limits.maxBodyBytes });
    }
  }

  if (body.encoding !== BodyEncoding.NONE && SAFE_METHODS.has(method)) {
    throw invalid(`method ${method} must not carry a request body`, { method });
  }

  const metadata = input.metadata ?? null;
  if (metadata !== null && (typeof metadata !== 'object' || Array.isArray(metadata))) {
    throw invalid('metadata must be a plain object or null', {});
  }
  const websocket = metadata?.websocket ?? null;
  if (websocket !== null) {
    if (!['ws:', 'wss:'].includes(url.protocol)) {
      throw invalid('metadata.websocket requires a ws: or wss: URL', {
        protocol: url.protocol,
      });
    }
    validateWebSocketMetadata(websocket);
  } else if (['ws:', 'wss:'].includes(url.protocol)) {
    throw invalid('WebSocket plans require metadata.websocket', {});
  }
  if (['ws:', 'wss:'].includes(url.protocol) && method !== 'GET') {
    throw invalid('WebSocket plans must use GET', { method });
  }

  const record = {
    schemaVersion: REQUEST_PLAN_SCHEMA_VERSION,
    method,
    url: url.href,
    origin: url.origin,
    headers: [...headers.entries()]
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([name, values]) => ({ name, values: [...values] })),
    cookies: [...cookies.entries()]
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([name, value]) => ({ name, value })),
    body,
    metadata,
    wellKnownMethod,
  };

  return Object.freeze({
    ...record,
    headers: Object.freeze(record.headers.map((entry) => Object.freeze({
      name: entry.name,
      values: Object.freeze(entry.values),
    }))),
    cookies: Object.freeze(record.cookies.map((entry) => Object.freeze(entry))),
    body: Object.freeze(record.body),
    digest: canonicalDigest(record),
  });
}

/**
 * 读取单个 header 的首个值
 * @param {object} plan
 * @param {string} name
 * @returns {string|undefined}
 */
export function getHeader(plan, name) {
  const target = name.toLowerCase();
  return plan.headers.find((entry) => entry.name === target)?.values[0];
}

/**
 * 读取 header 的全部值
 * @param {object} plan
 * @param {string} name
 * @returns {string[]}
 */
export function getHeaderValues(plan, name) {
  const target = name.toLowerCase();
  return plan.headers.find((entry) => entry.name === target)?.values ?? [];
}

/**
 * 读取 cookie 值
 * @param {object} plan
 * @param {string} name
 * @returns {string|undefined}
 */
export function getCookie(plan, name) {
  return plan.cookies.find((entry) => entry.name === name)?.value;
}

/**
 * 把 plan 转换为可读的普通对象（用于 trace 和断言）
 * @param {object} plan
 */
export function requestPlanToJSON(plan) {
  return {
    schemaVersion: plan.schemaVersion,
    method: plan.method,
    url: plan.url,
    origin: plan.origin,
    headers: plan.headers.map((entry) => ({ name: entry.name, values: [...entry.values] })),
    cookies: plan.cookies.map((entry) => ({ ...entry })),
    body: { ...plan.body },
    metadata: plan.metadata,
    wellKnownMethod: plan.wellKnownMethod,
    digest: plan.digest,
  };
}
