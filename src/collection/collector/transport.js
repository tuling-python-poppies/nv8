import { awaitWithSignal } from './cancellation.js';

/**
 * Collector Transport
 *
 * 传输是唯一真正接触 socket 的接口。把它抽象出来的目的：
 * - 单元测试可以注入确定性 transport，不需要真实网络
 * - 部署方可以替换实现（undici、代理、mTLS）而不改动上层策略
 * - Collector 的策略、重试、审计逻辑与传输实现解耦
 *
 * 契约：`send(request, options) -> Promise<CollectorResponse>`
 */

import { CollectorConfigError, CollectorErrorCode, CollectorRequestError, CollectorTimeoutError } from './errors.js';
import { redactRequestUrl } from './credentials.js';

/**
 * 归一化传输响应
 * @param {object} input
 * @returns {Readonly<object>}
 */
export function createCollectorResponse(input) {
  const {
    status,
    statusText = '',
    headers = [],
    body = null,
    bodyEncoding = 'text',
    url,
    redirected = false,
    timingMs = null,
    websocket = undefined,
  } = input ?? {};

  if (!Number.isInteger(status) || status < 100 || status > 599) {
    throw new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      `transport returned an invalid status: ${status}`,
      { context: { status } }
    );
  }

  const normalizedHeaders = (Array.isArray(headers)
    ? headers.map((entry) => (Array.isArray(entry)
      ? { name: entry[0], values: [entry[1]] }
      : { name: entry.name, values: entry.values ?? [entry.value] }))
    : Object.entries(headers).map(([name, value]) => ({
      name,
      values: Array.isArray(value) ? value : [value],
    }))
  ).map((entry) => Object.freeze({
    name: String(entry.name).toLowerCase(),
    values: Object.freeze(entry.values.map(String)),
  }));

  const response = {
    status,
    statusText: String(statusText),
    headers: Object.freeze(normalizedHeaders),
    body,
    bodyEncoding,
    url: url ?? null,
    redirected: redirected === true,
    timingMs,
  };
  if (websocket !== undefined) {
    response.websocket = Object.freeze({
      protocol: websocket?.protocol ?? null,
      frames: Object.freeze((websocket?.frames ?? []).map(frame => Object.freeze({ ...frame }))),
      closeCode: websocket?.closeCode ?? null,
      closeReason: websocket?.closeReason ?? '',
    });
  }
  return Object.freeze(response);
}

/**
 * 读取响应 header
 * @param {object} response
 * @param {string} name
 */
export function getResponseHeader(response, name) {
  const target = name.toLowerCase();
  return response.headers.find((entry) => entry.name === target)?.values[0];
}

/**
 * 校验 transport 是否符合契约
 * @param {object} transport
 */
export function assertTransport(transport) {
  if (transport === null || typeof transport !== 'object' || typeof transport.send !== 'function') {
    throw new CollectorConfigError('transport must be an object exposing send(request, options)');
  }
  return transport;
}

/**
 * 给任意 transport 包一层超时控制。
 * 超时抛 {@link CollectorTimeoutError}（可重试）。
 *
 * @param {object} transport
 * @param {number} timeoutMs
 * @returns {object}
 */
export function withTimeout(transport, timeoutMs) {
  assertTransport(transport);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new CollectorConfigError('timeoutMs must be a positive number');
  }

  return {
    async send(request, options = {}) {
      const controller = new AbortController();
      const external = options.signal;
      const onAbort = () => controller.abort(external?.reason);
      if (external) {
        if (external.aborted) controller.abort(external.reason);
        else external.addEventListener('abort', onAbort, { once: true });
      }

      let timer;
      const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new CollectorTimeoutError(timeoutMs, {
            context: { url: redactRequestUrl(request.url) },
          }));
        }, timeoutMs);
      });

      try {
        return await Promise.race([
          transport.send(request, { ...options, signal: controller.signal }),
          timeout,
        ]);
      } finally {
        clearTimeout(timer);
        external?.removeEventListener?.('abort', onAbort);
      }
    },
    async dispose() {
      await transport.dispose?.();
    },
  };
}

/**
 * 把 RequestPlan 变成可直接发出的 header 与 body。
 *
 * 抽出来共享而不是每个 transport 各写一份：body 编码规则一旦分叉，
 * 两个 transport 就会在同一个计划上发出不同的请求，而这种差异极难察觉
 * ——通过代理时成功、直连时失败，看起来像"代理有问题"。
 *
 * @param {object} request 已规范化的 RequestPlan
 * @returns {{headers: Headers, body: string|Buffer|undefined}}
 */
export function buildRequestPayload(request) {
  const headers = new Headers();
  for (const entry of request.headers) {
    for (const value of entry.values) headers.append(entry.name, value);
  }
  if (request.cookies.length > 0) {
    headers.set(
      'cookie',
      request.cookies.map((entry) => `${entry.name}=${entry.value}`).join('; ')
    );
  }

  let body;
  switch (request.body.encoding) {
    case 'none': body = undefined; break;
    case 'text': body = request.body.value; break;
    case 'base64': body = Buffer.from(request.body.value, 'base64'); break;
    case 'json':
      body = JSON.stringify(request.body.value);
      if (!headers.has('content-type')) headers.set('content-type', 'application/json');
      break;
    case 'form':
      body = new URLSearchParams(request.body.value).toString();
      if (!headers.has('content-type')) {
        headers.set('content-type', 'application/x-www-form-urlencoded');
      }
      break;
    default:
      throw new CollectorRequestError(
        CollectorErrorCode.INVALID_PLAN,
        `unsupported body encoding "${request.body.encoding}"`
      );
  }

  return { headers, body };
}

