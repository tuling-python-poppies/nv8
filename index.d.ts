export interface Fingerprint {
  browserMajorVersion: number;
  locale: string;
  timezone: string;
  navigator: Record<string, unknown>;
  screen: Record<string, unknown>;
  rendering: Record<string, unknown>;
  timing: Record<string, unknown>;
  capabilities: Record<string, unknown>;
}

export interface EvaluationResult<T = unknown> {
  type: "undefined" | "null" | "boolean" | "number" | "string" | "other";
  value: T;
}

export interface PageOptions {
  url?: string;
  html?: string;
  referrer?: string;
  contentType?: string;
}

export interface EdgeSandboxOptions {
  page?: PageOptions;
  fingerprint?: Fingerprint | Record<string, unknown>;
  replay?: unknown[] | Record<string, unknown>;
  execution?: { backend?: "child-process" | "worker-thread" };
  limits?: Record<string, number>;
  [key: string]: unknown;
}

export class EdgeSandbox {
  static create(options?: EdgeSandboxOptions): Promise<EdgeSandbox>;
  evaluate<T = unknown>(source: string): Promise<EvaluationResult<T>>;
  evaluateWithPayload<T = unknown>(source: string, payload?: Record<string, Uint8Array>): Promise<EvaluationResult<T>>;
  batchEvaluate(sources: string[]): Promise<EvaluationResult[]>;
  evaluateModule<T = unknown>(source: string, url?: string): Promise<EvaluationResult<T>>;
  setPage(page: PageOptions): Promise<void>;
  networkRequests(): Promise<readonly unknown[]>;
  clearNetworkRequests(): Promise<void>;
  resources(): Promise<unknown>;
  enableTrace(): Promise<void>;
  disableTrace(): Promise<void>;
  clearTrace(): Promise<void>;
  trace(): Promise<readonly unknown[]>;
  runtimeEvidence(options?: Record<string, unknown>): Promise<Record<string, unknown>>;
  openInspector(options?: { port?: number; host?: string }): Promise<{ url: string; alreadyOpen: boolean }>;
  watchApis(list?: string[]): Promise<string[]>;
  dispatchTrustedInput(type: string, init?: Record<string, unknown>): Promise<boolean>;
  close(): Promise<void>;
}

export interface QuickSandbox {
  readonly raw: EdgeSandbox;
  run<T = unknown>(source: string): Promise<T>;
  eval<T = unknown>(source: string): Promise<EvaluationResult<T>>;
  runAll<T = unknown>(sources: string[]): Promise<T[]>;
  runModule<T = unknown>(source: string, url?: string): Promise<T>;
  navigate(page: string | PageOptions): Promise<void>;
  setPage(page: string | PageOptions): Promise<void>;
  requests(): Promise<readonly unknown[]>;
  runtimeEvidence(options?: Record<string, unknown>): Promise<Record<string, unknown>>;
  close(): Promise<void>;
}

export function createSandbox(
  url?: string | PageOptions,
  options?: EdgeSandboxOptions,
): Promise<QuickSandbox>;

export namespace createSandbox {
  function drain(): void;
}

export interface Nv8Options extends EdgeSandboxOptions {
  appId?: string;
  plugins?: object[];
  profile?: string | ProfileManifest;
  profileId?: string;
  runtimeMode?: "legacy" | "plugin";
  capabilityPolicy?: "degrade" | "strict" | "ignore";
}

export interface ProfileManifest {
  id: string;
  version?: string;
  name?: string;
  description?: string;
  plugins?: unknown[];
  [key: string]: unknown;
}

export interface Profile extends ProfileManifest {
  schema: "nv8.profile/v1";
  version: string;
  name: string;
  digest: string;
}

export function createNv8(options?: Nv8Options): Promise<{
  sandbox: unknown;
  lockPlan: unknown;
  hostCapabilities: unknown;
  capabilityResolution: unknown;
  runtimeMode: "legacy" | "plugin";
  createRealm(options?: Record<string, unknown>): Promise<unknown>;
  eval<T = unknown>(code: string, options?: Record<string, unknown>): Promise<T>;
  destroy(): Promise<void>;
  inspect(): unknown;
}>;

