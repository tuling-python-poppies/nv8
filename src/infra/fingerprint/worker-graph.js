import { createHash } from "node:crypto";

/**
 * Stable, serializable identity for a Worker/Worklet module graph.
 *
 * The digest deliberately includes only graph metadata and the module-cache
 * index. Realm objects, connection counts, timing data and insertion order are
 * not part of the identity: those values are runtime state, not a graph
 * version, and would make the fingerprint unstable across equivalent runs.
 */
const WORKER_GRAPH_FINGERPRINT_VERSION = 1;

export function createWorkerGraphFingerprint({
  kind,
  url,
  name = "",
  type = "classic",
  browserMajorVersion = null,
  modules = [],
  moduleCache = [],
}) {
  const normalized = {
    version: WORKER_GRAPH_FINGERPRINT_VERSION,
    kind: `${kind}`,
    url: `${url}`,
    name: `${name}`,
    type: `${type}`,
    browserMajorVersion: Number.isSafeInteger(browserMajorVersion)
      ? browserMajorVersion
      : null,
    modules: normalizeStrings(modules),
    moduleCache: normalizeCache(moduleCache),
  };
  const canonical = JSON.stringify(normalized);
  const digest = createHash("sha256").update(canonical, "utf8").digest("hex");
  return Object.freeze({
    version: WORKER_GRAPH_FINGERPRINT_VERSION,
    digest,
    graph: Object.freeze({
      kind: normalized.kind,
      url: normalized.url,
      name: normalized.name,
      type: normalized.type,
      browserMajorVersion: normalized.browserMajorVersion,
      modules: Object.freeze([...normalized.modules]),
    }),
    cache: Object.freeze({
      moduleCount: normalized.moduleCache.length,
      modules: Object.freeze(normalized.moduleCache.map((entry) => entry.url)),
    }),
  });
}

function normalizeStrings(values) {
  return [...new Set(Array.from(values, (value) => `${value}`))].sort(compareStrings);
}

function normalizeCache(values) {
  return Array.from(values, (entry) => ({
    url: `${entry.url}`,
    status: `${entry.status ?? "unknown"}`,
  })).sort((left, right) => compareStrings(left.url, right.url) || compareStrings(left.status, right.status));
}

function compareStrings(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
