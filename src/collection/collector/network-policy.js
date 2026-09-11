/**
 * Network Policy
 *
 * 真实网络出口的准入控制。策略由部署方提供，**不可被目标脚本、
 * Evidence manifest 或 Protocol 适配器修改**——这是 NV8 安全边界的核心。
 *
 * 策略默认拒绝：未显式 allowlist 的 origin 一律不可访问。
 */

import { CollectorConfigError, CollectorErrorCode, CollectorPolicyError } from './errors.js';

const DEFAULT_METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

function normalizeOriginPattern(pattern) {
  if (typeof pattern !== 'string' || pattern.length === 0) {
    throw new CollectorConfigError('allowedOrigins entries must be non-empty strings', {
      context: { pattern },
    });
  }

  // 支持 "https://api.test"、"https://*.test" 和 "*"（后者需显式 allowAnyOrigin）
  if (pattern === '*') {
    throw new CollectorConfigError(
      'wildcard "*" is not accepted in allowedOrigins; set allowAnyOrigin: true explicitly',
      { context: { pattern } }
    );
  }

  const wildcard = pattern.includes('*');
  if (!wildcard) {
    let url;
    try {
      url = new URL(pattern);
    } catch {
      throw new CollectorConfigError(
        `allowedOrigins entry is not a valid origin: "${pattern}"`,
        { context: { pattern } }
      );
    }
    if (url.origin === 'null') {
      throw new CollectorConfigError(
        `allowedOrigins entry has no usable origin: "${pattern}"`,
        { context: { pattern } }
      );
    }
    return { kind: 'exact', value: url.origin };
  }

  const match = /^(https?|wss?):\/\/\*\.([a-z0-9.-]+)(?::(\d+))?$/i.exec(pattern);
  if (!match) {
    throw new CollectorConfigError(
      `wildcard origin must look like "https://*.example.com": "${pattern}"`,
      { context: { pattern } }
    );
  }
  return {
    kind: 'suffix',
    protocol: `${match[1].toLowerCase()}:`,
    suffix: `.${match[2].toLowerCase()}`,
    port: match[3] ?? null,
  };
}

function matchesOrigin(rule, url) {
  if (rule.kind === 'exact') return rule.value === url.origin;
  if (rule.protocol !== url.protocol) return false;
  if (rule.port !== null && rule.port !== url.port) return false;
  const host = url.hostname.toLowerCase();
  return host.endsWith(rule.suffix);
}

export class NetworkPolicy {
  #allowedOrigins;
  #allowAnyOrigin;
  #allowedSchemes;
  #allowedMethods;
  #enabled;
  #followRedirects;
  #maxRedirects;
  #allowCrossOriginRedirect;

  /**
   * @param {object} [config]
   * @param {boolean} [config.enabled=false] 必须显式开启才能发起真实请求
   * @param {string[]} [config.allowedOrigins=[]]
   * @param {boolean} [config.allowAnyOrigin=false] 仅供受控测试环境
   * @param {string[]} [config.allowedSchemes=['https:']] HTTP(S) and WebSocket schemes are accepted
   * @param {string[]} [config.allowedMethods]
   * @param {boolean} [config.followRedirects=false]
   * @param {number} [config.maxRedirects=5]
   * @param {boolean} [config.allowCrossOriginRedirect=false]
   */
  constructor(config = {}) {
    const {
      enabled = false,
      allowedOrigins = [],
      allowAnyOrigin = false,
      allowedSchemes = ['https:'],
      allowedMethods = DEFAULT_METHODS,
      followRedirects = false,
      maxRedirects = 5,
      allowCrossOriginRedirect = false,
    } = config;

    if (typeof enabled !== 'boolean') {
      throw new CollectorConfigError('enabled must be a boolean');
    }
    if (!Array.isArray(allowedOrigins)) {
      throw new CollectorConfigError('allowedOrigins must be an array');
    }
    if (typeof allowAnyOrigin !== 'boolean') {
      throw new CollectorConfigError('allowAnyOrigin must be a boolean');
    }
    if (!Array.isArray(allowedSchemes) || allowedSchemes.length === 0) {
      throw new CollectorConfigError('allowedSchemes must be a non-empty array');
    }
    if (!Array.isArray(allowedMethods) || allowedMethods.length === 0) {
      throw new CollectorConfigError('allowedMethods must be a non-empty array');
    }
    if (!Number.isInteger(maxRedirects) || maxRedirects < 0) {
      throw new CollectorConfigError('maxRedirects must be a non-negative integer');
    }

    for (const scheme of allowedSchemes) {
      if (!['http:', 'https:', 'ws:', 'wss:'].includes(scheme)) {
        throw new CollectorConfigError(
          `allowedSchemes only supports "http:", "https:", "ws:" and "wss:", received "${scheme}"`,
          { context: { scheme } }
        );
      }
    }

    this.#enabled = enabled;
    this.#allowAnyOrigin = allowAnyOrigin;
    this.#allowedOrigins = Object.freeze(allowedOrigins.map(normalizeOriginPattern));
    this.#allowedSchemes = Object.freeze(new Set(allowedSchemes));
    this.#allowedMethods = Object.freeze(new Set(allowedMethods.map((m) => m.toUpperCase())));
    this.#followRedirects = followRedirects === true;
    this.#maxRedirects = maxRedirects;
    this.#allowCrossOriginRedirect = allowCrossOriginRedirect === true;
  }