export function nv8Eval<T = unknown>(code: string, options?: Nv8Options): Promise<T>;
export function createProfile(profile: string | ProfileManifest): Profile;
export const profiles: Record<string, Profile>;
export function resolveProfileCapabilities(profile: ProfileManifest, hostCapabilities: unknown, options?: Record<string, unknown>): unknown;
export const PROFILE_CAPABILITY_POLICIES: Record<string, string>;

export const minimalPreset: object[];
export const basicPreset: object[];
export const domPreset: object[];
export const networkPreset: object[];
export const fullPreset: object[];
export const defaultPreset: object[];

export const webidlPlugin: object;
export const errorsPlugin: object;
export const builtinsPlugin: object;
export const consolePlugin: object;
export const eventsPlugin: object;
export const abortPlugin: object;
export const domExceptionPlugin: object;
export const domCorePlugin: object;
export const domCollectionsPlugin: object;
export const domPlugin: object;
export const htmlPlugin: object;
export const htmlElementsPlugin: object;
export const canvasPlugin: object;
export const streamsPlugin: object;
export const timersPlugin: object;
export const storagePlugin: object;
export const fetchPlugin: object;
export const xhrPlugin: object;
export const websocketPlugin: object;
export const windowPlugin: object;
export const navigatorPlugin: object;
export const locationPlugin: object;
export const historyPlugin: object;
export const performancePlugin: object;
export const encodingPlugin: object;
export const urlPlugin: object;
export const cryptoPlugin: object;
export const messagingPlugin: object;
export const workerPlugin: object;
export const workletPlugin: object;
export const serviceWorkerPlugin: object;

export function createAgentSession(options?: Record<string, unknown>): Promise<import("./agent.js").AgentSession>;
export function validateEnvironmentPatch(patch: unknown): unknown;

export interface TargetPatch {
  id: string;
  reason: string;
  scope?: string;
  sourceSha256?: string | null;
  find: string;
  replace: string;
  expectedOccurrences?: number;
  all?: boolean;
}

export interface TargetArtifactManifest {
  schemaVersion: string;
  targetId: string;
  sourceName: string | null;
  sourceSha256: string | null;
  patches: readonly TargetPatch[];
  metadata: Record<string, unknown>;
  digest: string;
}

export interface TargetPatchResult {
  source: string;
  sourceSha256: string;
  applied: readonly Record<string, unknown>[];
  context: Record<string, unknown>;
}

export interface CausalRecorder {
  startSpan(kind: string, attributes?: Record<string, unknown>, parentId?: string | null): string;
  event(kind: string, attributes?: Record<string, unknown>, parentId?: string | null): string;
  endSpan(id: string, attributes?: Record<string, unknown>): string;
  snapshot(): readonly Record<string, unknown>[];
  clear(): void;
}

export const TARGET_MANIFEST_SCHEMA: string;
export const REVERSE_EVIDENCE_SCHEMA: string;
export function sha256Text(source: string): string;
export function createTargetArtifactManifest(input: {
  targetId: string;
  source?: string;
  sourceName?: string;
  sourceSha256?: string;
  patches?: readonly TargetPatch[];
  metadata?: Record<string, unknown>;
}): TargetArtifactManifest;
export function validateTargetArtifactManifest(manifest: TargetArtifactManifest): TargetArtifactManifest;
export function applyTargetPatches(source: string, manifest: TargetArtifactManifest, context?: Record<string, unknown>): TargetPatchResult;
export function collectReverseEvidence(input: Record<string, unknown> & { sandbox: unknown }): Promise<Record<string, unknown>>;
export function createReverseEvidenceDiff(before: unknown, after: unknown): Record<string, unknown>;
export function createCausalRecorder(options?: { maxEvents?: number }): CausalRecorder;

export const edge150Fingerprint: Readonly<Fingerprint>;
export const edge151Fingerprint: Readonly<Fingerprint>;
export const edge152Fingerprint: Readonly<Fingerprint>;
export const edge154Fingerprint: Readonly<Fingerprint>;

export * as protocol from "./protocol.js";
export * as collector from "./collector.js";
