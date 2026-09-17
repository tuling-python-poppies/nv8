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

import { createRequestPlan, isRequestPlan } from '../request-protocol/request-plan.js';
import { CredentialStore, redactCookies, redactHeaders, redactRequestUrl } from './credentials.js';
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
  CollectorRequestError,
  CollectorRetryExhaustedError,
} from './errors.js';
import { awaitWithSignal, cancellableDelay, throwIfCancelled } from './cancellation.js';

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
  #active = new Map();
  #disposal = null;

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

    this.#sleep = config.sleep ?? cancellableDelay;
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
    const controller = new AbortController();
    const onAbort = () => controller.abort(options.signal.reason);
    if (options.signal?.aborted) onAbort();
    else options.signal?.addEventListener('abort', onAbort, { once: true });
    const operation = this.#send(plan, { ...options, signal: controller.signal });
    this.#active.set(controller, operation);
    try {
      return await operation;
    } finally {
      this.#active.delete(controller);
      options.signal?.removeEventListener('abort', onAbort);
    }
  }

  async #send(plan, options) {
    this.#assertActive();
    throwIfCancelled(options.signal);

    const normalized = isRequestPlan(plan)
      ? plan
      : createRequestPlan(plan);

    // 策略检查在任何 IO 之前发生
    this.#policy.assert(normalized.url, normalized.method);

    // 凭据要求在取熔断探针之前检查：配置错误不该占用 half-open 探针
    if (options.requireCredentials === true) {
      this.#credentials.require(normalized.url);
    }

    let attempt = 0;
    let lastError = null;
    const attempts = [];
    let prepared = normalized;

    while (attempt < this.#retry.maxAttempts) {
      this.#assertActive();
      throwIfCancelled(options.signal);
      attempt += 1;
      const startedAt = Date.now();
      try {
        prepared = this.#prepare(normalized);
        const { response, redirected } = await this.#sendFollowingRedirects(
          prepared, normalized, options.signal,
        );

        attempts.push({
          attempt,
          status: response.status,
          durationMs: Date.now() - startedAt,
          error: null,
        });

        if (this.#retry.shouldRetry({
          attempt,
          method: normalized.method,
          response,
        })) {
          const delay = this.#retry.delayFor({ attempt, response });
          this.#record(prepared, { response, attempt, retriedAfterMs: delay });
          await awaitWithSignal(() => this.#sleep(delay, options.signal), options.signal);
          continue;
        }

        const result = Object.freeze({
          request: prepared,
          response,
          attempts: Object.freeze(attempts.map((entry) => Object.freeze(entry))),
          redirected: redirected || response.redirected,
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
        // 策略违规立即失败，绝不重试
        if (collectorError.isPolicyViolation) {
          this.#record(prepared, { error: collectorError, attempt });
          throw collectorError;
        }

        if (this.#retry.shouldRetry({ attempt, method: normalized.method, error: collectorError })) {
          const delay = this.#retry.delayFor({ attempt });
          this.#record(prepared, { error: collectorError, attempt, retriedAfterMs: delay });
          await awaitWithSignal(() => this.#sleep(delay, options.signal), options.signal);
          continue;
        }

        this.#record(prepared, { error: collectorError, attempt });
        throw collectorError;
      }
    }

    const exhausted = new CollectorRetryExhaustedError(attempt, lastError);
    this.#record(prepared, { error: exhausted, attempt });
    throw exhausted;
  }

  /**
   * 发送请求并按 NetworkPolicy 跟随重定向。
   *
   * 传输层固定 `redirect: 'manual'`，重定向语义集中在这里：
   * - 每一跳都重新过 `assertRedirect`（followRedirects 开关、目标 origin 的
   *   allowlist、跨 origin 默认拒绝），重定向不能成为绕过准入的后门
   * - 超过 `maxRedirects` 抛 REDIRECT_LIMIT
   * - 跨源时丢弃显式 header/cookie，此后不再从初始 plan 恢复。
   *   目标源的凭据与 jar cookie 由 #prepare 重新解析。
   * - 303 以及 301/302 的 POST 改成 GET，清除 body 及其专用 header。
   *
   * @param {object} prepared 已完成凭据/cookie 注入的首跳计划
   * @param {object} plan 已规范化的原始 RequestPlan（用于重建后续跳）
   * @param {AbortSignal|undefined} signal
   * @returns {Promise<{response: object, request: object, redirected: boolean}>}
   */
  async #sendFollowingRedirects(prepared, plan, signal) {
    let current = prepared;
    let redirected = false;
    let redirects = 0;
    // 只保存仍有效的显式值；已注入的凭据不能成为下一源的显式值。
    let headers = plan.headers.flatMap(entry =>
      entry.values.map(value => ({ name: entry.name, value })));
    let cookies = plan.cookies.map(entry => ({ ...entry }));
    let body = plan.body;
    let bodyDiscarded = false;

    for (;;) {
      this.#assertActive();
      throwIfCancelled(signal);
      const release = await this.#rateLimiter.acquire(current.url, { signal });
      let response;
      let checked = false;
      try {
        this.#assertActive();
        throwIfCancelled(signal);
        this.#breaker.assert(current.url);
        checked = true;
        response = await awaitWithSignal(
          () => this.#transport.send(current, { signal }), signal,
        );
        this.#assertActive();
        throwIfCancelled(signal);
        this.#breaker.record(current.url, { response });
      } catch (error) {
        if (checked) this.#breaker.record(current.url, { error });
        throw error;
      } finally {
        release();
      }
      this.#cookieJar.acceptFromResponse(current.url, response);
      const location = getResponseHeader(response, 'location');
      if (!REDIRECT_STATUS.has(response.status) || location == null
          || !this.#policy.followRedirects) {
        return { response, request: current, redirected };
      }
      if (++redirects > this.#policy.maxRedirects) {
        throw new CollectorRequestError(
          CollectorErrorCode.REDIRECT_LIMIT,
          `redirect limit of ${this.#policy.maxRedirects} exceeded`,
          { retryable: false, context: { url: redactRequestUrl(current.url), redirects } },
        );
      }
      let nextUrl;
      try {
        nextUrl = new URL(location, current.url).href;
      } catch {
        throw new CollectorRequestError(
          CollectorErrorCode.REDIRECT_NOT_ALLOWED,
          'redirect location is not a valid URL',
          { retryable: false, context: { fromUrl: redactRequestUrl(current.url) } },
        );
      }
      const nextMethod = redirectMethod(response.status, current.method);
      this.#policy.assertRedirect(current.url, nextUrl, nextMethod);
      if (new URL(nextUrl).origin !== current.origin) {
        headers = [];
        cookies = [];
      }
      if (nextMethod !== current.method) {
        body = null;
        bodyDiscarded = true;
        headers = headers.filter(entry => !REQUEST_BODY_HEADERS.has(entry.name));
      }
      current = this.#prepare(createRequestPlan({
        method: nextMethod, url: nextUrl, headers, cookies, body, metadata: plan.metadata,
      }), bodyDiscarded);
      redirected = true;
    }
  }

  /**
   * 注入凭据和会话 cookie，产出实际要发送的请求。
   * 凭据注入发生在策略检查之后，因此不会把凭据发往未授权 origin。
   */
  #prepare(plan, discardBodyHeaders = false) {
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

    // 凭据只**填空缺**：优先级是 plan 显式 header/cookie > jar > 凭据。
    // 无条件追加会让 plan 的 Authorization 被凭据覆盖、产生重复 Authorization；
    // 无条件覆盖 cookie 会把调用方显式值换掉。
    if (credentials) {
      const presentHeaders = new Set(headers.map((entry) => entry.name));
      for (const [name, value] of credentials.headers) {
        if (discardBodyHeaders && REQUEST_BODY_HEADERS.has(name)) continue;
        if (presentHeaders.has(name)) continue;
        headers.push({ name, value });
      }
      for (const [name, value] of credentials.cookies) {
        if (!cookies.has(name)) cookies.set(name, value);
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
    if (this.#disposed) return;
    if (this.#audit.length >= this.#limits.maxAuditEntries) {
      this.#audit.shift();
    }
    this.#audit.push(Object.freeze({
      timestamp: Date.now(),
      method: request.method,
      url: redactRequestUrl(request.url),
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
  dispose() {
    if (this.#disposal !== null) return this.#disposal;
    this.#disposed = true;
    const error = new CollectorPolicyError(
      CollectorErrorCode.DISPOSED,
      'collector has been disposed',
    );
    for (const controller of this.#active.keys()) controller.abort(error);
    this.#audit.length = 0;
    this.#cookieJar.clear();
    this.#disposal = (async () => {
      await Promise.allSettled(this.#active.values());
      await this.#transport.dispose?.();
    })();
    return this.#disposal;
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

/** 需要跟随的重定向状态码。 */
const REDIRECT_STATUS = new Set([301, 302, 303, 307, 308]);
const REQUEST_BODY_HEADERS = new Set([
  'content-encoding', 'content-language', 'content-location', 'content-type',
  'content-length', 'transfer-encoding',
]);

/**
 * 重定向后的方法语义（与 Fetch 对齐）：
 * 303 一律改为 GET（HEAD 保持）；301/302 的 POST 改为 GET；
 * 307/308 保持原方法（因此 body 也要保留）。
 *
 * @param {number} status
 * @param {string} method
 * @returns {string}
 */
function redirectMethod(status, method) {
  if (method === 'HEAD') return method;
  if (status === 303) return 'GET';
  if ((status === 301 || status === 302) && method === 'POST') return 'GET';
  return method;
}
