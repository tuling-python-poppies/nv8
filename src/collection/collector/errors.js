/**
 * Collector layer errors
 *
 * Collector 是唯一拥有真实网络出口的层，因此它的错误必须清楚区分
 * "策略拒绝" 与 "网络失败"：前者是配置/权限问题，后者是可重试的传输问题。
 */

import { DiagnosticError } from '../../engine/core/diagnostics/errors.js';

export const CollectorErrorCode = {
  // 权限与策略（不可重试）
  ORIGIN_NOT_ALLOWED: 'ERR_NV8_COLLECTOR_ORIGIN_NOT_ALLOWED',
  SCHEME_NOT_ALLOWED: 'ERR_NV8_COLLECTOR_SCHEME_NOT_ALLOWED',
  METHOD_NOT_ALLOWED: 'ERR_NV8_COLLECTOR_METHOD_NOT_ALLOWED',
  NETWORK_DISABLED: 'ERR_NV8_COLLECTOR_NETWORK_DISABLED',
  CREDENTIAL_NOT_FOUND: 'ERR_NV8_COLLECTOR_CREDENTIAL_NOT_FOUND',
  CREDENTIAL_ORIGIN_MISMATCH: 'ERR_NV8_COLLECTOR_CREDENTIAL_ORIGIN_MISMATCH',
  REDIRECT_NOT_ALLOWED: 'ERR_NV8_COLLECTOR_REDIRECT_NOT_ALLOWED',

  // 配置
  INVALID_CONFIG: 'ERR_NV8_COLLECTOR_INVALID_CONFIG',
  INVALID_PLAN: 'ERR_NV8_COLLECTOR_INVALID_PLAN',
  TRANSPORT_MISSING: 'ERR_NV8_COLLECTOR_TRANSPORT_MISSING',

  // 执行（部分可重试）
  REQUEST_FAILED: 'ERR_NV8_COLLECTOR_REQUEST_FAILED',
  REQUEST_TIMEOUT: 'ERR_NV8_COLLECTOR_REQUEST_TIMEOUT',
  RETRY_EXHAUSTED: 'ERR_NV8_COLLECTOR_RETRY_EXHAUSTED',
  CIRCUIT_OPEN: 'ERR_NV8_COLLECTOR_CIRCUIT_OPEN',
  RESPONSE_TOO_LARGE: 'ERR_NV8_COLLECTOR_RESPONSE_TOO_LARGE',
  // 本地背压：队列/并发限流是我们这一侧的节流，不是目标故障。
  // 用独立错误码以便熔断器硬排除，也便于调用方区分退避原因。
  RATE_LIMITED: 'ERR_NV8_COLLECTOR_RATE_LIMITED',

  // 代理故障必须与目标故障分开。混在一起的话，一个代理挂掉会让熔断器
  // 跳闸所有 origin 并归咎于目标——运维看到"所有站点都挂了"，
  // 实际只是一个代理不通。
  PROXY_CONNECT_FAILED: 'ERR_NV8_COLLECTOR_PROXY_CONNECT_FAILED',
  PROXY_AUTH_FAILED: 'ERR_NV8_COLLECTOR_PROXY_AUTH_FAILED',
  PROXY_EXHAUSTED: 'ERR_NV8_COLLECTOR_PROXY_EXHAUSTED',
  REDIRECT_LIMIT: 'ERR_NV8_COLLECTOR_REDIRECT_LIMIT',
  ABORTED: 'ERR_NV8_COLLECTOR_ABORTED',
  DISPOSED: 'ERR_NV8_COLLECTOR_DISPOSED',
};

/** 判定该错误码是否代表策略拒绝（永不重试） */
const POLICY_CODES = new Set([
  CollectorErrorCode.ORIGIN_NOT_ALLOWED,
  CollectorErrorCode.SCHEME_NOT_ALLOWED,
  CollectorErrorCode.METHOD_NOT_ALLOWED,
  CollectorErrorCode.NETWORK_DISABLED,
  CollectorErrorCode.CREDENTIAL_NOT_FOUND,
  CollectorErrorCode.CREDENTIAL_ORIGIN_MISMATCH,
  CollectorErrorCode.REDIRECT_NOT_ALLOWED,
  CollectorErrorCode.INVALID_CONFIG,
  CollectorErrorCode.INVALID_PLAN,
  CollectorErrorCode.TRANSPORT_MISSING,
  CollectorErrorCode.DISPOSED,
]);

export class CollectorError extends DiagnosticError {
  constructor(code, message, details = {}) {
    super(code, message, details);
    this.name = 'CollectorError';
    this.retryable = details.retryable === true;
  }

  get isPolicyViolation() {
    return POLICY_CODES.has(this.code);
  }
}

export class CollectorPolicyError extends CollectorError {
  constructor(code, message, details = {}) {
    super(code, message, { ...details, retryable: false });
    this.name = 'CollectorPolicyError';
  }
}

export class CollectorConfigError extends CollectorError {
  constructor(reason, details = {}) {
    super(
      CollectorErrorCode.INVALID_CONFIG,
      `Invalid collector config: ${reason}`,
      { ...details, retryable: false }
    );
    this.name = 'CollectorConfigError';
  }
}

export class CollectorRequestError extends CollectorError {
  constructor(code, message, details = {}) {
    super(code, message, details);
    this.name = 'CollectorRequestError';
  }
}

export class CollectorTimeoutError extends CollectorRequestError {
  constructor(timeoutMs, details = {}) {
    super(
      CollectorErrorCode.REQUEST_TIMEOUT,
      `Request timed out after ${timeoutMs}ms`,
      { ...details, retryable: true, limit: timeoutMs }
    );
    this.name = 'CollectorTimeoutError';
  }
}

export class CollectorRetryExhaustedError extends CollectorError {
  constructor(attempts, lastError) {
    super(
      CollectorErrorCode.RETRY_EXHAUSTED,
      `Retries exhausted after ${attempts} attempt(s): ${lastError?.message ?? 'unknown error'}`,
      {
        retryable: false,
        context: { attempts, lastErrorCode: lastError?.code ?? null },
        cause: lastError,
      }
    );
    this.name = 'CollectorRetryExhaustedError';
    this.attempts = attempts;
    this.lastError = lastError ?? null;
  }
}
