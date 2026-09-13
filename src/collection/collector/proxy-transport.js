import http from 'node:http';
import https from 'node:https';
import tls from 'node:tls';

import {
  CollectorConfigError,
  CollectorErrorCode,
  CollectorRequestError,
} from './errors.js';
import { ProxyPool, connectThroughProxy, isProxyError } from './proxy.js';
import { buildRequestPayload, createCollectorResponse } from './transport.js';
import { redactRequestUrl } from './credentials.js';

/**
 * 走代理的传输实现。
 *
 * ## 为什么不能复用全局 fetch
 *
 * Node 的全局 `fetch`（undici）没有公开的代理钩子；要用 `ProxyAgent` 就得引入
 * undici 作为依赖，而本项目零依赖。所以这里基于 `node:http`/`node:https`
 * 自建，通过 `createConnection` 把 {@link connectThroughProxy} 建好的隧道
 * socket 交给 HTTP 客户端。
 *
 * ## 配了代理就绝不直连
 *
 * 代理不可用时**不回落直连**。回落的后果是真实出口 IP 泄露——而用代理的全部
 * 意义就在于不暴露它。更糟的是这种泄露完全无声：请求成功了，采集正常，
 * 等到目标把你的真实 IP 拉黑才发现。要允许直连必须显式 `allowDirect: true`。
 *
 * ## 故障归属
 *
 * 代理侧故障（连不上代理、认证被拒、池全冷却）保留 `PROXY_*` 错误码往上抛，
 * 熔断器据此把它排除在目标健康度之外；同时通知池冷却该出口。
 * 目标侧故障（超时、连接重置、5xx）照常算目标的。
 */

const DEFAULT_MAX_RESPONSE_BYTES = 16 * 1024 * 1024;

/**
 * @param {object} config
 * @param {ProxyPool|Array<string|object>} config.proxies 池或代理列表
 * @param {number} [config.maxResponseBytes]
 * @param {number} [config.connectTimeoutMs=15000]
 * @param {boolean} [config.allowDirect=false] 池耗尽时是否允许直连
 * @param {object} [config.tlsOptions] 传给 `tls.connect` 的额外项（如 mTLS）
 * @returns {object}
 */
export function createProxyTransport(config = {}) {
  const pool = config.proxies instanceof ProxyPool
    ? config.proxies
    : new ProxyPool({ proxies: config.proxies ?? [] });

  const maxResponseBytes = config.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES;
  if (!Number.isInteger(maxResponseBytes) || maxResponseBytes < 1) {
    throw new CollectorConfigError(
      `maxResponseBytes must be a positive integer, received ${maxResponseBytes}`
    );
  }
  const connectTimeoutMs = config.connectTimeoutMs ?? 15_000;
  const allowDirect = config.allowDirect === true;
  const tlsOptions = config.tlsOptions ?? {};

  return {
    /** 池健康快照（已脱敏，可直接进日志）。 */
    proxyHealth() { return pool.health(); },

    async send(request, sendOptions = {}) {
      const target = new URL(request.url);
      const secure = target.protocol === 'https:';
      const port = target.port === ''
        ? (secure ? 443 : 80)
        : Number(target.port);

      // sticky 用 origin 分组：会话与出口 IP 的绑定按 origin 才有意义
      let proxy = null;
      try {
        proxy = pool.acquire(target.origin);
      } catch (error) {
        // 池全冷却。允许直连才回落，否则原样上抛——静默直连会泄露真实 IP
        if (!(allowDirect && error.code === CollectorErrorCode.PROXY_EXHAUSTED)) {
          throw error;
        }
      }

      let socket = null;
      if (proxy !== null) {
        try {
          socket = await connectThroughProxy({
            proxy,
            host: target.hostname,
            port,
            timeoutMs: connectTimeoutMs,
            signal: sendOptions.signal,
          });
        } catch (error) {
          if (isProxyError(error)) pool.reportFailure(proxy);
          throw error;
        }
      }

      try {
        const response = await performRequest({
          request, target, secure, port, socket, tlsOptions,
          maxResponseBytes, signal: sendOptions.signal,
        });
        if (proxy !== null) pool.reportSuccess(proxy);
        return response;
      } catch (error) {
        // 隧道建成之后的失败归目标，不冷却代理：代理已经证明自己能用，
        // 因目标的问题冷却出口会把可用出口一个个误伤掉
        socket?.destroy();
        throw error;
      }
    },
  };
}