/**
 * 基于全局 `fetch` 的传输实现。
 *
 * 说明：这是唯一发起真实网络请求的地方。调用方必须已经通过
 * NetworkPolicy 检查——transport 本身不做准入判断。
 *
 * @param {object} [options]
 * @param {typeof fetch} [options.fetchImpl]
 * @param {number} [options.maxResponseBytes]
 * @returns {object}
 */
export function createFetchTransport(options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const maxResponseBytes = options.maxResponseBytes ?? 16 * 1024 * 1024;

  if (typeof fetchImpl !== 'function') {
    throw new CollectorConfigError(
      'global fetch is unavailable; provide options.fetchImpl'
    );
  }

  return {
    async send(request, sendOptions = {}) {
      const { headers, body } = buildRequestPayload(request);

      const startedAt = Date.now();
      let response;
      try {
        response = await fetchImpl(request.url, {
          method: request.method,
          headers,
          body,
          // 保持 manual：重定向的跟随与逐跳校验由 Collector 依据
          // NetworkPolicy（followRedirects/maxRedirects/assertRedirect）完成。
          // 让 fetch 自动跟随后，跨 origin 跳转既不经过 allowlist，也会把
          // origin 绑定凭据带过去——这是安全边界，不是可选项。
          redirect: 'manual',
          signal: sendOptions.signal,
        });
      } catch (error) {
        if (error?.name === 'AbortError') {
          throw new CollectorRequestError(
            CollectorErrorCode.ABORTED,
            `request aborted: ${redactRequestUrl(request.url)}`,
            { context: { url: redactRequestUrl(request.url) }, cause: error, retryable: false }
          );
        }
        throw new CollectorRequestError(
          CollectorErrorCode.REQUEST_FAILED,
          `transport failure for ${redactRequestUrl(request.url)}: ${error.message}`,
          { context: { url: redactRequestUrl(request.url) }, cause: error, retryable: true }
        );
      }

      const buffer = await readBodyWithLimit(response, maxResponseBytes, request.url);

      return createCollectorResponse({
        status: response.status,
        statusText: response.statusText,
        headers: [...response.headers].map(([name, value]) => ({ name, values: [value] })),
        body: buffer.toString('base64'),
        bodyEncoding: 'base64',
        url: response.url || request.url,
        timingMs: Date.now() - startedAt,
      });
    },
  };
}

/**
 * 流式读取响应体并同步判限。
 *
 * `arrayBuffer()` 之后才比较大小是无效防护：超限响应会先被完整读进内存，
 * 判定时内存已经被撑爆。这里边读边累加，一超限立即取消读取并抛错，
 * 与 proxy-transport 的语义对齐。
 *
 * @param {Response} response
 * @param {number} maxResponseBytes
 * @param {string} url
 * @returns {Promise<Buffer>}
 */
async function readBodyWithLimit(response, maxResponseBytes, url) {
  const stream = response?.body;
  if (stream === null || stream === undefined || typeof stream.getReader !== 'function') {
    // 没有可读流（204、测试替身）时退回整体读取
    let buffer;
    try {
      buffer = Buffer.from(await response.arrayBuffer());
    } catch (error) {
      throw mapBodyReadError(error, url);
    }
    if (buffer.byteLength > maxResponseBytes) throw tooLargeError(url, maxResponseBytes, buffer.byteLength);
    return buffer;
  }

  const reader = stream.getReader();
  const chunks = [];
  let received = 0;
  try {
    for (;;) {
      let step;
      try {
        step = await reader.read();
      } catch (error) {
        throw mapBodyReadError(error, url);
      }
      if (step.done) break;
      const chunk = Buffer.from(step.value);
      received += chunk.byteLength;
      if (received > maxResponseBytes) {
        // 先定结果再取消：反过来的话取消触发的错误会盖过真正的原因
        await reader.cancel().catch(() => {});
        throw tooLargeError(url, maxResponseBytes, received);
      }
      chunks.push(chunk);
    }
  } finally {
    try { reader.releaseLock(); } catch { /* reader 已取消或已释放 */ }
  }
  return Buffer.concat(chunks);
}

function tooLargeError(url, limit, actual) {
  return new CollectorRequestError(
    CollectorErrorCode.RESPONSE_TOO_LARGE,
    'response body exceeds maxResponseBytes',
    {
      context: { url: redactRequestUrl(url) },
      limit,
      actual,
      retryable: false,
    }
  );
}

function mapBodyReadError(error, url) {
  if (error?.name === 'AbortError') {
    return new CollectorRequestError(
      CollectorErrorCode.ABORTED,
      `request aborted: ${redactRequestUrl(url)}`,
      { context: { url: redactRequestUrl(url) }, cause: error, retryable: false }
    );
  }
  return new CollectorRequestError(
    CollectorErrorCode.REQUEST_FAILED,
    `transport failure for ${redactRequestUrl(url)}: ${error.message}`,
    { context: { url: redactRequestUrl(url) }, cause: error, retryable: true }
  );
}

/**
 * 确定性的桩传输，用于测试和离线端到端验证。
 *
 * @param {Array<{ match: (request: object) => boolean, response?: object, error?: Error }>} routes
 * @returns {object}
 */
export function createStubTransport(routes = []) {
  const calls = [];
  return {
    calls,
    async send(request) {
      calls.push(request);
      for (const route of routes) {
        if (route.match(request)) {
          if (route.error) throw route.error;
          if (typeof route.respond === 'function') {
            return createCollectorResponse(route.respond(request, calls.length));
          }
          return createCollectorResponse(route.response);
        }
      }
      throw new CollectorRequestError(
        CollectorErrorCode.REQUEST_FAILED,
        `stub transport has no route for ${request.method} ${redactRequestUrl(request.url)}`,
        { context: { url: redactRequestUrl(request.url) }, retryable: false }
      );
    },
  };
}
