import net from 'node:net';
import tls from 'node:tls';

import { CollectorConfigError, CollectorError, CollectorErrorCode } from './errors.js';

/**
 * 代理支持。
 *
 * ## 代理故障必须与目标故障分开
 *
 * 这是本模块存在的首要理由。代理不通是**我们这一侧的出口坏了**，
 * 不是目标站点挂了。混在一起的后果：一个代理挂掉 → 熔断器跳闸所有 origin
 * → 运维看到「所有站点都挂了」，真实原因（一个代理不通）被完全掩盖。
 *
 * 所以代理故障用独立错误码 `PROXY_*`，熔断器**硬排除**这些码。
 *
 * ## 轮换不能盲目
 *
 * 很多站点把会话绑定在 IP 上。会话中途换出口 IP，表现是**莫名掉登录态**
 * 或风控直接拦——而且看起来像「协议实现错了」，会浪费大量时间往错的方向查。
 * 所以默认策略是 `sticky`（同一 origin 固定同一代理），轮换必须显式选择。
 *
 * ## 凭据不能出现在任何输出里
 *
 * 代理 URL 常带 `user:pass@`。日志、错误消息、`toJSON()` 全部要脱敏——
 * 一条带密码的错误日志进了工单系统就等于泄露。
 */

/** 支持的代理协议。 */
export const ProxyProtocol = Object.freeze({
  HTTP: 'http',
  HTTPS: 'https',
  SOCKS5: 'socks5',
});

/** 轮换策略。 */
export const RotationStrategy = Object.freeze({
  /** 同一 origin 始终用同一个代理。默认——保住会话与 IP 的绑定。 */
  STICKY: 'sticky',
  /** 每次请求轮换。只在目标明确不绑定 IP 时用。 */
  ROUND_ROBIN: 'round-robin',
  RANDOM: 'random',
});

const DEFAULT_PORTS = Object.freeze({ http: 80, https: 443, socks5: 1080 });

/**
 * 解析代理配置。
 *
 * @param {string|object} input `socks5://user:pass@host:1080` 或等价对象
 * @returns {Readonly<object>}
 */
export function parseProxy(input) {
  if (input === null || input === undefined) {
    throw new CollectorConfigError('proxy config must not be empty');
  }

  const raw = typeof input === 'string' ? fromUrl(input) : { ...input };
  const protocol = `${raw.protocol ?? ''}`.replace(/:$/u, '').toLowerCase();

  if (!Object.values(ProxyProtocol).includes(protocol)) {
    throw new CollectorConfigError(
      `unsupported proxy protocol "${protocol}"; expected one of `
      + Object.values(ProxyProtocol).join(', ')
    );
  }
  if (typeof raw.host !== 'string' || raw.host === '') {
    throw new CollectorConfigError('proxy config requires a host');
  }

  const port = raw.port === undefined || raw.port === null || raw.port === ''
    ? DEFAULT_PORTS[protocol]
    : Number(raw.port);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new CollectorConfigError(`invalid proxy port ${raw.port}`);
  }

  // 只给用户名不给密码是配置事故（多半是 URL 里 `:` 写漏了），
  // 静默当成空密码会让认证在远端失败、报成"代理不通"
  const username = raw.username === undefined || raw.username === ''
    ? null
    : `${raw.username}`;
  const password = raw.password === undefined || raw.password === ''
    ? null
    : `${raw.password}`;
  if (username !== null && password === null) {
    throw new CollectorConfigError(
      'proxy has a username but no password; if the proxy needs no password, omit both'
    );
  }
  if (username === null && password !== null) {
    throw new CollectorConfigError('proxy has a password but no username');
  }

  const label = `${protocol}://${raw.host}:${port}`;

  const proxy = {
    protocol,
    host: raw.host,
    port,
    username,
    password,
    /** 脱敏标识。日志与错误消息只允许用这个。 */
    label,
    /** 一定要覆盖：默认序列化会把密码带出去。 */
    toJSON() {
      return { protocol, host: raw.host, port, authenticated: username !== null };
    },
    toString() { return label; },
  };

  // password 不可枚举：`{...proxy}`、`console.log`、`JSON.stringify` 都不会带出它
  Object.defineProperty(proxy, 'password', {
    value: password, enumerable: false, writable: false, configurable: false,
  });

  return Object.freeze(proxy);
}

