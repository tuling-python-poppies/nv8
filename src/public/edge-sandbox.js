import { RuntimeController } from "../backend/controller/runtime-controller.js";
import {
  normalizeRuntimeOptions,
  normalizeSource,
} from "./edge-runtime-options.js";
import { toPublicEvaluationResult } from "./evaluation-result.js";
import { Buffer } from "node:buffer";

export class EdgeSandbox {
  static async create(options = {}) {
    const normalized = normalizeRuntimeOptions(options);
    const controller = new RuntimeController(normalized);
    try {
      await controller.start();
    } catch (error) {
      // start() 失败时 controller 已经建了一半：可能已拉起子进程 / 线程。
      // 不 close 就重抛会让这些资源失去唯一句柄。close() 对未启动成功的
      // 连接是安全的（就绪则发 CLOSE，否则 terminate）。
      try {
        await controller.close();
      } catch {
        // 清理失败不能覆盖原始错误——调用方要看到的是 init 失败的原因。
      }
      throw error;
    }
    return new EdgeSandbox(controller, normalized);
  }

  constructor(controller, options) {
    this.controller = controller;
    this.options = options;
  }

  async evaluate(source) {
    const normalized = normalizeSource(source, this.options.limits);
    return toPublicEvaluationResult(await this.controller.evaluate(normalized));
  }

  /**
   * 带命名二进制载荷求值：`payload` 是 `{ name: Uint8Array }`，
   * Realm 内在本次求值期间可通过 `globalThis.__nv8Payload` 读取。
   */
  async evaluateWithPayload(source, payload = {}) {
    const normalized = normalizeSource(source, this.options.limits);
    return toPublicEvaluationResult(
      await this.controller.evaluateWithPayload(
        normalized,
        normalizePayload(payload),
      ),
    );
  }

  async batchEvaluate(sources) {
    if (!Array.isArray(sources)) {
      throw new TypeError("sources must be an array of strings");
    }
    const normalized = sources.map((s) => normalizeSource(s, this.options.limits));
    const results = await this.controller.batchEvaluate(normalized);
    return results.map(toPublicEvaluationResult);
  }

  async evaluateModule(source, url = this.options.page.url) {
    const normalizedSource = normalizeSource(source, this.options.limits);
    if (typeof url !== "string") {
      throw new TypeError("module url must be a string");
    }
    return toPublicEvaluationResult(
      await this.controller.evaluateModule(normalizedSource, url),
    );
  }

  async setPage(page) {
    const replacement = normalizeRuntimeOptions({
      ...this.options,
      page,
    });
    await this.controller.setPage(replacement.page);
    this.options = replacement;
  }

  enableProxyTrace() {
    return this.controller.enableTrace();
  }

  disableProxyTrace() {
    return this.controller.disableTrace();
  }

  clearProxyTrace() {
    return this.controller.clearTrace();
  }

  async proxyTrace() {
    const records = await this.controller.readTrace();
    return Object.freeze(records.map((record) => Object.freeze({
      sequence: record.sequence,
      operation: record.operation,
      api: record.api,
      receiver: record.receiver,
      arguments: Object.freeze([...record.arguments]),
      result: record.result,
    })));
  }

  enableTrace() {
    return this.enableProxyTrace();
  }

  disableTrace() {
    return this.disableProxyTrace();
  }

  clearTrace() {
    return this.clearProxyTrace();
  }

  trace() {
    return this.proxyTrace();
  }

  async networkRequests() {
    const records = await this.controller.readNetworkRequests();
    return Object.freeze(records.map(toPublicNetworkRequest));
  }

  clearNetworkRequests() {
    return this.controller.clearNetworkRequests();
  }

  resources() {
    return this.controller.readResources();
  }

  /**
   * 在承载 Realm 的子进程里打开 V8 inspector，返回 CDP WebSocket 地址，
   * 供 Chrome DevTools（chrome://inspect 或 devtools://）连接下断点、单步、
   * 看作用域。仅 child-process 后端支持。
   *
   * @param {{ port?: number, host?: string }} [options] 端口默认 0（随机），
   *   host 默认 127.0.0.1。
   * @returns {Promise<{ url: string, alreadyOpen: boolean }>}
   */
  async openInspector(options = {}) {
    const result = await this.controller.openInspector(
      normalizeInspectorOptions(options),
    );
    return Object.freeze({
      url: result.url,
      alreadyOpen: result.alreadyOpen === true,
    });
  }

  /**
   * 设置 API 访问断点：当被追踪的浏览器 API（如 `navigator.userAgent`、
   * `document.cookie`、`toDataURL`）被读/写/调用时，如果已通过
   * `openInspector()` 附上调试器，则在访问处暂停。子串匹配 trace 的 api
   * 标签，不区分大小写。传空数组清除所有断点。
   *
   * 前提：需先 `enableTrace()`（断点建在追踪 hook 上）；且仅对 NV8 已追踪的
   * 表面生效，不是任意属性拦截。
   *
   * @param {string[]} list 要监视的 api 子串列表
   * @returns {Promise<string[]>} 当前生效的监视列表
   */
  async watchApis(list = []) {
    return this.controller.watchApis(normalizeWatchApis(list));
  }

  close() {
    return this.controller.close();
  }

  async [Symbol.asyncDispose]() {
    await this.close();
  }
}

function normalizeWatchApis(list) {
  if (!Array.isArray(list)) {
    throw new TypeError("watchApis expects an array of strings");
  }
  const normalized = [];
  for (const entry of list) {
    if (typeof entry !== "string" || entry.length === 0) {
      throw new TypeError("watchApis entries must be non-empty strings");
    }
    normalized.push(entry);
  }
  return normalized;
}

function normalizeInspectorOptions(options) {
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("openInspector options must be an object");
  }
  const normalized = Object.create(null);
  if (options.port !== undefined) {
    if (!Number.isInteger(options.port) || options.port < 0 || options.port > 65_535) {
      throw new RangeError("openInspector port must be an integer in [0, 65535]");
    }
    normalized.port = options.port;
  }
  if (options.host !== undefined) {
    if (typeof options.host !== "string") {
      throw new TypeError("openInspector host must be a string");
    }
    normalized.host = options.host;
  }
  return normalized;
}

function normalizePayload(payload) {
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    throw new TypeError("payload must be a record of name → Uint8Array");
  }
  const normalized = {};
  for (const [name, bytes] of Object.entries(payload)) {
    if (!(bytes instanceof Uint8Array)) {
      throw new TypeError(`payload.${name} must be a Uint8Array`);
    }
    normalized[name] = bytes;
  }
  return normalized;
}

function toPublicNetworkRequest(record) {
  const body = Uint8Array.from(record.body);
  const bodyBuffer = Buffer.from(
    body.buffer,
    body.byteOffset,
    body.byteLength,
  );
  return Object.freeze({
    sequence: record.sequence,
    api: record.api,
    context: Object.freeze({ ...record.context }),
    method: record.method,
    url: record.url,
    urlTruncated: record.urlTruncated,
    headers: Object.freeze(
      record.headers.map(pair => Object.freeze([...pair])),
    ),
    headersTruncated: record.headersTruncated,
    body,
    bodyText: bodyBuffer.toString("utf8"),
    bodyBase64: bodyBuffer.toString("base64"),
    bodyByteLength: record.bodyByteLength,
    bodyTruncated: record.bodyTruncated,
    outcome: record.outcome,
  });
}
