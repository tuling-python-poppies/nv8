/**
 * Credential Store
 *
 * 凭据由部署方注入，绑定到具体 origin，并且：
 * - 不可被目标脚本、Protocol 适配器或 Evidence 读取
 * - 只在通过 NetworkPolicy 检查后、由 Collector 在发出请求前注入
 * - 在诊断、trace 和错误消息中始终以 `[redacted]` 呈现
 */

import { CollectorConfigError, CollectorErrorCode, CollectorPolicyError } from './errors.js';

export const REDACTED = '[redacted]';

/** 需要脱敏的 header 名（小写） */
export const SENSITIVE_HEADERS = Object.freeze(new Set([
  'authorization',
  'proxy-authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'x-csrf-token',
]));

/**
 * 部署方自定义凭据 header 名（小写）。
 *
 * 静态白名单不可能覆盖所有凭据形态（`X-Api-Key`、`X-Signature`…）。
 * CredentialStore 在配置阶段把用到的 header 名注册进来，之后所有
 * `redactHeaders()` 调用都会强制脱敏这些名字，避免自定义凭据值
 * 进入审计或错误消息。
 */
const registeredSensitiveHeaders = new Set();

/**
 * 注册一个需要脱敏的 header 名。幂等。
 * @param {string} name
 */
export function registerSensitiveHeader(name) {
  if (typeof name !== 'string' || name.length === 0) return;
  registeredSensitiveHeaders.add(name.toLowerCase());
}

/**
 * 判断 header 名是否需要脱敏。
 * @param {string} name
 * @returns {boolean}
 */
export function isSensitiveHeader(name) {
  const key = String(name).toLowerCase();
  return SENSITIVE_HEADERS.has(key) || registeredSensitiveHeaders.has(key);
}

/**
 * URL 脱敏：只保留 origin + path，查询参数只保留**键名**，值一律隐藏。
 *
 * 采集 URL 常带 `?token=` / `?sign=` 等一次性凭据；审计与错误消息里
 * 直插原串等于把凭据写进日志与工单。不可解析的串直接抹掉查询段。
 *
 * @param {string} input
 * @returns {string}
 */
export function redactRequestUrl(input) {
  if (typeof input !== 'string' || input.length === 0) return `${input ?? ''}`;
  let url;
  try {
    url = new URL(input);
  } catch {
    return `${input}`.replace(/\?.*$/su, '?[redacted]');
  }
  const base = `${url.origin}${url.pathname}`;
  if (url.search === '') return base;
  const keys = [...new Set([...url.searchParams.keys()])];
  return `${base}?${keys.map((key) => `${key}=[redacted]`).join('&')}`;
}

export class CredentialStore {
  /** @type {Map<string, { headers: Map<string,string>, cookies: Map<string,string> }>} */
  #byOrigin = new Map();

