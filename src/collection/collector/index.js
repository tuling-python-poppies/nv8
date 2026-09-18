/**
 * NV8 Collector Layer
 *
 * 唯一拥有真实网络出口的层。执行 Protocol 产出的 RequestPlan，
 * 并强制 allowlist、凭据边界、重试策略和审计。
 *
 * 安全边界：策略与凭据由部署配置提供，不可被目标脚本、Evidence
 * manifest 或 Protocol 适配器修改。
 */

export { Collector, createCollector } from './collector.js';

export { NetworkPolicy } from './network-policy.js';

export {
  CredentialStore,
  SENSITIVE_HEADERS,
  REDACTED,
  isSensitiveHeader,
  redactCookies,
  redactHeaders,
  redactRequestUrl,
  registerSensitiveHeader,
} from './credentials.js';

export { RetryPolicy, readRetryAfter } from './retry-policy.js';

export {
  CircuitBreaker,
  CircuitState,
} from './circuit-breaker.js';

export { RateLimiter } from './rate-limiter.js';

export {
  PaginationScheduler,
  PaginationStop,
} from './pagination.js';

export { createProxyTransport } from './proxy-transport.js';
export { createWebSocketTransport } from './websocket-transport.js';

export {
  ProxyPool,
  ProxyProtocol,
  RotationStrategy,
  connectThroughProxy,
  isProxyError,
  parseProxy,
  redactUrl,
} from './proxy.js';

export {
  assertResultSink,
  createBatchingResultSink,
  createMemoryResultSink,
  createNdjsonResultSink,
  keyByFields,
  readNdjsonKeys,
} from './result-sink.js';

export {
  CHECKPOINT_SCHEMA_VERSION,
  assertCheckpointStore,
  createCheckpoint,
  createFileCheckpointStore,
  createMemoryCheckpointStore,
  inspectCheckpoint,
  jobFingerprint,
} from './checkpoint.js';

export { CookieJar, parseSetCookie } from './cookie-jar.js';

export {
  assertTransport,
  createCollectorResponse,
  createFetchTransport,
  createStubTransport,
  getResponseHeader,
  withTimeout,
} from './transport.js';

export {
  CollectorErrorCode,
  CollectorError,
  CollectorPolicyError,
  CollectorConfigError,
  CollectorRequestError,
  CollectorTimeoutError,
  CollectorRetryExhaustedError,
} from './errors.js';