/**
 * 从 URL 串解析。
 *
 * @param {string} text
 * @returns {object}
 */
function fromUrl(text) {
  let url;
  try {
    url = new URL(text);
  } catch {
    throw new CollectorConfigError(`proxy url is not parseable: ${redactUrl(text)}`);
  }
  return {
    protocol: url.protocol,
    host: url.hostname,
    port: url.port,
    // URL 会做百分号编码，密码里的 `@`、`:` 必须解回来。
    // 畸形转义（如 `p%zz`）会让 decodeURIComponent 抛裸 URIError——
    // 调用方按 CollectorConfigError 分类就会漏捕。这里统一转成配置错误，
    // 且错误消息里的凭据段必须脱敏。
    username: url.username === '' ? undefined : decodeCredential(url.username, text),
    password: url.password === '' ? undefined : decodeCredential(url.password, text),
  };
}

function decodeCredential(part, text) {
  try {
    return decodeURIComponent(part);
  } catch {
    throw new CollectorConfigError(
      `proxy url contains malformed percent-encoding: ${redactUrl(text)}`
    );
  }
}

/**
 * 抹掉 URL 串里的凭据。
 *
 * 报错时原串也不能直接回显——解析失败的 URL 同样可能带密码。
 *
 * @param {string} text
 * @returns {string}
 */
export function redactUrl(text) {
  return `${text}`.replace(/\/\/[^/@]*@/u, '//***@');
}

/**
 * 代理池：轮换 + 健康跟踪。
 *
 * 健康跟踪的关键在于**失败后要冷却**。没有冷却的话，一个挂掉的代理会在每轮
 * 轮换里被反复选中，把整体成功率拖到 1/N，而每次失败看起来都是随机的。
 */
export class ProxyPool {
  #proxies;
  #strategy;
  #cooldownMs;
  #now;
  #cursor = 0;
  #cooldownUntil = new Map();
  #sticky = new Map();
  #random;

  /**
   * @param {object} config
   * @param {Array<string|object>} config.proxies
   * @param {string} [config.strategy='sticky']
   * @param {number} [config.cooldownMs=30000]
   * @param {() => number} [config.now]
   * @param {() => number} [config.random]
   */
  constructor(config = {}) {
    const list = config.proxies ?? [];
    if (!Array.isArray(list) || list.length === 0) {
      throw new CollectorConfigError('proxy pool requires at least one proxy');
    }
    this.#proxies = Object.freeze(list.map((entry) => parseProxy(entry)));

    const strategy = config.strategy ?? RotationStrategy.STICKY;
    if (!Object.values(RotationStrategy).includes(strategy)) {
      throw new CollectorConfigError(`unknown rotation strategy "${strategy}"`);
    }
    this.#strategy = strategy;

    const cooldownMs = config.cooldownMs ?? 30_000;
    if (!Number.isInteger(cooldownMs) || cooldownMs < 0) {
      throw new CollectorConfigError(
        `cooldownMs must be a non-negative integer, received ${cooldownMs}`
      );
    }
    this.#cooldownMs = cooldownMs;
    this.#now = config.now ?? Date.now;
    this.#random = config.random ?? Math.random;
  }

