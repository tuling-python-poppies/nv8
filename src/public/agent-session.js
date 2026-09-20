import { EdgeSandbox } from "./edge-sandbox.js";
import { normalizeRuntimeOptions } from "./edge-runtime-options.js";
import { Buffer } from "node:buffer";

const PATCHABLE_FIELDS = new Set(["page", "fingerprint", "replay"]);
const TOP_LEVEL_WRAPPER_KEYS = new Set(["agent", "sandbox", "maxHistory"]);
const FLAT_AGENT_KEYS = new Set([
  "agentId", "agentVersion", "agentCapabilities", "id", "version", "capabilities",
]);
const FORBIDDEN_KEYS = new Set(["__proto__", "prototype", "constructor"]);
const MAX_REASON_BYTES = 4 * 1024;
const MAX_AGENT_STRING_BYTES = 1024;
const MAX_AGENT_CAPABILITIES = 64;
const MAX_HISTORY = 64;
let sessionSequence = 0;

/**
 * Host-side control plane for an Agent. It never installs values into a Realm;
 * environment changes are validated and applied through the public Sandbox API.
 *
 * Permission boundary: the ONLY thing that constrains an Agent is the patchable
 * field whitelist (page / fingerprint / replay). `agentCapabilities` is
 * advisory audit metadata and does not grant or restrict any operation.
 */
export async function createAgentSession(options = {}) {
  assertRecord(options, "options");
  // 两种输入形式：显式 `{ agent, sandbox }`，或扁平的 agent 字段（无 sandbox）。
  // 混用时（如 `{ agentId, page }` 忘了包 sandbox）旧实现会静默丢弃
  // sandbox 字段。这是信任边界上的暗坑，改为 fail closed。
  const usesWrapper = options.agent !== undefined || options.sandbox !== undefined;
  for (const key of Object.keys(options)) {
    const allowed = usesWrapper
      ? TOP_LEVEL_WRAPPER_KEYS.has(key)
      : FLAT_AGENT_KEYS.has(key) || key === "maxHistory";
    if (!allowed) {
      throw new TypeError(
        `createAgentSession: unexpected top-level option "${key}"; `
        + "sandbox options must go under { sandbox: {...} }",
      );
    }
  }
  const agent = normalizeAgent(options.agent ?? options);
  const sandboxOptions = options.sandbox ?? {};
  assertRecord(sandboxOptions, "options.sandbox");
  const maxHistory = normalizeHistoryLimit(options.maxHistory);
  const sandbox = await EdgeSandbox.create(sandboxOptions);
  return new AgentSession({
    agent,
    sandbox,
    maxHistory,
  });
}

export function validateEnvironmentPatch(patch) {
  const input = cloneJson(patch, "patch");
  assertRecord(input, "patch");
  const allowedFields = new Set(["baseVersion", "reason", "auditId", "expiresAt", "changes"]);
  for (const field of Object.keys(input)) {
    if (!allowedFields.has(field)) {
      throw new TypeError(`patch.${field} is not allowed`);
    }
  }
  if (!Number.isSafeInteger(input.baseVersion) || input.baseVersion < 0) {
    throw new TypeError("patch.baseVersion must be a non-negative integer");
  }
  if (typeof input.reason !== "string" || input.reason.trim().length === 0) {
    throw new TypeError("patch.reason must be a non-empty string");
  }
  if (Buffer.byteLength(input.reason, "utf8") > MAX_REASON_BYTES) {
    throw new RangeError("patch.reason exceeds 4096 bytes");
  }
  if (input.auditId !== undefined) {
    assertBoundedString(input.auditId, "patch.auditId", MAX_AGENT_STRING_BYTES);
  }
  if (input.expiresAt !== undefined) {
    assertBoundedString(input.expiresAt, "patch.expiresAt", MAX_AGENT_STRING_BYTES);
    const expiresAt = Date.parse(input.expiresAt);
    if (!Number.isFinite(expiresAt)) {
      throw new TypeError("patch.expiresAt must be an ISO date string");
    }
    if (expiresAt <= Date.now()) {
      throw createSessionError("ERR_NV8_AGENT_PATCH_EXPIRED", "patch.expiresAt has passed");
    }
  }
  assertRecord(input.changes, "patch.changes");
  const fields = Object.keys(input.changes);
  if (fields.length === 0) {
    throw new TypeError("patch.changes must not be empty");
  }
  for (const field of fields) {
    if (!PATCHABLE_FIELDS.has(field)) {
      throw new TypeError(
        `patch.changes.${field} is not patchable; allowed fields: ${[...PATCHABLE_FIELDS].join(", ")}`,
      );
    }
  }
  return Object.freeze({
    baseVersion: input.baseVersion,
    reason: input.reason,
    auditId: input.auditId ?? null,
    expiresAt: input.expiresAt ?? null,
    changes: deepFreeze(input.changes),
  });
}

