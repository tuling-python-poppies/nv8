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

    // 凭据要求在取熔断探针之前检查：配置错误不该占用 half-open 探针
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
      let sentToTransport = false;
      try {
        // 限流在每次**尝试**内取许可：每次重试都是一次新请求。
        // 放在 send() 外面只会限住"逻辑请求数"，重试就绕过了限速。
        releaseSlot = await this.#rateLimiter.acquire(normalized.url, {
          signal: options.signal,
        });

        // 熔断检查移到真正发送之前，且每次尝试都做：
        // - half-open 探针在会真正发送时才取得，本地排队/配置失败不会泄漏它，
        //   否则该 origin 会永久停在半开、拒绝所有后续请求
        // - 重试不再绕过已跳闸的电路（在 breaker.assert 之后才发送）
        this.#breaker.assert(normalized.url);
        sentToTransport = true;

        const { response, redirected } =
          await this.#sendFollowingRedirects(prepared, normalized, options.signal);

        attempts.push({
          attempt,
          status: response.status,
          durationMs: Date.now() - startedAt,
          error: null,
        });

        this.#breaker.record(normalized.url, { response });

        if (this.#retry.shouldRetry({
          attempt,
          method: normalized.method,
          response,
        })) {
          const delay = this.#retry.delayFor({ attempt, response });
          this.#record(prepared, { response, attempt, retriedAfterMs: delay });
          await this.#sleep(delay);
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
        // 只有真正进入发送路径的失败才反馈给熔断器：CIRCUIT_OPEN / RATE_LIMITED
        // 等本地拒绝记录进去会误清并发探针的占用，或把本地节流当目标故障。
        if (sentToTransport) {
          this.#breaker.record(normalized.url, { error: collectorError });
        }

        // 策略违规立即失败，绝不重试
        if (collectorError.isPolicyViolation) {
          this.#record(prepared, { error: collectorError, attempt });
          throw collectorError;
        }

        if (this.#retry.shouldRetry({ attempt, method: normalized.method, error: collectorError })) {
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
   * 发送请求并按 NetworkPolicy 跟随重定向。
   *
   * 传输层固定 `redirect: 'manual'`，重定向语义集中在这里：
   * - 每一跳都重新过 `assertRedirect`（followRedirects 开关、目标 origin 的
   *   allowlist、跨 origin 默认拒绝），重定向不能成为绕过准入的后门
   * - 超过 `maxRedirects` 抛 REDIRECT_LIMIT
   * - 跨 origin 时丢弃原 plan 的显式 header/cookie，避免把 origin 绑定凭据
   *   带去新 origin；新 origin 的凭据与 jar cookie 由 #prepare 重新解析
   * - 303 以及 301/302 的 POST 按 Fetch 语义改成 GET 并丢弃 body
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

    for (;;) {
      const response = await this.#transport.send(current, { signal });
      // 每一跳的 Set-Cookie 都要入 jar，重定向链上的会话变更不能丢
      this.#cookieJar.acceptFromResponse(current.url, response);

      const location = getResponseHeader(response, 'location');
      if (
        !REDIRECT_STATUS.has(response.status)
        || location === undefined
        || location === null
      ) {
        return { response, request: current, redirected };
      }
      if (!this.#policy.followRedirects) {
        // 策略未开启跟随：3xx 是最终响应，原样返回
        return { response, request: current, redirected };
      }

      redirects += 1;
      if (redirects > this.#policy.maxRedirects) {
        throw new CollectorRequestError(
          CollectorErrorCode.REDIRECT_LIMIT,
          `redirect limit of ${this.#policy.maxRedirects} exceeded`,
          {
            retryable: false,
            context: { url: redactRequestUrl(current.url), redirects },
          }
        );
      }

      let nextUrl;
      try {
        nextUrl = new URL(location, current.url).href;
      } catch {
        throw new CollectorRequestError(
          CollectorErrorCode.REDIRECT_NOT_ALLOWED,
          'redirect location is not a valid URL',
          { retryable: false, context: { fromUrl: redactRequestUrl(current.url) } }
        );
      }

      // 逐跳校验：跟随时也必须过策略，且默认拒绝跨 origin
      this.#policy.assertRedirect(current.url, nextUrl, current.method);

      const sameOrigin = new URL(nextUrl).origin === current.origin;
      const nextMethod = redirectMethod(response.status, current.method);
      const keepBody = nextMethod === current.method;

      current = this.#prepare(createRequestPlan({
        method: nextMethod,
        url: nextUrl,
        headers: sameOrigin
          ? plan.headers.flatMap((entry) =>
            entry.values.map((value) => ({ name: entry.name, value })))
          : [],
        cookies: sameOrigin ? plan.cookies.map((entry) => ({ ...entry })) : [],
        body: keepBody ? plan.body : null,
        metadata: plan.metadata,
      }));
      redirected = true;
    }
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

    // 凭据只**填空缺**：优先级是 plan 显式 header/cookie > jar > 凭据。
    // 无条件追加会让 plan 的 Authorization 被凭据覆盖、产生重复 Authorization；
    // 无条件覆盖 cookie 会把调用方显式值换掉。
    if (credentials) {
      const presentHeaders = new Set(headers.map((entry) => entry.name));
      for (const [name, value] of credentials.headers) {
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

/** 需要跟随的重定向状态码。 */
const REDIRECT_STATUS = new Set([301, 302, 303, 307, 308]);

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
