import { createHash } from "node:crypto";

const MANIFEST_SCHEMA = "nv8.target-manifest/v1";
const EVIDENCE_SCHEMA = "nv8.reverse-evidence/v1";
const MAX_ID_BYTES = 256;
const MAX_REASON_BYTES = 4096;
const MAX_PATCHES = 128;
const MAX_CAUSAL_EVENTS = 10_000;
const MAX_SOURCE_BYTES = 50 * 1024 * 1024;
const SENSITIVE_KEY = /(?:authorization|cookie|token|secret|password|credential|signature|(^|[-_])x-s(?:[-_]|$)|(^|[-_])x-t(?:[-_]|$)|a1|webssk|b1)/iu;
const REQUEST_BODY_KEY = /^(?:body|bodytext|bodybase64|payload|requestbody)$/iu;

export const TARGET_MANIFEST_SCHEMA = MANIFEST_SCHEMA;
export const REVERSE_EVIDENCE_SCHEMA = EVIDENCE_SCHEMA;

export function sha256Text(source) {
  if (typeof source !== "string") throw new TypeError("source must be a string");
  return createHash("sha256").update(source, "utf8").digest("hex");
}

export function createTargetArtifactManifest(input = {}) {
  assertKeys(input, ["targetId", "source", "sourceName", "sourceSha256", "patches", "metadata"], "manifest");
  const source = input.source ?? null;
  if (source !== null && (typeof source !== "string" || Buffer.byteLength(source, "utf8") > MAX_SOURCE_BYTES)) {
    throw new RangeError(`source must be a string up to ${MAX_SOURCE_BYTES} bytes`);
  }
  const sourceSha256 = input.sourceSha256 ?? (source === null ? null : sha256Text(source));
  if (sourceSha256 !== null && !/^[a-f0-9]{64}$/u.test(sourceSha256)) {
    throw new TypeError("sourceSha256 must be a lowercase SHA-256 digest");
  }
  const patches = normalizePatches(input.patches ?? []);
  const manifest = {
    schemaVersion: MANIFEST_SCHEMA,
    targetId: boundedString(input.targetId, "targetId", MAX_ID_BYTES),
    sourceName: input.sourceName === undefined || input.sourceName === null
      ? null
      : boundedString(input.sourceName, "sourceName", MAX_ID_BYTES),
    sourceSha256,
    patches,
    metadata: deepFreeze(plainJson(input.metadata ?? {}, "metadata")),
  };
  return Object.freeze({
    ...manifest,
    digest: digest(manifest),
  });
}

export function validateTargetArtifactManifest(manifest) {
  if (manifest === null || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new TypeError("manifest must be an object");
  }
  if (manifest.schemaVersion !== MANIFEST_SCHEMA) {
    throw new TypeError(`manifest.schemaVersion must be ${MANIFEST_SCHEMA}`);
  }
  assertKeys(manifest, ["schemaVersion", "targetId", "sourceName", "sourceSha256", "patches", "metadata", "digest"], "manifest");
  if (typeof manifest.digest !== "string" || manifest.digest !== digest({
    schemaVersion: manifest.schemaVersion,
    targetId: manifest.targetId,
    sourceName: manifest.sourceName ?? null,
    sourceSha256: manifest.sourceSha256 ?? null,
    patches: manifest.patches ?? [],
    metadata: manifest.metadata ?? {},
  })) {
    throw new TypeError("manifest.digest does not match manifest content");
  }
  createTargetArtifactManifest({
    targetId: manifest.targetId,
    sourceName: manifest.sourceName ?? null,
    sourceSha256: manifest.sourceSha256 ?? null,
    patches: manifest.patches ?? [],
    metadata: manifest.metadata ?? {},
  });
  return manifest;
}