class AgentSession {
  constructor({ agent, sandbox, maxHistory }) {
    this.id = `nv8-agent-session-${++sessionSequence}`;
    this.agent = agent;
    this.sandbox = sandbox;
    this.options = sandbox.options;
    this.version = 0;
    this.traceEnabled = this.options.proxyTrace.enabled;
    this.watchedApis = [];
    this.history = [];
    this.versions = new Map([[0, this.options]]);
    this.maxHistory = maxHistory;
    this.closed = false;
    this.queue = Promise.resolve();
  }

  get snapshot() {
    return this.describe();
  }

  describe() {
    const fingerprint = this.options.fingerprint;
    const navigator = fingerprint.navigator;
    const screen = fingerprint.screen;
    return {
      schemaVersion: 1,
      sessionId: this.id,
      agent: this.agent,
      environmentVersion: this.version,
      page: { ...this.options.page },
      fingerprint: {
        browserMajorVersion: fingerprint.browserMajorVersion,
        locale: fingerprint.locale,
        timezone: fingerprint.timezone,
        navigator: {
          userAgent: navigator.userAgent,
          languages: [...navigator.languages],
          webdriver: navigator.webdriver,
        },
        screen: {
          width: screen.width,
          height: screen.height,
          availWidth: screen.availWidth,
          availHeight: screen.availHeight,
          colorDepth: screen.colorDepth,
          pixelDepth: screen.pixelDepth,
        },
      },
      replay: { entryCount: this.options.replay.length },
      controls: {
        traceEnabled: this.traceEnabled,
        watchedApis: [...this.watchedApis],
      },
      history: this.history.map(entry => ({ ...entry })),
    };
  }

  async evaluate(source) {
    return this.runExclusive(async () => {
      this.assertOpen();
      return toSerializable(await this.sandbox.evaluate(source));
    });
  }

  async observe() {
    return this.runExclusive(async () => {
      this.assertOpen();
      const [trace, requests] = await Promise.all([
        this.sandbox.proxyTrace(),
        this.sandbox.networkRequests(),
      ]);
      return toSerializable({
        environment: this.describe(),
        trace,
        requests,
        resources: this.sandbox.resources(),
      });
    });
  }

  async setPage(page, reason = "agent page update") {
    return this.applyEnvironmentPatch({
      baseVersion: this.version,
      reason,
      changes: { page },
    });
  }

  async applyEnvironmentPatch(patch) {
    return this.runExclusive(async () => {
      this.assertOpen();
      const normalizedPatch = validateEnvironmentPatch(patch);
      if (normalizedPatch.baseVersion !== this.version) {
        throw createSessionError(
          "ERR_NV8_AGENT_VERSION_CONFLICT",
          `patch targets environment version ${normalizedPatch.baseVersion}, current version is ${this.version}`,
        );
      }
      const nextOptions = normalizeRuntimeOptions({
        ...deepMerge(this.options, normalizedPatch.changes),
        proxyTrace: {
          ...this.options.proxyTrace,
          enabled: this.traceEnabled,
        },
      });
      const mode = await this.installOptions(nextOptions);
      return this.commitChange({
        baseVersion: normalizedPatch.baseVersion,
        reason: normalizedPatch.reason,
        changedPaths: Object.keys(normalizedPatch.changes),
        mode,
        auditId: normalizedPatch.auditId,
        expiresAt: normalizedPatch.expiresAt,
      });
    });
  }