  get size() { return this.#proxies.length; }
  get strategy() { return this.#strategy; }

  /**
   * 取一个可用代理。
   *
   * @param {string} [originKey] sticky 策略的分组键，通常是目标 origin
   * @returns {Readonly<object>}
   */
  acquire(originKey = '') {
    const now = this.#now();
    const available = this.#proxies.filter(
      (proxy) => (this.#cooldownUntil.get(proxy.label) ?? 0) <= now
    );

    if (available.length === 0) {
      // 全部在冷却时**抛错**，不退回用一个已知坏的。用坏代理会把故障重新
      // 伪装成目标故障——正是这个模块要避免的事。
      const soonest = Math.min(...this.#proxies.map(
        (proxy) => this.#cooldownUntil.get(proxy.label) ?? 0
      ));
      throw new CollectorError(
        CollectorErrorCode.PROXY_EXHAUSTED,
        `all ${this.#proxies.length} proxies are cooling down; `
        + `next available in ${Math.max(0, soonest - now)}ms`,
        { retryable: true }
      );
    }

    if (this.#strategy === RotationStrategy.STICKY) {
      const pinned = this.#sticky.get(originKey);
      if (pinned !== undefined && available.some((p) => p.label === pinned.label)) {
        return pinned;
      }
      // 首次或原绑定已冷却：重新绑定并记下
      const chosen = available[this.#cursor++ % available.length];
      this.#sticky.set(originKey, chosen);
      return chosen;
    }

    if (this.#strategy === RotationStrategy.RANDOM) {
      return available[Math.floor(this.#random() * available.length)];
    }

    return available[this.#cursor++ % available.length];
  }

  /**
   * 记录一次代理侧失败，进入冷却。
   *
   * @param {object} proxy
   */
  reportFailure(proxy) {
    if (this.#cooldownMs === 0) return;
    this.#cooldownUntil.set(proxy.label, this.#now() + this.#cooldownMs);
    // 解除 sticky 绑定，否则下次仍会尝试同一个坏代理
    for (const [key, pinned] of this.#sticky) {
      if (pinned.label === proxy.label) this.#sticky.delete(key);
    }
  }

  /**
   * 记录一次成功，立即解除冷却。
   *
   * @param {object} proxy
   */
  reportSuccess(proxy) {
    this.#cooldownUntil.delete(proxy.label);
  }

  /**
   * 健康快照。全部脱敏，可直接进日志。
   *
   * @returns {Readonly<object>}
   */
  health() {
    const now = this.#now();
    return Object.freeze(this.#proxies.map((proxy) => Object.freeze({
      label: proxy.label,
      coolingDown: (this.#cooldownUntil.get(proxy.label) ?? 0) > now,
      cooldownRemainingMs: Math.max(0, (this.#cooldownUntil.get(proxy.label) ?? 0) - now),
    })));
  }
}

/**
 * 建立到目标主机的隧道 socket。
 *
 * HTTP/HTTPS 代理走 `CONNECT`，SOCKS5 走握手。两者都返回一个已经连通到
 * 目标的 socket，调用方在其上做 TLS 或明文 HTTP。
 *
 * @param {object} config
 * @param {object} config.proxy
 * @param {string} config.host 目标主机
 * @param {number} config.port 目标端口
 * @param {number} [config.timeoutMs=15000]
 * @param {AbortSignal} [config.signal]
 * @returns {Promise<net.Socket>}
 */
export async function connectThroughProxy(config = {}) {
  const { proxy, host, port } = config;
  if (proxy === undefined || typeof host !== 'string' || !Number.isInteger(port)) {
    throw new CollectorConfigError('connectThroughProxy requires proxy, host and port');
  }

  const timeoutMs = config.timeoutMs ?? 15_000;
  const socket = await openProxySocket(proxy, timeoutMs, config.signal);

  try {
    if (proxy.protocol === ProxyProtocol.SOCKS5) {
      await socks5Handshake(socket, proxy, host, port, timeoutMs);
    } else {
      await httpConnect(socket, proxy, host, port, timeoutMs);
    }
  } catch (error) {
    socket.destroy();
    throw error;
  }

  return socket;
}

/**
 * 连到代理本身。
 *
 * @param {object} proxy
 * @param {number} timeoutMs
 * @param {AbortSignal|undefined} signal
 * @returns {Promise<net.Socket>}
 */
function openProxySocket(proxy, timeoutMs, signal) {
  return new Promise((resolve, reject) => {
    // 先查 aborted：对一个已经 abort 的 signal 调 addEventListener('abort')
    // 永远不会触发，会一路挂到超时才失败
    if (signal?.aborted === true) {
      reject(new CollectorError(
        CollectorErrorCode.ABORTED, 'proxy connection aborted', { retryable: false }
      ));
      return;
    }

    const socket = proxy.protocol === ProxyProtocol.HTTPS
      // 到 HTTPS 代理这一跳本身要加密；目标 TLS 是隧道内的第二层
      ? tls.connect({ host: proxy.host, port: proxy.port, servername: proxy.host })
      : net.connect({ host: proxy.host, port: proxy.port });

    const cleanup = () => {
      socket.removeListener('error', onError);
      socket.removeListener('timeout', onTimeout);
      signal?.removeEventListener('abort', onAbort);
      socket.setTimeout(0);
    };

    function onError(error) {
      cleanup();
      socket.destroy();
      reject(new CollectorError(
        CollectorErrorCode.PROXY_CONNECT_FAILED,
        // 只报脱敏 label
        `cannot reach proxy ${proxy.label}: ${error.message}`,
        { retryable: true, cause: error }
      ));
    }
    function onTimeout() {
      cleanup();
      socket.destroy();
      reject(new CollectorError(
        CollectorErrorCode.PROXY_CONNECT_FAILED,
        `proxy ${proxy.label} did not accept a connection within ${timeoutMs}ms`,
        { retryable: true }
      ));
    }
    function onAbort() {
      cleanup();
      socket.destroy();
      reject(new CollectorError(
        CollectorErrorCode.ABORTED, 'proxy connection aborted', { retryable: false }
      ));
    }

    socket.setTimeout(timeoutMs);
    socket.once('error', onError);
    socket.once('timeout', onTimeout);
    signal?.addEventListener('abort', onAbort, { once: true });
    socket.once(proxy.protocol === ProxyProtocol.HTTPS ? 'secureConnect' : 'connect', () => {
      cleanup();
      resolve(socket);
    });
  });
}

/**
 * HTTP CONNECT 隧道。
 *
 * @param {net.Socket} socket
 * @param {object} proxy
 * @param {string} host
 * @param {number} port
 * @param {number} timeoutMs
 * @returns {Promise<void>}
 */
function httpConnect(socket, proxy, host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const authority = `${host}:${port}`;
    let request = `CONNECT ${authority} HTTP/1.1\r\nHost: ${authority}\r\n`;
    if (proxy.username !== null) {
      const token = Buffer.from(`${proxy.username}:${proxy.password}`).toString('base64');
      request += `Proxy-Authorization: Basic ${token}\r\n`;
    }
    request += '\r\n';

    let buffered = Buffer.alloc(0);
    const timer = setTimeout(() => finish(new CollectorError(
      CollectorErrorCode.PROXY_CONNECT_FAILED,
      `proxy ${proxy.label} did not answer CONNECT within ${timeoutMs}ms`,
      { retryable: true }
    )), timeoutMs);

    function finish(error) {
      clearTimeout(timer);
      socket.removeListener('data', onData);
      socket.removeListener('error', onError);
      if (error) reject(error); else resolve();
    }
    function onError(error) {
      finish(new CollectorError(
        CollectorErrorCode.PROXY_CONNECT_FAILED,
        `proxy ${proxy.label} failed during CONNECT: ${error.message}`,
        { retryable: true, cause: error }
      ));
    }
    function onData(chunk) {
      buffered = Buffer.concat([buffered, chunk]);
      const end = buffered.indexOf('\r\n\r\n');
      // 响应头可能分多个 TCP 段到达，必须等到空行才解析
      if (end === -1) {
        if (buffered.length > 16 * 1024) {
          finish(new CollectorError(
            CollectorErrorCode.PROXY_CONNECT_FAILED,
            `proxy ${proxy.label} sent an oversized CONNECT response`,
            { retryable: false }
          ));
        }
        return;
      }

      const statusLine = buffered.subarray(0, buffered.indexOf('\r\n')).toString('latin1');
      const status = Number(statusLine.split(' ')[1]);

      if (status === 407) {
        // 认证失败不可重试：换次数再多也一样，配置得改
        finish(new CollectorError(
          CollectorErrorCode.PROXY_AUTH_FAILED,
          `proxy ${proxy.label} rejected credentials (407)`,
          { retryable: false }
        ));
        return;
      }
      if (status !== 200) {
        finish(new CollectorError(
          CollectorErrorCode.PROXY_CONNECT_FAILED,
          `proxy ${proxy.label} refused CONNECT to ${host}:${port}: ${statusLine}`,
          { retryable: true }
        ));
        return;
      }

      // 代理可能在同一个段里把目标的首批数据也带来了，退回给流
      const rest = buffered.subarray(end + 4);
      if (rest.length > 0) socket.unshift(rest);
      finish(null);
    }

    socket.on('data', onData);
    socket.once('error', onError);
    socket.write(request, 'latin1');
  });
}

/** SOCKS5 应答码。 */
const SOCKS5_REPLY = Object.freeze({
  0x00: 'succeeded',
  0x01: 'general SOCKS server failure',
  0x02: 'connection not allowed by ruleset',
  0x03: 'network unreachable',
  0x04: 'host unreachable',
  0x05: 'connection refused',
  0x06: 'TTL expired',
  0x07: 'command not supported',
  0x08: 'address type not supported',
});

/**
 * SOCKS5 握手。
 *
 * @param {net.Socket} socket
 * @param {object} proxy
 * @param {string} host
 * @param {number} port
 * @param {number} timeoutMs
 * @returns {Promise<void>}
 */
function socks5Handshake(socket, proxy, host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const authenticated = proxy.username !== null;
    let buffered = Buffer.alloc(0);
    let stage = 'greeting';

    const timer = setTimeout(() => finish(new CollectorError(
      CollectorErrorCode.PROXY_CONNECT_FAILED,
      `proxy ${proxy.label} stalled during SOCKS5 ${stage} (${timeoutMs}ms)`,
      { retryable: true }
    )), timeoutMs);

    function finish(error) {
      clearTimeout(timer);
      socket.removeListener('data', onData);
      socket.removeListener('error', onError);
      if (error) reject(error); else resolve();
    }
    function onError(error) {
      finish(new CollectorError(
        CollectorErrorCode.PROXY_CONNECT_FAILED,
        `proxy ${proxy.label} failed during SOCKS5 ${stage}: ${error.message}`,
        { retryable: true, cause: error }
      ));
    }
    function fail(message, options = {}) {
      finish(new CollectorError(
        options.code ?? CollectorErrorCode.PROXY_CONNECT_FAILED,
        `proxy ${proxy.label}: ${message}`,
        { retryable: options.retryable ?? true }
      ));
    }

    /**
     * 取出 n 字节，不足则返回 null 等下一段。
     *
     * SOCKS5 的每一步都是定长或长度前缀，必须按需取而不是假设一段到齐。
     *
     * @param {number} n
     * @returns {Buffer|null}
     */
    function take(n) {
      if (buffered.length < n) return null;
      const head = buffered.subarray(0, n);
      buffered = buffered.subarray(n);
      return head;
    }

    function sendConnect() {
      stage = 'connect';
      const hostBytes = Buffer.from(host, 'utf8');
      const payload = Buffer.alloc(5 + hostBytes.length + 2);
      payload[0] = 0x05;
      payload[1] = 0x01; // CONNECT
      payload[2] = 0x00;
      payload[3] = 0x03; // 域名：让代理去解析，本机 DNS 不参与
      payload[4] = hostBytes.length;
      hostBytes.copy(payload, 5);
      payload.writeUInt16BE(port, 5 + hostBytes.length);
      socket.write(payload);
    }

    function onData(chunk) {
      buffered = Buffer.concat([buffered, chunk]);

      for (;;) {
        if (stage === 'greeting') {
          const head = take(2);
          if (head === null) return;
          if (head[0] !== 0x05) {
            fail(`unexpected SOCKS version 0x${head[0].toString(16)}`, { retryable: false });
            return;
          }
          if (head[1] === 0xff) {
            fail('rejected all offered authentication methods', {
              code: CollectorErrorCode.PROXY_AUTH_FAILED, retryable: false,
            });
            return;
          }
          if (head[1] === 0x02) {
            if (!authenticated) {
              // 代理要认证但配置里没凭据——报认证失败而不是"连不上"，
              // 否则会被当成网络问题反复重试
              fail('requires username/password authentication but none was configured', {
                code: CollectorErrorCode.PROXY_AUTH_FAILED, retryable: false,
              });
              return;
            }
            stage = 'auth';
            const user = Buffer.from(proxy.username, 'utf8');
            const pass = Buffer.from(proxy.password, 'utf8');
            const payload = Buffer.alloc(3 + user.length + pass.length);
            payload[0] = 0x01;
            payload[1] = user.length;
            user.copy(payload, 2);
            payload[2 + user.length] = pass.length;
            pass.copy(payload, 3 + user.length);
            socket.write(payload);
            continue;
          }
          if (head[1] !== 0x00) {
            fail(`chose unsupported auth method 0x${head[1].toString(16)}`, {
              retryable: false,
            });
            return;
          }
          sendConnect();
          continue;
        }

        if (stage === 'auth') {
          const reply = take(2);
          if (reply === null) return;
          if (reply[1] !== 0x00) {
            fail('rejected credentials', {
              code: CollectorErrorCode.PROXY_AUTH_FAILED, retryable: false,
            });
            return;
          }
          sendConnect();
          continue;
        }

        // stage === 'connect'
        if (buffered.length < 5) return;
        const addressType = buffered[3];
        // 绑定地址长度依 ATYP 而定，读少了会把它当成目标数据
        const addressLength = addressType === 0x01
          ? 4
          : addressType === 0x04 ? 16 : 1 + buffered[4];
        const total = 4 + addressLength + 2;
        if (buffered.length < total) return;

        const reply = take(total);
        if (reply[1] !== 0x00) {
          fail(
            `CONNECT to ${host}:${port} failed: `
            + (SOCKS5_REPLY[reply[1]] ?? `reply 0x${reply[1].toString(16)}`),
            { retryable: reply[1] !== 0x02 }
          );
          return;
        }

        if (buffered.length > 0) socket.unshift(buffered);
        finish(null);
        return;
      }
    }

    socket.on('data', onData);
    socket.once('error', onError);
    // 同时提供「无认证」与「用户名/密码」，让代理挑
    socket.write(authenticated
      ? Buffer.from([0x05, 0x02, 0x00, 0x02])
      : Buffer.from([0x05, 0x01, 0x00]));
  });
}

/**
 * 判断一个错误是否代理侧故障。
 *
 * 熔断器与重试策略据此把代理故障排除在目标健康度之外。
 *
 * @param {any} error
 * @returns {boolean}
 */
export function isProxyError(error) {
  return error?.code === CollectorErrorCode.PROXY_CONNECT_FAILED
    || error?.code === CollectorErrorCode.PROXY_AUTH_FAILED
    || error?.code === CollectorErrorCode.PROXY_EXHAUSTED;
}
