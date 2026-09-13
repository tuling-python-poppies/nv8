/**
 * Cookie Jar
 *
 * Collector 的会话 cookie 存储。这是**采集会话**的 cookie，与 Realm 内
 * `document.cookie` 完全隔离——沙箱脚本不能读取或污染采集会话凭据。
 *
 * 实现范围有意收窄：domain/path 匹配、Secure、过期和 Max-Age。
 * 不实现 public-suffix 列表，因此禁止把 cookie 设到过短的域名上。
 */

const SAME_SITE_VALUES = new Set(['strict', 'lax', 'none']);

function normalizeDomain(domain) {
  return domain.replace(/^\./, '').toLowerCase();
}

/**
 * domain-match（RFC 6265 §5.1.3）
 */
function domainMatches(requestHost, cookieDomain) {
  const host = requestHost.toLowerCase();
  const domain = normalizeDomain(cookieDomain);
  if (host === domain) return true;
  return host.endsWith(`.${domain}`);
}

/**
 * path-match（RFC 6265 §5.1.4）
 */
function pathMatches(requestPath, cookiePath) {
  if (cookiePath === requestPath) return true;
  if (!requestPath.startsWith(cookiePath)) return false;
  if (cookiePath.endsWith('/')) return true;
  return requestPath[cookiePath.length] === '/';
}

function defaultPath(pathname) {
  if (!pathname.startsWith('/')) return '/';
  const lastSlash = pathname.lastIndexOf('/');
  if (lastSlash === 0) return '/';
  return pathname.slice(0, lastSlash);
}

/**
 * 解析单个 Set-Cookie 头
 * @param {string} header
 * @param {URL} requestUrl
 * @returns {object|null}
 */
export function parseSetCookie(header, requestUrl) {
  if (typeof header !== 'string' || header.length === 0) return null;

  const parts = header.split(';');
  const [nameValue, ...attributeParts] = parts;
  const separator = nameValue.indexOf('=');
  if (separator <= 0) return null;

  const name = nameValue.slice(0, separator).trim();
  const value = nameValue.slice(separator + 1).trim();
  if (name.length === 0) return null;

  const cookie = {
    name,
    value,
    domain: requestUrl.hostname.toLowerCase(),
    hostOnly: true,
    path: defaultPath(requestUrl.pathname),
    secure: false,
    httpOnly: false,
    sameSite: 'lax',
    expiresAt: null,
  };

  let maxAge = null;
  let expires = null;

  for (const attribute of attributeParts) {
    const index = attribute.indexOf('=');
    const key = (index === -1 ? attribute : attribute.slice(0, index)).trim().toLowerCase();
    const attrValue = index === -1 ? '' : attribute.slice(index + 1).trim();

    switch (key) {
      case 'domain': {
        if (attrValue.length === 0) break;
        const domain = normalizeDomain(attrValue);
        // 防止把 cookie 设到不相关或过宽的域
        if (!domainMatches(requestUrl.hostname, domain)) break;
        if (!domain.includes('.')) break;
        cookie.domain = domain;
        cookie.hostOnly = false;
        break;
      }
      case 'path':
        if (attrValue.startsWith('/')) cookie.path = attrValue;
        break;
      case 'secure':
        cookie.secure = true;
        break;
      case 'httponly':
        cookie.httpOnly = true;
        break;
      case 'samesite':
        if (SAME_SITE_VALUES.has(attrValue.toLowerCase())) {
          cookie.sameSite = attrValue.toLowerCase();
        }
        break;
      case 'max-age':
        if (/^-?\d+$/.test(attrValue)) maxAge = Number(attrValue);
        break;
      case 'expires': {
        const parsed = Date.parse(attrValue);
        if (!Number.isNaN(parsed)) expires = parsed;
        break;
      }
      default:
        break;
    }
  }

  // Max-Age 优先于 Expires
  if (maxAge !== null) {
    cookie.expiresAt = maxAge <= 0 ? 0 : Date.now() + maxAge * 1000;
  } else if (expires !== null) {
    cookie.expiresAt = expires;
  }

  return cookie;
}

