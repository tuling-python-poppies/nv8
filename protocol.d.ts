export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export const ArtifactKind: Record<string, string>;
export const BodyEncoding: Record<string, string>;
export const TransformKind: Record<string, string>;
export const PROTOCOL_SCHEMA_VERSION: string;
export const REQUEST_PLAN_SCHEMA_VERSION: string;
export const ARTIFACT_SCHEMA_VERSION: string;
export const DEFAULT_ARTIFACT_LIMITS: Record<string, number>;
export const DEFAULT_REQUEST_PLAN_LIMITS: Record<string, number>;
export const DEFAULT_TRANSFORM_LIMITS: Record<string, number>;

export class ArtifactSet {
  constructor(options?: Record<string, unknown>);
  readonly limits: Record<string, number>;
  readonly size: number;
  readonly totalBytes: number;
  add(input: Record<string, unknown>): unknown;
  get(id: string): unknown;
  require(id: string): unknown;
  has(id: string): boolean;
  byKind(kind: string): readonly unknown[];
}

export class ProtocolRegistry {
  constructor(adapters?: unknown[]);
  register(adapter: unknown): this;
  has(id: string): boolean;
  get(id: string): unknown;
  require(id: string): unknown;
  ids(): readonly string[];
  readonly size: number;
  apply(options: Record<string, unknown>): unknown;
  lock(): unknown;
}

export function canonicalJson(value: unknown): string;
export function canonicalDigest(value: unknown): string;
export function canonicalByteLength(value: unknown): number;
export function createRuntimeArtifact(options: Record<string, unknown>): unknown;
export function createArtifactSet(options?: Record<string, unknown>): ArtifactSet;
export function createRequestPlan(options: Record<string, unknown>): unknown;
export function createTransform(kind: string, options?: Record<string, unknown>): unknown;
export function defineProtocolAdapter(options: Record<string, unknown>): unknown;
export function createProtocolRegistry(adapters?: unknown[]): unknown;
export function protocolResultToJSON(result: unknown): unknown;
export function applyTransforms(plan: unknown, transforms: unknown[], options?: Record<string, unknown>): unknown;
export function findTransformConflicts(transforms: unknown[]): readonly unknown[];
export function transformsDigest(transforms: unknown[]): string;
export function diffRequestPlans(before: unknown, after: unknown): readonly unknown[];
export function getHeader(plan: unknown, name: string): string | null;
export function getHeaderValues(plan: unknown, name: string): readonly string[];
export function getCookie(plan: unknown, name: string): string | null;
export function requestPlanToJSON(plan: unknown): unknown;
export function assertAdapterRequirements(adapter: unknown, artifacts: unknown): void;
export function checkAdapterRequirements(adapter: unknown, artifacts: unknown): unknown;
export function serializeArtifact(value: unknown): unknown;
export function serializeArtifactToJson(value: unknown): string;
export function deserializeArtifact(value: unknown): unknown;
export function parseArtifactSchemaVersion(value: string): unknown;
export function isArtifactSchemaCompatible(value: string): boolean;
export function isArtifactExpired(value: unknown, now?: number): boolean;
export function assertArtifactFresh(value: unknown, now?: number): void;
export function parseProtocolSchemaVersion(value: string): unknown;
export function isProtocolSchemaCompatible(value: string): boolean;
export function assertProtocolSchemaCompatible(value: string): void;

export class ProtocolError extends Error {}
export class ArtifactInvalidError extends ProtocolError {}
export class ArtifactExpiredError extends ProtocolError {}
export class ProtocolDefinitionError extends ProtocolError {}
export class TransformError extends ProtocolError {}
export const ProtocolErrorCode: Record<string, string>;