  get enabled() { return this.#enabled; }
  get followRedirects() { return this.#followRedirects; }
  get maxRedirects() { return this.#maxRedirects; }
  get allowCrossOriginRedirect() { return this.#allowCrossOriginRedirect; }

  /**
   * 判定一个 URL + method 是否被允许。
   * @param {string} url
   * @param {string} method
   * @returns {{ allowed: boolean, code?: string, reason?: string }}
   */
  check(url, method) {
    if (!this.#enabled) {
      return {
        allowed: false,
        code: CollectorErrorCode.NETWORK_DISABLED,
        reason: 'real network egress is disabled',
      };
    }

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return {
        allowed: false,
        code: CollectorErrorCode.INVALID_PLAN,
        reason: `url is not parseable: "${url}"`,
      };
    }

    if (!this.#allowedSchemes.has(parsed.protocol)) {
      return {
        allowed: false,
        code: CollectorErrorCode.SCHEME_NOT_ALLOWED,
        reason: `scheme "${parsed.protocol}" is not allowed`,
      };
    }

    const upperMethod = String(method).toUpperCase();
    if (!this.#allowedMethods.has(upperMethod)) {
      return {
        allowed: false,
        code: CollectorErrorCode.METHOD_NOT_ALLOWED,
        reason: `method "${upperMethod}" is not allowed`,
      };
    }

    if (!this.#allowAnyOrigin) {
      const matched = this.#allowedOrigins.some((rule) => matchesOrigin(rule, parsed));
      if (!matched) {
        return {
          allowed: false,
          code: CollectorErrorCode.ORIGIN_NOT_ALLOWED,
          reason: `origin "${parsed.origin}" is not in the allowlist`,
        };
      }
    }

    return { allowed: true };
  }

  /**
   * 断言允许，否则抛 {@link CollectorPolicyError}
   * @param {string} url
   * @param {string} method
   */
  assert(url, method) {
    const result = this.check(url, method);
    if (result.allowed) return;
    throw new CollectorPolicyError(result.code, result.reason, {
      context: { url, method },
      suggestions: result.code === CollectorErrorCode.NETWORK_DISABLED
        ? ['Set network.enabled: true and populate allowedOrigins in the deployment config']
        : ['Add the origin to the deployment allowlist if this request is intended'],
    });
  }

  /**
   * 重定向准入：除策略允许外，跨 origin 重定向默认拒绝
   * @param {string} fromUrl
   * @param {string} toUrl
   * @param {string} method
   */
  assertRedirect(fromUrl, toUrl, method) {
    if (!this.#followRedirects) {
      throw new CollectorPolicyError(
        CollectorErrorCode.REDIRECT_NOT_ALLOWED,
        'redirects are disabled by policy',
        { context: { fromUrl, toUrl } }
      );
    }
    this.assert(toUrl, method);
    if (!this.#allowCrossOriginRedirect) {
      const from = new URL(fromUrl);
      const to = new URL(toUrl);
      if (from.origin !== to.origin) {
        throw new CollectorPolicyError(
          CollectorErrorCode.REDIRECT_NOT_ALLOWED,
          `cross-origin redirect from ${from.origin} to ${to.origin} is not allowed`,
          { context: { fromUrl, toUrl } }
        );
      }
    }
  }

  /** 可序列化快照，用于诊断（不含凭据） */
  describe() {
    return {
      enabled: this.#enabled,
      allowAnyOrigin: this.#allowAnyOrigin,
      allowedOrigins: this.#allowedOrigins.map((rule) =>
        rule.kind === 'exact' ? rule.value : `${rule.protocol}//*${rule.suffix}`),
      allowedSchemes: [...this.#allowedSchemes].sort(),
      allowedMethods: [...this.#allowedMethods].sort(),
      followRedirects: this.#followRedirects,
      maxRedirects: this.#maxRedirects,
      allowCrossOriginRedirect: this.#allowCrossOriginRedirect,
    };
  }
}

/**
 * 默认离线策略：拒绝一切真实网络访问
 * @returns {NetworkPolicy}
 */
export function createOfflinePolicy() {
  return new NetworkPolicy({ enabled: false });
}
