/**
 * Collector
 *
 * 唯一拥有真实网络出口的组件。职责：
 * - 执行 Protocol 产出的 RequestPlan
 * - 强制 NetworkPolicy（allowlist、scheme、method、redirect）
 * - 注入 origin 绑定的凭据
 * - 管理会话 cookie
 * - 应用重试与退避
 * - 产出脱敏后的审计记录
 *
 * Collector 不生成签名，不执行 JavaScript，不解析 DOM。
 */

import { createRequestPlan } from '../request-protocol/request-plan.js';
import { CredentialStore, redactCookies, redactHeaders } from './credentials.js';
import { NetworkPolicy } from './network-policy.js';
import { RetryPolicy } from './retry-policy.js';
import { CircuitBreaker } from './circuit-breaker.js';
import { RateLimiter } from './rate-limiter.js';
import { CookieJar } from './cookie-jar.js';
import { assertTransport, getResponseHeader, withTimeout } from './transport.js';
import {
  CollectorError,
  CollectorErrorCode,
  CollectorPolicyError,
  CollectorRetryExhaustedError,
} from './errors.js';

const DEFAULT_LIMITS = Object.freeze({
  maxAuditEntries: 1000,
  timeoutMs: 30_000,
});

export class Collector {
  #policy;
  #breaker;
  #rateLimiter;
  #credentials;
  #retry;
  #transport;
  #cookieJar;
  #limits;
  #audit = [];
  #disposed = false;
  #sleep;