export function applyTargetPatches(source, manifest, context = {}) {
  if (typeof source !== "string") throw new TypeError("source must be a string");
  validateTargetArtifactManifest(manifest);
  const actualHash = sha256Text(source);
  if (manifest.sourceSha256 !== null && actualHash !== manifest.sourceSha256) {
    const error = new Error("target source SHA-256 does not match manifest");
    error.code = "TARGET_SOURCE_DIGEST_MISMATCH";
    error.expected = manifest.sourceSha256;
    error.actual = actualHash;
    throw error;
  }
  let output = source;
  const applied = [];
  for (const patch of manifest.patches) {
    if (patch.sourceSha256 !== null && patch.sourceSha256 !== actualHash) {
      throw new Error(`patch ${patch.id} is bound to a different source digest`);
    }
    const beforeSha256 = sha256Text(output);
    if (patch.find === "") throw new TypeError(`patch ${patch.id} find must not be empty`);
    const occurrences = countOccurrences(output, patch.find);
    if (occurrences !== patch.expectedOccurrences) {
      const error = new Error(
        `patch ${patch.id} expected ${patch.expectedOccurrences} occurrence(s), found ${occurrences}`,
      );
      error.code = "TARGET_PATCH_OCCURRENCE_MISMATCH";
      throw error;
    }
    output = patch.all
      ? output.split(patch.find).join(patch.replace)
      : output.replace(patch.find, patch.replace);
    applied.push(Object.freeze({
      id: patch.id,
      reason: patch.reason,
      scope: patch.scope,
      sourceSha256: actualHash,
      beforeSha256,
      afterSha256: sha256Text(output),
      occurrences,
    }));
  }
  return Object.freeze({
    source: output,
    sourceSha256: actualHash,
    applied: Object.freeze(applied),
    context: plainJson(context, "context"),
  });
}

export async function collectReverseEvidence(input = {}) {
  const sandbox = input.sandbox;
  if (sandbox === null || typeof sandbox !== "object") {
    throw new TypeError("collectReverseEvidence requires a sandbox");
  }
  const [trace, requests, resources] = await Promise.all([
    typeof sandbox.proxyTrace === "function" ? sandbox.proxyTrace() : [],
    typeof sandbox.networkRequests === "function" ? sandbox.networkRequests() : [],
    typeof sandbox.resources === "function" ? sandbox.resources() : null,
  ]);
  const includeSensitive = input.includeSensitive === true;
  const causalInput = input.causal && typeof input.causal.snapshot === "function"
    ? input.causal.snapshot()
    : input.causal ?? [];
  const environment = describeOptions(input.environment ?? sandbox.options ?? {});
  const evidence = {
    schemaVersion: EVIDENCE_SCHEMA,
    targetId: input.targetId ?? null,
    sourceSha256: input.sourceSha256 ?? null,
    manifestDigest: input.manifestDigest ?? null,
    redaction: includeSensitive ? "original" : "redacted",
    environment,
    patches: input.patches ?? [],
    trace: sanitizeValue(trace, includeSensitive, "trace"),
    requests: sanitizeRequests(requests, includeSensitive),
    resources: sanitizeValue(resources, includeSensitive, "resources"),
    runtimeErrors: sanitizeValue(input.runtimeErrors ?? [], includeSensitive, "runtimeErrors"),
    causal: sanitizeValue(causalInput, includeSensitive, "causal"),
    acceptance: sanitizeValue(input.acceptance ?? null, includeSensitive, "acceptance"),
  };
  return Object.freeze({
    ...evidence,
    digest: digest(evidence),
  });
}

export function createReverseEvidenceDiff(before, after) {
  const left = jsonValue(before, "before");
  const right = jsonValue(after, "after");
  const changes = [];
  diffValue(left, right, [], changes);
  return Object.freeze({
    schemaVersion: "nv8.reverse-evidence-diff/v1",
    changed: changes.length > 0,
    changes: Object.freeze(changes.map(change => Object.freeze(change))),
  });
}