  async rollback(targetVersion, reason = `rollback to environment version ${targetVersion}`) {
    return this.runExclusive(async () => {
      this.assertOpen();
      if (!Number.isSafeInteger(targetVersion) || targetVersion < 0) {
        throw new TypeError("targetVersion must be a non-negative integer");
      }
      const target = this.versions.get(targetVersion);
      if (target === undefined) {
        throw createSessionError(
          "ERR_NV8_AGENT_VERSION_NOT_FOUND",
          `environment version ${targetVersion} is no longer retained`,
        );
      }
      const nextOptions = normalizeRuntimeOptions({
        ...target,
        proxyTrace: {
          ...target.proxyTrace,
          enabled: this.traceEnabled,
        },
      });
      const mode = await this.installOptions(nextOptions);
      return this.commitChange({
        baseVersion: this.version,
        reason,
        changedPaths: ["rollback"],
        mode,
        targetVersion,
      });
    });
  }

  async enableTrace() {
    return this.runExclusive(async () => {
      this.assertOpen();
      await this.sandbox.enableProxyTrace();
      this.traceEnabled = true;
      return this.describe();
    });
  }

  async disableTrace() {
    return this.runExclusive(async () => {
      this.assertOpen();
      await this.sandbox.disableProxyTrace();
      this.traceEnabled = false;
      return this.describe();
    });
  }

  async clearTrace() {
    return this.runExclusive(async () => {
      this.assertOpen();
      await this.sandbox.clearProxyTrace();
      return this.describe();
    });
  }

  async watchApis(list) {
    return this.runExclusive(async () => {
      this.assertOpen();
      this.watchedApis = await this.sandbox.watchApis(list);
      return this.describe();
    });
  }

  async openInspector(options) {
    return this.runExclusive(async () => {
      this.assertOpen();
      return toSerializable(await this.sandbox.openInspector(options));
    });
  }

  async close() {
    return this.runExclusive(async () => {
      if (this.closed) return;
      this.closed = true;
      await this.sandbox.close();
    });
  }

  async installOptions(nextOptions) {
    const requiresRecreate = !sameJson(
      this.options.fingerprint,
      nextOptions.fingerprint,
    ) || !sameJson(this.options.replay, nextOptions.replay);

    if (!requiresRecreate) {
      if (!sameJson(this.options.page, nextOptions.page)) {
        await this.sandbox.setPage(nextOptions.page);
      }
      this.options = this.sandbox.options;
      return "reset-realm";
    }

    const replacement = await EdgeSandbox.create(nextOptions);
    try {
      await replacement.watchApis(this.watchedApis);
    } catch (error) {
      await replacement.close().catch(() => {});
      throw error;
    }
    const previous = this.sandbox;
    this.sandbox = replacement;
    this.options = replacement.options;
    await previous.close();
    return "recreate-sandbox";
  }

  commitChange({ baseVersion, reason, changedPaths, mode, targetVersion = null, auditId = null, expiresAt = null }) {
    const version = this.version + 1;
    this.version = version;
    this.versions.set(version, this.options);
    const entry = Object.freeze({
      auditId: auditId ?? `${this.id}:${version}`,
      version,
      baseVersion,
      reason,
      changedPaths: Object.freeze([...changedPaths]),
      mode,
      ...(expiresAt === null ? {} : { expiresAt }),
      ...(targetVersion === null ? {} : { targetVersion }),
    });
    this.history.push(entry);
    while (this.history.length > this.maxHistory) {
      const removed = this.history.shift();
      this.versions.delete(removed.version);
    }
    return {
      applied: true,
      change: entry,
      environment: this.describe(),
    };
  }

  runExclusive(operation) {
    const next = this.queue.then(operation, operation);
    this.queue = next.catch(() => {});
    return next;
  }

  assertOpen() {
    if (this.closed) {
      throw createSessionError("ERR_NV8_AGENT_SESSION_CLOSED", "Agent session is closed");
    }
  }
}

