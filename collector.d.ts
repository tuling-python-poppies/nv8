export class NetworkPolicy {
  constructor(options?: Record<string, unknown>);
  check(url: string, method: string): { allowed: boolean; code?: string; reason?: string };
  assert(url: string, method: string): void;
}

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
export const CollectorErrorCode: Record<string, string>;
export class CollectorError extends Error {}
export class CollectorPolicyError extends CollectorError {}
export class CollectorConfigError extends CollectorError {}
export class CollectorRequestError extends CollectorError {}