  /**
   * @param {object} config
   * @param {object} config.transport 必需，唯一网络实现
   * @param {NetworkPolicy|object} [config.policy]
   * @param {CredentialStore|object} [config.credentials]
   * @param {RetryPolicy|object} [config.retry]
   * @param {CookieJar} [config.cookieJar]
   * @param {object} [config.limits]
   * @param {(ms:number)=>Promise<void>} [config.sleep] 注入便于测试
   */
  constructor(config = {}) {
    this.#policy = config.policy instanceof NetworkPolicy
      ? config.policy
      : new NetworkPolicy(config.policy ?? {});

    this.#credentials = config.credentials instanceof CredentialStore
      ? config.credentials
      : new CredentialStore(config.credentials ?? {});

    this.#retry = config.retry instanceof RetryPolicy
      ? config.retry
      : new RetryPolicy(config.retry ?? {});

    this.#breaker = config.circuitBreaker instanceof CircuitBreaker
      ? config.circuitBreaker
      : new CircuitBreaker(config.circuitBreaker ?? {});

    this.#rateLimiter = config.rateLimiter instanceof RateLimiter
      ? config.rateLimiter
      : new RateLimiter(config.rateLimiter ?? {});

    this.#cookieJar = config.cookieJar ?? new CookieJar();
    this.#limits = Object.freeze({ ...DEFAULT_LIMITS, ...(config.limits ?? {}) });

    const transport = assertTransport(config.transport);
    this.#transport = this.#limits.timeoutMs > 0
      ? withTimeout(transport, this.#limits.timeoutMs)
      : transport;

    this.#sleep = config.sleep ?? ((ms) => new Promise((resolve) => {
      const timer = setTimeout(resolve, ms);
      if (typeof timer.unref === 'function') timer.unref();
    }));
  }

  get policy() { return this.#policy; }
  get circuitBreaker() { return this.#breaker; }
  get rateLimiter() { return this.#rateLimiter; }
  get cookieJar() { return this.#cookieJar; }
  get disposed() { return this.#disposed; }

  #assertActive() {
    if (this.#disposed) {
      throw new CollectorPolicyError(
        CollectorErrorCode.DISPOSED,
        'collector has been disposed'
      );
    }
  }

  /**
   * 执行一个 RequestPlan。
   *
   * @param {object} plan 来自 Protocol 层
   * @param {object} [options]
   * @param {AbortSignal} [options.signal]
   * @param {boolean} [options.requireCredentials=false]
   * @returns {Promise<Readonly<object>>} CollectorResult
   */
  async send(plan, options = {}) {
    this.#assertActive();

    const normalized = Object.isFrozen(plan) && typeof plan.digest === 'string'
      ? plan
      : createRequestPlan(plan);

    // 策略检查在任何 IO 之前发生
    this.#policy.assert(normalized.url, normalized.method);

    // 熔断检查紧随策略之后、仍在任何 IO 之前。
    // 顺序有意义：策略违规不该计入熔断（那是配置错误，不是对方挂了），
    // 所以必须先让策略把违规请求挡掉。
    this.#breaker.assert(normalized.url);

    if (options.requireCredentials === true) {
      this.#credentials.require(normalized.url);
    }

    const prepared = this.#prepare(normalized);

    let attempt = 0;
    let lastError = null;
    const attempts = [];

    while (attempt < this.#retry.maxAttempts) {
      attempt += 1;
      const startedAt = Date.now();

      let releaseSlot = null;
      try {
        // 限流在每次**尝试**内取许可：每次重试都是一次新请求。
        // 放在 send() 外面只会限住"逻辑请求数"，重试就绕过了限速。
        releaseSlot = await this.#rateLimiter.acquire(prepared.url, {
          signal: options.signal,
        });
        const response = await this.#transport.send(prepared, { signal: options.signal });
        this.#cookieJar.acceptFromResponse(prepared.url, response);

        attempts.push({
          attempt,
          status: response.status,
          durationMs: Date.now() - startedAt,
          error: null,
        });

        this.#breaker.record(prepared.url, { response });

        if (this.#retry.shouldRetry({ attempt, method: prepared.method, response })) {
          const delay = this.#retry.delayFor({ attempt, response });
          this.#record(prepared, { response, attempt, retriedAfterMs: delay });
          await this.#sleep(delay);
          continue;
        }

        const result = Object.freeze({
          request: prepared,
          response,
          attempts: Object.freeze(attempts.map((entry) => Object.freeze(entry))),
          redirected: response.redirected,
        });
        this.#record(prepared, { response, attempt });
        return result;
      } catch (error) {
        const collectorError = error instanceof CollectorError
          ? error
          : new CollectorError(
            CollectorErrorCode.REQUEST_FAILED,
            `unexpected transport error: ${error.message}`,
            { cause: error, retryable: false }
          );

        attempts.push({
          attempt,
          status: null,
          durationMs: Date.now() - startedAt,
          error: collectorError.code,
        });
        lastError = collectorError;
        this.#breaker.record(prepared.url, { error: collectorError });

        // 策略违规立即失败，绝不重试
        if (collectorError.isPolicyViolation) {
          this.#record(prepared, { error: collectorError, attempt });
          throw collectorError;
        }

        if (this.#retry.shouldRetry({ attempt, method: prepared.method, error: collectorError })) {
          const delay = this.#retry.delayFor({ attempt });
          this.#record(prepared, { error: collectorError, attempt, retriedAfterMs: delay });
          await this.#sleep(delay);
          continue;
        }

        this.#record(prepared, { error: collectorError, attempt });
        throw collectorError;
      } finally {
        // 并发额度必须无条件归还——异常路径漏掉就会把 origin 的并发慢慢耗尽，
        // 表现为"跑一阵之后越来越慢直到卡死"，很难追。
        releaseSlot?.();
      }
    }

    const exhausted = new CollectorRetryExhaustedError(attempt, lastError);
    this.#record(prepared, { error: exhausted, attempt });
    throw exhausted;
  }

  /**
   * 注入凭据和会话 cookie，产出实际要发送的请求。
   * 凭据注入发生在策略检查之后，因此不会把凭据发往未授权 origin。
   */
  #prepare(plan) {
    const credentials = this.#credentials.resolve(plan.url);
    const jarCookies = this.#cookieJar.cookiesFor(plan.url);

    const headers = plan.headers.flatMap((entry) =>
      entry.values.map((value) => ({ name: entry.name, value }))
    );
    const cookies = new Map(plan.cookies.map((entry) => [entry.name, entry.value]));

    // 会话 cookie 优先级低于 plan 显式 cookie
    for (const [name, value] of jarCookies) {
      if (!cookies.has(name)) cookies.set(name, value);
    }

    if (credentials) {
      for (const [name, value] of credentials.headers) {
        headers.push({ name, value });
      }
      for (const [name, value] of credentials.cookies) {
        cookies.set(name, value);
      }
    }

    return createRequestPlan({
      method: plan.method,
      url: plan.url,
      headers,
      cookies: [...cookies.entries()].map(([name, value]) => ({ name, value })),
      body: plan.body,
      metadata: plan.metadata,
    });
  }

  /** 写入脱敏审计记录（有界） */
  #record(request, outcome) {
    if (this.#audit.length >= this.#limits.maxAuditEntries) {
      this.#audit.shift();
    }
    this.#audit.push(Object.freeze({
      timestamp: Date.now(),
      method: request.method,
      url: request.url,
      origin: request.origin,
      headers: redactHeaders(request.headers),
      cookies: redactCookies(request.cookies),
      attempt: outcome.attempt ?? 1,
      status: outcome.response?.status ?? null,
      errorCode: outcome.error?.code ?? null,
      retriedAfterMs: outcome.retriedAfterMs ?? null,
      contentType: outcome.response
        ? getResponseHeader(outcome.response, 'content-type') ?? null
        : null,
    }));
  }

  /** 审计日志快照（已脱敏） */
  audit() {
    return [...this.#audit];
  }

  /** 诊断快照：策略、重试、凭据键名，不含任何凭据值 */
  describe() {
    return {
      disposed: this.#disposed,
      policy: this.#policy.describe(),
      retry: this.#retry.describe(),
      credentials: this.#credentials.describe(),
      cookies: this.#cookieJar.describe(),
      limits: { ...this.#limits },
      auditEntries: this.#audit.length,
    };
  }

  /** 释放资源。幂等。 */
  async dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#audit.length = 0;
    this.#cookieJar.clear();
    if (typeof this.#transport.dispose === 'function') {
      await this.#transport.dispose();
    }
  }
}

/**
 * 便捷构造
 * @param {object} config
 * @returns {Collector}
 */
export function createCollector(config) {
  return new Collector(config);
}