/**
 * 在给定 socket（或直连）上发一次请求。
 *
 * @param {object} params
 * @returns {Promise<object>}
 */
function performRequest(params) {
  const {
    request, target, secure, port, socket, tlsOptions, maxResponseBytes, signal,
  } = params;

  return new Promise((resolve, reject) => {
    const { headers, body } = buildRequestPayload(request);
    const headerObject = {};
    for (const [name, value] of headers) headerObject[name] = value;
    // 隧道是一次性的，不做连接复用；留着 keep-alive 会让 socket 悬在那里
    headerObject.connection = 'close';
    if (headerObject.host === undefined) headerObject.host = target.host;

    const startedAt = Date.now();
    const client = secure ? https : http;

    const options = {
      method: request.method,
      path: `${target.pathname}${target.search}`,
      headers: headerObject,
      host: target.hostname,
      port,
    };

    if (socket !== null) {
      options.createConnection = () => (secure
        // 隧道内再叠一层 TLS：servername 必须是**目标**主机名，
        // 写成代理主机名会让 SNI 与证书都对不上
        ? tls.connect({ ...tlsOptions, socket, servername: target.hostname })
        : socket);
    }

    const outgoing = client.request(options);
    let settled = false;

    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener('abort', onAbort);
      if (error) reject(error); else resolve(value);
    };

    function onAbort() {
      outgoing.destroy();
      finish(new CollectorRequestError(
        CollectorErrorCode.ABORTED,
        `request aborted: ${redactRequestUrl(request.url)}`,
        { context: { url: redactRequestUrl(request.url) }, retryable: false }
      ));
    }

    if (signal?.aborted === true) { onAbort(); return; }
    signal?.addEventListener('abort', onAbort, { once: true });

    outgoing.on('error', (error) => finish(new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      `transport failure for ${redactRequestUrl(request.url)}: ${error.message}`,
      { context: { url: redactRequestUrl(request.url) }, cause: error, retryable: true }
    )));

    outgoing.on('response', (incoming) => {
      const chunks = [];
      let received = 0;

      incoming.on('data', (chunk) => {
        received += chunk.length;
        if (received > maxResponseBytes) {
          // 先定结果再拆连接：反过来的话 `destroy()` 触发的 error 事件会先把
          // 结果写成通用的 REQUEST_FAILED，真正的原因（超过上限）就丢了
          finish(new CollectorRequestError(
            CollectorErrorCode.RESPONSE_TOO_LARGE,
            'response body exceeds maxResponseBytes',
            {
              context: { url: redactRequestUrl(request.url) },
              limit: maxResponseBytes,
              actual: received,
              retryable: false,
            }
          ));
          // 边收边判并立即断开。先缓冲完再检查的话，这个上限根本保护不了内存
          // ——超限本身就是被撑爆的那一刻。
          incoming.destroy();
          outgoing.destroy();
          return;
        }
        chunks.push(chunk);
      });

      incoming.on('aborted', () => finish(new CollectorRequestError(
        CollectorErrorCode.REQUEST_FAILED,
        `response aborted for ${redactRequestUrl(request.url)}`,
        { context: { url: redactRequestUrl(request.url) }, retryable: true }
      )));

      incoming.on('end', () => {
        finish(null, createCollectorResponse({
          status: incoming.statusCode,
          statusText: incoming.statusMessage ?? '',
          // 用 rawHeaders 而不是 headers：后者把重复 header 合并，
          // 多个 set-cookie 会被拼成一条，Cookie 解析随之出错
          headers: groupRawHeaders(incoming.rawHeaders),
          body: Buffer.concat(chunks).toString('base64'),
          bodyEncoding: 'base64',
          url: request.url,
          timingMs: Date.now() - startedAt,
        }));
      });
    });

    if (body !== undefined) outgoing.write(body);
    outgoing.end();
  });
}

/**
 * 把 `rawHeaders` 扁平数组按名字归组，保留重复。
 *
 * @param {string[]} rawHeaders
 * @returns {Array<{name: string, values: string[]}>}
 */
function groupRawHeaders(rawHeaders) {
  const grouped = new Map();
  for (let index = 0; index < rawHeaders.length; index += 2) {
    const name = rawHeaders[index].toLowerCase();
    const value = rawHeaders[index + 1];
    const existing = grouped.get(name);
    if (existing === undefined) grouped.set(name, [value]);
    else existing.push(value);
  }
  return [...grouped].map(([name, values]) => ({ name, values }));
}