export function createCausalRecorder(options = {}) {
  const maxEvents = Number.isSafeInteger(options.maxEvents)
    ? Math.max(1, Math.min(MAX_CAUSAL_EVENTS, options.maxEvents))
    : MAX_CAUSAL_EVENTS;
  const events = [];
  let sequence = 0;
  let nextId = 0;
  const open = new Map();

  function add(type, kind, attributes, parentId = null) {
    if (events.length >= maxEvents) events.shift();
    const entry = {
      id: `causal-${++nextId}`,
      sequence: ++sequence,
      type,
      kind: boundedString(kind, "causal kind", MAX_ID_BYTES),
      parentId: parentId ?? null,
      attributes: deepFreeze(plainJson(attributes ?? {}, "causal attributes")),
      timestamp: Date.now(),
    };
    events.push(entry);
    return entry;
  }

  return Object.freeze({
    startSpan(kind, attributes = {}, parentId = null) {
      const entry = add("span.start", kind, attributes, parentId);
      open.set(entry.id, entry);
      return entry.id;
    },
    event(kind, attributes = {}, parentId = null) {
      return add("event", kind, attributes, parentId).id;
    },
    endSpan(id, attributes = {}) {
      const start = open.get(id);
      if (start === undefined) {
        const error = new Error(`unknown or already closed causal span: ${id}`);
        error.code = "CAUSAL_SPAN_NOT_FOUND";
        throw error;
      }
      open.delete(id);
      add("span.end", start.kind, attributes, id);
      return id;
    },
    snapshot() {
      return Object.freeze(events.map(entry => Object.freeze({ ...entry })));
    },
    clear() {
      events.length = 0;
      open.clear();
    },
  });
}

function normalizePatches(value) {
  if (!Array.isArray(value) || value.length > MAX_PATCHES) throw new TypeError("patches must be an array with at most 128 entries");
  return Object.freeze(value.map((patch, index) => {
    if (patch === null || typeof patch !== "object" || Array.isArray(patch)) throw new TypeError(`patches[${index}] must be an object`);
    assertKeys(patch, ["id", "reason", "scope", "sourceSha256", "find", "replace", "expectedOccurrences", "all"], `patches[${index}]`);
    const find = boundedString(patch.find, `patches[${index}].find`, 1024 * 1024);
    const replace = boundedString(patch.replace, `patches[${index}].replace`, 1024 * 1024);
    const expectedOccurrences = patch.expectedOccurrences ?? 1;
    if (!Number.isSafeInteger(expectedOccurrences) || expectedOccurrences < 1) throw new TypeError(`patches[${index}].expectedOccurrences must be positive`);
    if (patch.sourceSha256 !== undefined && patch.sourceSha256 !== null && !/^[a-f0-9]{64}$/u.test(patch.sourceSha256)) {
      throw new TypeError(`patches[${index}].sourceSha256 must be a lowercase SHA-256 digest`);
    }
    const scope = patch.scope ?? "target-source";
    if (typeof scope !== "string" || scope.length === 0) throw new TypeError(`patches[${index}].scope must be a non-empty string`);
    return Object.freeze({
      id: boundedString(patch.id, `patches[${index}].id`, MAX_ID_BYTES),
      reason: boundedString(patch.reason, `patches[${index}].reason`, MAX_REASON_BYTES),
      scope,
      sourceSha256: patch.sourceSha256 ?? null,
      find,
      replace,
      expectedOccurrences,
      all: patch.all === true,
    });
  }));
}

function countOccurrences(source, token) {
  let count = 0;
  let offset = 0;
  while ((offset = source.indexOf(token, offset)) !== -1) {
    count += 1;
    offset += token.length;
  }
  return count;
}

function describeOptions(options) {
  const fingerprint = options.fingerprint ?? {};
  const navigator = fingerprint.navigator ?? {};
  const screen = fingerprint.screen ?? {};
  return {
    browserMajorVersion: fingerprint.browserMajorVersion ?? null,
    locale: fingerprint.locale ?? null,
    timezone: fingerprint.timezone ?? null,
    userAgent: navigator.userAgent ?? null,
    languages: Array.isArray(navigator.languages) ? [...navigator.languages] : [],
    webdriver: navigator.webdriver ?? null,
    screen: {
      width: screen.width ?? null,
      height: screen.height ?? null,
      availWidth: screen.availWidth ?? null,
      availHeight: screen.availHeight ?? null,
    },
  };
}

