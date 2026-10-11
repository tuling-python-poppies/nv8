export interface AgentSession {
  readonly snapshot: unknown;
  evaluate<T = unknown>(source: string): Promise<T>;
  compareEnvironment(source: string, patch?: unknown): Promise<unknown>;
  observe(): Promise<unknown>;
  applyEnvironmentPatch(patch: unknown): Promise<unknown>;
  rollback(): Promise<unknown>;
  watchApis(list?: string[]): Promise<unknown>;
  openInspector(options?: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

export function createAgentSession(options?: Record<string, unknown>): Promise<AgentSession>;
export function validateEnvironmentPatch(patch: unknown): unknown;
