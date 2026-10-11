export class NetworkPolicy {
  constructor(options?: Record<string, unknown>);
  check(url: string, method: string): { allowed: boolean; code?: string; reason?: string };
  assert(url: string, method: string): void;
}

export const CircuitState: Record<string, string>;

export class RetryPolicy {
  constructor(options?: Record<string, unknown>);
}

export class CircuitBreaker {
  constructor(options?: Record<string, unknown>);
}

export class RateLimiter {
  constructor(options?: Record<string, unknown>);
}

export class PaginationScheduler {
  constructor(options?: Record<string, unknown>);
  pages(): AsyncIterable<unknown>;
}

export class CookieJar {
  constructor(options?: Record<string, unknown>);
}

export class ProxyPool {
  constructor(options?: Record<string, unknown>);
}

export const ProxyProtocol: {
  readonly HTTP: string;
  readonly HTTPS: string;
  readonly SOCKS5: string;
};

export const RotationStrategy: Record<string, string>;
export const SENSITIVE_HEADERS: ReadonlySet<string>;
export const REDACTED: string;

export class CredentialStore {
  constructor(options?: Record<string, unknown>);
}

export class PaginationStop extends Error {}

export class Collector {
  constructor(options?: Record<string, unknown>);
  send(plan: unknown, options?: Record<string, unknown>): Promise<unknown>;
  audit(): readonly unknown[];
  describe(): unknown;
  dispose(): Promise<void>;
}

export function createCollector(options?: Record<string, unknown>): Collector;
export function createFetchTransport(options?: Record<string, unknown>): unknown;
export function createWebSocketTransport(options?: Record<string, unknown>): unknown;
export function createStubTransport(routes?: unknown[]): unknown;
export function createCollectorResponse(input: Record<string, unknown>): unknown;
export function createProxyTransport(options?: Record<string, unknown>): unknown;
export function connectThroughProxy(options?: Record<string, unknown>): Promise<unknown>;
export function isProxyError(error: unknown): boolean;
export function parseProxy(value: string): unknown;
export function redactUrl(value: string): string;
export function createBatchingResultSink(options: Record<string, unknown>): unknown;
export function createMemoryResultSink(options?: Record<string, unknown>): unknown;
export function createNdjsonResultSink(options: Record<string, unknown>): unknown;
export function keyByFields(...fields: string[]): (value: unknown) => string;
export function readNdjsonKeys(path: string, options?: Record<string, unknown>): Promise<unknown>;
export const CHECKPOINT_SCHEMA_VERSION: string;
export function createCheckpoint(input: Record<string, unknown>): unknown;
export function createFileCheckpointStore(options: Record<string, unknown>): unknown;
export function createMemoryCheckpointStore(): unknown;
export function inspectCheckpoint(candidate: unknown, expectedFingerprint: string): { usable: boolean; reason: string | null };
export function jobFingerprint(value: unknown): string;
export const CollectorErrorCode: Record<string, string>;
export class CollectorError extends Error {}
export class CollectorPolicyError extends CollectorError {}
export class CollectorConfigError extends CollectorError {}
export class CollectorRequestError extends CollectorError {}
export class CollectorTimeoutError extends CollectorError {}
export class CollectorRetryExhaustedError extends CollectorError {}
export function assertTransport(transport: unknown): void;
export function assertCheckpointStore(store: unknown): void;
export function assertResultSink(sink: unknown): void;
export function getResponseHeader(response: unknown, name: string): string | undefined;
export function parseSetCookie(value: string, url?: string): unknown;
export function readRetryAfter(value: string | null, now?: number): number | null;
export function isSensitiveHeader(name: string): boolean;
export function redactCookies(cookies: unknown): unknown;
export function redactHeaders(headers: unknown): unknown;
export function redactRequestUrl(url: string): string;
export function registerSensitiveHeader(name: string): void;