function sanitizeRequests(records, includeSensitive) {
  if (!Array.isArray(records)) return sanitizeValue(records, includeSensitive, "requests");
  return records.map(record => {
    if (record === null || typeof record !== "object" || Array.isArray(record)) {
      return sanitizeValue(record, includeSensitive, "request");
    }
    const output = {};
    for (const [key, value] of Object.entries(record)) {
      if (!includeSensitive && (REQUEST_BODY_KEY.test(key) || SENSITIVE_KEY.test(key))) {
        output[key] = "[redacted]";
      } else if (key === "url" && typeof value === "string" && !includeSensitive) {
        output[key] = redactUrl(value);
      } else if (key === "headers") {
        output[key] = sanitizeHeaders(value, includeSensitive);
      } else {
        output[key] = sanitizeValue(value, includeSensitive, key);
      }
    }
    return output;
  });
}

function sanitizeHeaders(headers, includeSensitive) {
  if (includeSensitive) return jsonValue(headers, "headers");
  if (Array.isArray(headers)) {
    return headers.map(pair => {
      if (!Array.isArray(pair)) return sanitizeValue(pair, false, "header");
      return [pair[0], SENSITIVE_KEY.test(`${pair[0]}`) ? "[redacted]" : pair[1]];
    });
  }
  if (headers && typeof headers === "object") {
    return Object.fromEntries(Object.entries(headers).map(([name, value]) => [
      name,
      SENSITIVE_KEY.test(name) ? "[redacted]" : value,
    ]));
  }
  return headers;
}

function redactUrl(value) {
  try {
    const url = new URL(value);
    for (const key of [...url.searchParams.keys()]) {
      if (SENSITIVE_KEY.test(key)) url.searchParams.set(key, "[redacted]");
    }
    url.username = "";
    url.password = "";
    return url.href;
  } catch {
    return value;
  }
}

function sanitizeValue(value, includeSensitive, key = "value", state = null) {
  if (includeSensitive) return jsonValue(value, key);
  if (SENSITIVE_KEY.test(key) || REQUEST_BODY_KEY.test(key)) return "[redacted]";
  if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number") {
    return key === "url" && typeof value === "string" ? redactUrl(value) : value;
  }
  const current = state ?? { seen: new WeakSet(), depth: 0 };
  if (current.depth >= 8) return "[truncated]";
  if (typeof value === "object" && current.seen.has(value)) return "[circular]";
  if (typeof value === "object") current.seen.add(value);
  if (Array.isArray(value)) {
    const result = value.slice(0, 256).map(item => sanitizeValue(item, false, key, {
      seen: current.seen,
      depth: current.depth + 1,
    }));
    if (typeof value === "object") current.seen.delete(value);
    return result;
  }
  if (typeof value === "object") {
    const result = Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [
      childKey,
      sanitizeValue(childValue, false, childKey, {
        seen: current.seen,
        depth: current.depth + 1,
      }),
    ]));
    current.seen.delete(value);
    return result;
  }
  return String(value);
}

function diffValue(before, after, path, changes) {
  if (Object.is(before, after)) return;
  if (before === undefined) {
    changes.push({ path: formatPath(path), kind: "added", after });
    return;
  }
  if (after === undefined) {
    changes.push({ path: formatPath(path), kind: "removed", before });
    return;
  }
  if (before === null || after === null || typeof before !== "object" || typeof after !== "object") {
    changes.push({ path: formatPath(path), kind: "changed", before, after });
    return;
  }
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  for (const key of keys) diffValue(before[key], after[key], [...path, key], changes);
}

function formatPath(path) {
  return path.length === 0 ? "$" : `$${path.map(key => `[${JSON.stringify(key)}]`).join("")}`;
}

function digest(value) {
  return createHash("sha256").update(stableJson(value), "utf8").digest("hex");
}

function stableJson(value) {
  return JSON.stringify(value, (_key, item) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]]));
    }
    return item;
  });
}

function jsonValue(value, name) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    throw new TypeError(`${name} must be JSON serializable: ${error.message}`);
  }
}

function plainJson(value, name) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new TypeError(`${name} must be a plain object`);
  return jsonValue(value, name);
}

function assertKeys(value, allowed, name) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) throw new TypeError(`${name}.${key} is not supported`);
  }
}

function deepFreeze(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function boundedString(value, name, maxBytes) {
  if (typeof value !== "string" || value.length === 0) throw new TypeError(`${name} must be a non-empty string`);
  if (Buffer.byteLength(value, "utf8") > maxBytes) throw new RangeError(`${name} exceeds ${maxBytes} bytes`);
  return value;
}