  /**
   * @param {object} [config]
   * @param {Record<string, { headers?: Record<string,string>, cookies?: Record<string,string> }>} [config.origins]
   */
  constructor(config = {}) {
    const origins = config.origins ?? {};
    if (typeof origins !== 'object' || origins === null || Array.isArray(origins)) {
      throw new CollectorConfigError('credentials.origins must be a plain object');
    }

    for (const [rawOrigin, entry] of Object.entries(origins)) {
      let origin;
      try {
        origin = new URL(rawOrigin).origin;
      } catch {
        throw new CollectorConfigError(
          `credential key is not a valid origin: "${rawOrigin}"`,
          { context: { origin: rawOrigin } }
        );
      }
      if (origin === 'null') {
        throw new CollectorConfigError(
          `credential key has no usable origin: "${rawOrigin}"`,
          { context: { origin: rawOrigin } }
        );
      }

      const headers = new Map();
      for (const [name, value] of Object.entries(entry?.headers ?? {})) {
        if (typeof value !== 'string') {
          throw new CollectorConfigError(
            `credential header "${name}" for ${origin} must be a string`,
            { context: { origin, header: name } }
          );
        }
        if (/[\r\n\0]/.test(value)) {
          throw new CollectorConfigError(
            `credential header "${name}" for ${origin} contains CR, LF or NUL`,
            { context: { origin, header: name } }
          );
        }
        headers.set(name.toLowerCase(), value);
        // 自定义凭据 header 名注册后强制脱敏：审计/错误消息不依赖静态白名单
        registerSensitiveHeader(name);
      }

      const cookies = new Map();
      for (const [name, value] of Object.entries(entry?.cookies ?? {})) {
        if (typeof value !== 'string') {
          throw new CollectorConfigError(
            `credential cookie "${name}" for ${origin} must be a string`,
            { context: { origin, cookie: name } }
          );
        }
        if (/[\r\n\0;]/.test(value)) {
          throw new CollectorConfigError(
            `credential cookie "${name}" for ${origin} contains CR, LF, NUL or ";"`,
            { context: { origin, cookie: name } }
          );
        }
        cookies.set(name, value);
      }

      this.#byOrigin.set(origin, { headers, cookies });
    }
  }

  get size() {
    return this.#byOrigin.size;
  }

  has(origin) {
    return this.#byOrigin.has(origin);
  }

  /**
   * 读取某 origin 的凭据。传入的 origin 必须与凭据 origin 完全一致，
   * 避免把 A 站凭据发往 B 站。
   *
   * @param {string} url
   * @returns {{ headers: Map<string,string>, cookies: Map<string,string> }|null}
   */
  resolve(url) {
    let origin;
    try {
      origin = new URL(url).origin;
    } catch {
      return null;
    }
    return this.#byOrigin.get(origin) ?? null;
  }

  /**
   * 断言某 origin 存在凭据（用于要求认证的采集任务）
   * @param {string} url
   */
  require(url) {
    const resolved = this.resolve(url);
    if (resolved) return resolved;
    const origin = (() => {
      try { return new URL(url).origin; } catch { return String(url); }
    })();
    throw new CollectorPolicyError(
      CollectorErrorCode.CREDENTIAL_NOT_FOUND,
      `No credentials configured for origin ${origin}`,
      {
        context: { origin },
        suggestions: ['Add the origin to the deployment credential config'],
      }
    );
  }

  /** 诊断快照：只暴露 origin 和键名，绝不暴露值 */
  describe() {
    const origins = {};
    for (const [origin, entry] of this.#byOrigin) {
      origins[origin] = {
        headers: [...entry.headers.keys()].sort(),
        cookies: [...entry.cookies.keys()].sort(),
      };
    }
    return { origins };
  }
}

/**
 * 对 header 集合做脱敏，用于 trace 和错误输出
 * @param {Array<{name:string, values:string[]}>|Map<string,string[]>|Record<string,string>} headers
 * @returns {Record<string, string|string[]>}
 */
export function redactHeaders(headers) {
  const output = {};
  const entries = headers instanceof Map
    ? [...headers.entries()]
    : Array.isArray(headers)
      ? headers.map((entry) => [entry.name, entry.values])
      : Object.entries(headers ?? {});

  for (const [name, value] of entries) {
    const key = String(name).toLowerCase();
    if (isSensitiveHeader(key)) {
      output[key] = REDACTED;
    } else {
      output[key] = value;
    }
  }
  return output;
}

/**
 * 对 cookie 集合做脱敏
 * @param {Array<{name:string,value:string}>|Map<string,string>|Record<string,string>} cookies
 * @returns {Record<string,string>}
 */
export function redactCookies(cookies) {
  const output = {};
  const entries = cookies instanceof Map
    ? [...cookies.entries()]
    : Array.isArray(cookies)
      ? cookies.map((entry) => [entry.name, entry.value])
      : Object.entries(cookies ?? {});
  for (const [name] of entries) {
    output[String(name)] = REDACTED;
  }
  return output;
}
