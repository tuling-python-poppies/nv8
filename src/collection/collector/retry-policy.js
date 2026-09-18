/**
 * Retry Policy
 *
 * 重试与退避策略。设计要点：
 * - 策略拒绝（allowlist、凭据、方法）**永不重试**。
 * - 只有传输失败和明确可重试的状态码才重试。
 * - 退避是确定性的（可注入 jitter 源），便于测试与回归。
 * - 非幂等方法默认不重试，除非显式声明。
 */

import { CollectorConfigError } from './errors.js';

const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE', 'PUT', 'DELETE']);
const DEFAULT_RETRYABLE_STATUS = [408, 425, 429, 500, 502, 503, 504];

export class RetryPolicy {
  #maxAttempts;
  #baseDelayMs;
  #maxDelayMs;
  #multiplier;
  #jitterRatio;
  #retryableStatus;
  #retryNonIdempotent;
  #respectRetryAfter;
  #random;

  /**
   * @param {object} [config]
   * @param {number} [config.maxAttempts=3] 含首次尝试
   * @param {number} [config.baseDelayMs=200]
   * @param {number} [config.maxDelayMs=10000]
   * @param {number} [config.multiplier=2]
   * @param {number} [config.jitterRatio=0] 0 表示完全确定性
   * @param {number[]} [config.retryableStatus]
   * @param {boolean} [config.retryNonIdempotent=false]
   * @param {boolean} [config.respectRetryAfter=true]
   * @param {() => number} [config.random] 注入随机源便于测试
   */
  constructor(config = {}) {
    const {
      maxAttempts = 3,
      baseDelayMs = 200,
      maxDelayMs = 10_000,
      multiplier = 2,
      jitterRatio = 0,
      retryableStatus = DEFAULT_RETRYABLE_STATUS,
      retryNonIdempotent = false,
      respectRetryAfter = true,
      random = Math.random,
    } = config;

    if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
      throw new CollectorConfigError('retry.maxAttempts must be an integer >= 1');
    }
    if (!Number.isFinite(baseDelayMs) || baseDelayMs < 0) {
      throw new CollectorConfigError('retry.baseDelayMs must be a non-negative number');
    }
    if (!Number.isFinite(maxDelayMs) || maxDelayMs < baseDelayMs) {
      throw new CollectorConfigError('retry.maxDelayMs must be >= baseDelayMs');
    }
    if (!Number.isFinite(multiplier) || multiplier < 1) {
      throw new CollectorConfigError('retry.multiplier must be >= 1');
    }
    if (!Number.isFinite(jitterRatio) || jitterRatio < 0 || jitterRatio > 1) {
      throw new CollectorConfigError('retry.jitterRatio must be between 0 and 1');
    }
    if (!Array.isArray(retryableStatus)) {
      throw new CollectorConfigError('retry.retryableStatus must be an array');
    }
    if (typeof random !== 'function') {
      throw new CollectorConfigError('retry.random must be a function');
    }

    this.#maxAttempts = maxAttempts;
    this.#baseDelayMs = baseDelayMs;
    this.#maxDelayMs = maxDelayMs;
    this.#multiplier = multiplier;
    this.#jitterRatio = jitterRatio;
    this.#retryableStatus = Object.freeze(new Set(retryableStatus));
    this.#retryNonIdempotent = retryNonIdempotent === true;
    this.#respectRetryAfter = respectRetryAfter !== false;
    this.#random = random;
  }

  get maxAttempts() { return this.#maxAttempts; }

  /**
   * 判定是否应该重试。
   *
   * @param {object} input
   * @param {number} input.attempt 已完成的尝试次数（1 表示首次已失败）
   * @param {string} input.method
   * @param {Error} [input.error]
   * @param {object} [input.response] { status }
   * @returns {boolean}
   */
  shouldRetry({ attempt, method, error, response }) {
    if (attempt >= this.#maxAttempts) return false;

    const upperMethod = String(method).toUpperCase();
    if (!this.#retryNonIdempotent && !IDEMPOTENT_METHODS.has(upperMethod)) {
      return false;
    }

    if (error) {
      // 策略违规和配置错误永不重试
      if (error.isPolicyViolation === true) return false;
      return error.retryable === true;
    }

    if (response) {
      return this.#retryableStatus.has(response.status);
    }

    return false;
  }

  /**
   * 计算下一次重试的延迟。
   *
   * @param {object} input
   * @param {number} input.attempt 已完成的尝试次数
   * @param {object} [input.response] 用于读取 Retry-After
   * @returns {number} 毫秒
   */
  delayFor({ attempt, response }) {
    if (this.#respectRetryAfter && response) {
      const retryAfter = readRetryAfter(response);
      if (retryAfter !== null) {
        return Math.min(retryAfter, this.#maxDelayMs);
      }
    }

    const exponential = this.#baseDelayMs * this.#multiplier ** Math.max(0, attempt - 1);
    const capped = Math.min(exponential, this.#maxDelayMs);
    if (this.#jitterRatio === 0) return Math.round(capped);

    const jitterSpan = capped * this.#jitterRatio;
    const offset = (this.#random() * 2 - 1) * jitterSpan;
    return Math.max(0, Math.round(capped + offset));
  }

  describe() {
    return {
      maxAttempts: this.#maxAttempts,
      baseDelayMs: this.#baseDelayMs,
      maxDelayMs: this.#maxDelayMs,
      multiplier: this.#multiplier,
      jitterRatio: this.#jitterRatio,
      retryableStatus: [...this.#retryableStatus].sort((a, b) => a - b),
      retryNonIdempotent: this.#retryNonIdempotent,
      respectRetryAfter: this.#respectRetryAfter,
    };
  }
}

/**
 * 读取 Retry-After（秒数或 HTTP 日期）
 * @param {object} response
 * @returns {number|null} 毫秒
 */
export function readRetryAfter(response) {
  const header = response?.headers?.find?.(
    (entry) => entry.name === 'retry-after'
  )?.values?.[0] ?? response?.headers?.['retry-after'];

  if (typeof header !== 'string' || header.length === 0) return null;

  if (/^\d+$/.test(header)) {
    return Number(header) * 1000;
  }

  const timestamp = Date.parse(header);
  if (Number.isNaN(timestamp)) return null;
  return Math.max(0, timestamp - Date.now());
}