function normalizeAgent(input) {
  assertRecord(input, "agent");
  const agentId = input.agentId ?? input.id ?? "unknown";
  const agentVersion = input.agentVersion ?? input.version ?? "unknown";
  if (typeof agentId !== "string" || agentId.length === 0) {
    throw new TypeError("agentId must be a non-empty string");
  }
  if (typeof agentVersion !== "string" || agentVersion.length === 0) {
    throw new TypeError("agentVersion must be a non-empty string");
  }
  if (Buffer.byteLength(agentId, "utf8") > MAX_AGENT_STRING_BYTES) {
    throw new RangeError("agentId exceeds 1024 bytes");
  }
  if (Buffer.byteLength(agentVersion, "utf8") > MAX_AGENT_STRING_BYTES) {
    throw new RangeError("agentVersion exceeds 1024 bytes");
  }
  // agentCapabilities 是**仅供审计的建议值**：它记录 agent 声称要做什么，
  // 进入 describe() 和变更历史，但**不参与鉴权**——不授予也不限制任何方法。
  // 权限边界完全由 EnvironmentPatch 的 patchable 字段白名单强制
  // （只允许 page / fingerprint / replay）。等出现真实的分级授权需求，再从
  // assertOpen 收口点接 enforcement，并由真实调用方定义能力到方法的映射。
  const capabilities = input.agentCapabilities ?? input.capabilities ?? [];
  if (
    !Array.isArray(capabilities)
    || capabilities.length > MAX_AGENT_CAPABILITIES
    || capabilities.some(value => typeof value !== "string" || value.length === 0)
  ) {
    throw new TypeError("agentCapabilities must be a string array with at most 64 entries");
  }
  return Object.freeze({
    agentId,
    agentVersion,
    agentCapabilities: Object.freeze([...capabilities]),
  });
}

function normalizeHistoryLimit(value) {
  if (value === undefined) return MAX_HISTORY;
  if (!Number.isSafeInteger(value) || value < 1 || value > MAX_HISTORY) {
    throw new RangeError(`maxHistory must be an integer from 1 to ${MAX_HISTORY}`);
  }
  return value;
}

function assertRecord(value, name) {
  if (
    value === null
    || typeof value !== "object"
    || Array.isArray(value)
  ) {
    throw new TypeError(`${name} must be an object`);
  }
}

function cloneJson(value, path, seen = new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError(`${path} must contain finite numbers`);
    return value;
  }
  if (typeof value !== "object") {
    throw new TypeError(`${path} must be JSON-serializable`);
  }
  if (seen.has(value)) throw new TypeError(`${path} must not contain cycles`);
  seen.add(value);
  let result;
  if (Array.isArray(value)) {
    result = value.map((item, index) => cloneJson(item, `${path}[${index}]`, seen));
  } else {
    result = {};
    for (const key of Object.keys(value)) {
      if (FORBIDDEN_KEYS.has(key)) throw new TypeError(`${path}.${key} is not allowed`);
      result[key] = cloneJson(value[key], `${path}.${key}`, seen);
    }
  }
  seen.delete(value);
  return result;
}

function deepMerge(base, patch) {
  if (!isRecord(patch)) return patch;
  const result = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (!Object.prototype.hasOwnProperty.call(base, key)) {
      throw new TypeError(`patch.changes.${key} is not an allowed environment path`);
    }
    if (isRecord(value) && isRecord(base[key])) {
      result[key] = deepMerge(base[key], value);
    } else {
      result[key] = value;
    }
  }
  if (Array.isArray(patch.replay)) assertReplayPatch(patch.replay);
  return result;
}

function assertReplayPatch(replay) {
  const allowed = new Set([
    "method", "url", "status", "statusText", "headers", "requestHeaders",
    "requestBody", "requestBodySha256", "repeat", "sequence", "matching",
    "body", "redirected", "type",
  ]);
  for (const [index, entry] of replay.entries()) {
    assertRecord(entry, `patch.changes.replay[${index}]`);
    for (const key of Object.keys(entry)) {
      if (!allowed.has(key)) {
        throw new TypeError(
          `patch.changes.replay[${index}].${key} is not an allowed environment path`,
        );
      }
    }
  }
}

function deepFreeze(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function assertBoundedString(value, name, maxBytes) {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${name} must be a non-empty string`);
  }
  if (Buffer.byteLength(value, "utf8") > maxBytes) {
    throw new RangeError(`${name} exceeds ${maxBytes} bytes`);
  }
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function createSessionError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function toSerializable(value, seen = new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "bigint") return `${value}n`;
  if (value === undefined) return null;
  if (value instanceof Uint8Array) {
    return {
      type: "bytes",
      byteLength: value.byteLength,
      base64: Buffer.from(value).toString("base64"),
    };
  }
  if (typeof value !== "object") return String(value);
  if (seen.has(value)) return { type: "circular" };
  seen.add(value);
  let result;
  if (Array.isArray(value)) {
    result = value.map(item => toSerializable(item, seen));
  } else {
    result = {};
    for (const [key, item] of Object.entries(value)) {
      result[key] = toSerializable(item, seen);
    }
  }
  seen.delete(value);
  return result;
}
