export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export const ArtifactKind: Record<string, string>;
export const BodyEncoding: Record<string, string>;
export const TransformKind: Record<string, string>;
export const PROTOCOL_SCHEMA_VERSION: string;
export const REQUEST_PLAN_SCHEMA_VERSION: string;

export function canonicalJson(value: unknown): string;
export function canonicalDigest(value: unknown): string;
export function createRuntimeArtifact(options: Record<string, unknown>): unknown;
export function createArtifactSet(options?: Record<string, unknown>): unknown;
export function createRequestPlan(options: Record<string, unknown>): unknown;
export function createTransform(kind: string, options?: Record<string, unknown>): unknown;
export function defineProtocolAdapter(options: Record<string, unknown>): unknown;
export function createProtocolRegistry(adapters?: unknown[]): unknown;
export function protocolResultToJSON(result: unknown): unknown;

export class ProtocolError extends Error {}
export class ArtifactInvalidError extends ProtocolError {}
export class ArtifactExpiredError extends ProtocolError {}
export class ProtocolDefinitionError extends ProtocolError {}
export class TransformError extends ProtocolError {}
export const ProtocolErrorCode: Record<string, string>;
