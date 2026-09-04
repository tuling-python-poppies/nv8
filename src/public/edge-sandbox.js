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
    await controller.start();
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

  close() {
    return this.controller.close();
  }

  async [Symbol.asyncDispose]() {
    await this.close();
  }
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