export class CookieJar {
  /** @type {Map<string, object>} key = domain|path|name */
  #cookies = new Map();
  #maxCookies;

  constructor(options = {}) {
    this.#maxCookies = options.maxCookies ?? 512;
  }

  get size() {
    return this.#cookies.size;
  }

  static #key(cookie) {
    return `${normalizeDomain(cookie.domain)}|${cookie.path}|${cookie.name}`;
  }

  /**
   * 写入 cookie。expiresAt 已过期时视为删除指令。
   * @param {object} cookie
   */
  set(cookie) {
    const key = CookieJar.#key(cookie);
    if (cookie.expiresAt !== null && cookie.expiresAt <= Date.now()) {
      this.#cookies.delete(key);
      return;
    }
    if (!this.#cookies.has(key) && this.#cookies.size >= this.#maxCookies) {
      // 有界存储：淘汰最早写入项
      const oldest = this.#cookies.keys().next().value;
      this.#cookies.delete(oldest);
    }
    this.#cookies.set(key, { ...cookie });
  }

  /**
   * 从响应中提取并接受 Set-Cookie
   * @param {string} url
   * @param {object} response
   */
  acceptFromResponse(url, response) {
    const requestUrl = new URL(url);
    // 必须收集**所有** set-cookie 条目，不能只取第一条：undici（fetch 传输）
    // 会把同一响应里的多个 Set-Cookie 拆成多个同名条目，find 只会入 jar 一个。
    // 聚合形态（proxy 传输的 rawHeaders）则把多值放在同一条目的 values 里，
    // 两种形态都要逐个解析。
    const entries = response.headers?.filter?.((header) => header.name === 'set-cookie') ?? [];
    for (const entry of entries) {
      for (const raw of entry.values) {
        const cookie = parseSetCookie(raw, requestUrl);
        if (cookie) this.set(cookie);
      }
    }
  }

  /**
   * 取出适用于某 URL 的 cookie。
   * @param {string} url
   * @returns {Map<string,string>}
   */
  cookiesFor(url) {
    const requestUrl = new URL(url);
    const isSecure = requestUrl.protocol === 'https:' || requestUrl.protocol === 'wss:';
    const now = Date.now();
    const result = new Map();

    // 按 path 长度降序，长路径优先（RFC 6265 §5.4）
    const candidates = [...this.#cookies.values()]
      .filter((cookie) => {
        if (cookie.expiresAt !== null && cookie.expiresAt <= now) return false;
        if (cookie.secure && !isSecure) return false;
        if (cookie.hostOnly) {
          if (normalizeDomain(cookie.domain) !== requestUrl.hostname.toLowerCase()) return false;
        } else if (!domainMatches(requestUrl.hostname, cookie.domain)) {
          return false;
        }
        return pathMatches(requestUrl.pathname, cookie.path);
      })
      .sort((a, b) => b.path.length - a.path.length);

    for (const cookie of candidates) {
      if (!result.has(cookie.name)) result.set(cookie.name, cookie.value);
    }
    return result;
  }

  /** 移除过期 cookie，返回移除数量 */
  pruneExpired(now = Date.now()) {
    let removed = 0;
    for (const [key, cookie] of this.#cookies) {
      if (cookie.expiresAt !== null && cookie.expiresAt <= now) {
        this.#cookies.delete(key);
        removed += 1;
      }
    }
    return removed;
  }

  clear() {
    this.#cookies.clear();
  }

  /** 诊断快照：只暴露 cookie 名和作用域，不暴露值 */
  describe() {
    return {
      count: this.#cookies.size,
      entries: [...this.#cookies.values()]
        .map((cookie) => ({
          name: cookie.name,
          domain: cookie.domain,
          path: cookie.path,
          secure: cookie.secure,
          hostOnly: cookie.hostOnly,
          sameSite: cookie.sameSite,
          expiresAt: cookie.expiresAt,
        }))
        .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)),
    };
  }
}
