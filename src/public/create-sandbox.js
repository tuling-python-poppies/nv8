import { EdgeSandbox } from "./edge-sandbox.js";
import { drainWorkerThreadPool } from "../backend/controller/worker-thread-pool.js";

/**
 * Convenience wrapper — makes EdgeSandbox as easy to use as iv8.
 *
 * Usage:
 *   const sb = await createSandbox("https://example.com");
 *   const val = await sb.run("document.title");        // → "Example"
 *   const num = await sb.run("1 + 1");                 // → 2
 *   await sb.navigate("https://other.com/page");
 *   const reqs = await sb.requests();
 *   await sb.close();
 */
export async function createSandbox(url, options = {}) {
  const resolved = resolveOptions(url, options);
  const sandbox = await EdgeSandbox.create(resolved);
  return new Sandbox(sandbox);
}

/** Drain idle worker threads so the process can exit. */
createSandbox.drain = drainWorkerThreadPool;

function resolveOptions(url, options) {
  const pageUrl = typeof url === "string" ? url : url?.url ?? "https://sandbox.test/";
  const pageHtml = (typeof url === "object" && url !== null) ? url.html : undefined;

  const normalized = { ...options };

  // Top-level backend shorthand: 'worker-thread' | 'child-process'
  if (typeof normalized.backend === "string") {
    normalized.execution = { backend: normalized.backend };
    delete normalized.backend;
  }

  // Top-level timeout shorthand (ms)
  if (normalized.timeout !== undefined) {
    normalized.limits = { ...normalized.limits, timeoutMs: normalized.timeout };
    delete normalized.timeout;
  }

  // Top-level heap shorthand (MB → bytes)
  if (normalized.heap !== undefined) {
    normalized.limits = {
      ...normalized.limits,
      maxHeapBytes: normalized.heap * 1024 * 1024,
    };
    delete normalized.heap;
  }

  // page from URL string
  normalized.page = {
    url: pageUrl,
    ...(pageHtml !== undefined ? { html: pageHtml } : {}),
    ...normalized.page,
  };

  // replay shorthand: array of { url, body, status?, headers? }
  // or object map { url: body } for simple GET responses
  if (normalized.replay && !Array.isArray(normalized.replay)) {
    const map = normalized.replay;
    normalized.replay = Object.entries(map).map(([replayUrl, body]) => ({
      method: "GET",
      url: replayUrl,
      status: 200,
      body: typeof body === "string" ? body : JSON.stringify(body),
      headers: typeof body === "string"
        ? {}
        : { "content-type": "application/json" },
    }));
  }

  return normalized;
}

class Sandbox {
  constructor(inner) {
    this._inner = inner;
  }

  /** Access the underlying EdgeSandbox for advanced operations */
  get raw() {
    return this._inner;
  }

  /** Current options (read-only) */
  get options() {
    return this._inner.options;
  }

  /**
   * Evaluate code and return the raw value directly.
   * - Primitives return as-is: number, string, boolean, null, undefined
   * - Non-serializable values return undefined
   * - Promises are awaited automatically
   *
   * await sb.run("1+1")          → 2
   * await sb.run("'hello'")      → "hello"
   * await sb.run("null")         → null
   * await sb.run("({a:1})")      → undefined (non-primitive)
   */
  async run(source) {
    const result = await this._inner.evaluate(source);
    return result.value;
  }

  /**
   * Evaluate and return the full typed result { type, value }.
   * Same as EdgeSandbox.evaluate().
   */
  async eval(source) {
    return this._inner.evaluate(source);
  }

  /**
   * Evaluate multiple scripts in sequence, return raw values.
   */
  async runAll(sources) {
    if (!Array.isArray(sources)) throw new TypeError('sources must be an array');
    const results = [];
    for (const source of sources) results.push(await this.run(source));
    return results;
  }

  /**
   * Evaluate as ES module.
   */
  async runModule(source, url) {
    const result = await this._inner.evaluateModule(source, url);
    return result.value;
  }

  /**
   * Navigate to a new page (resets realm, preserves cookies/storage).
   * Accepts a URL string or a page object { url, html?, referrer? }.
   */
  async navigate(page) {
    const pageObj = typeof page === "string" ? { url: page } : page;
    return this._inner.setPage(pageObj);
  }

  /** Alias for navigate */
  async setPage(page) {
    return this.navigate(page);
  }

  /**
   * Get captured network requests.
   * Returns array of { method, url, body, bodyText, status, headers, ... }
   */
  async requests() {
    return this._inner.networkRequests();
  }

  /** Clear captured network requests */
  async clearRequests() {
    return this._inner.clearNetworkRequests();
  }

  /** Enable API proxy tracing */
  async startTrace() {
    return this._inner.enableProxyTrace();
  }

  /** Stop API proxy tracing */
  async stopTrace() {
    return this._inner.disableProxyTrace();
  }

  /** Read trace records */
  async trace() {
    return this._inner.proxyTrace();
  }

  /** Clear trace records */
  async clearTrace() {
    return this._inner.clearProxyTrace();
  }

  /** Open the child-process V8 inspector and return its CDP WebSocket URL. */
  async openInspector(options) {
    return this._inner.openInspector(options);
  }

  /** Close the sandbox and release resources */
  async close() {
    return this._inner.close();
  }

  /**
   * Drain the idle worker thread pool.
   * Call after closing all sandboxes to let the process exit cleanly.
   */
  static drain() {
    drainWorkerThreadPool();
  }

  async [Symbol.asyncDispose]() {
    await this.close();
  }
}
