import {
  currentHref,
  currentOrigin,
} from "../../../infra/navigation/navigation-state.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";
import { originScopedState } from "./same-origin-shared-state.js";

// Cookie Map 与 CookieStore 实例原先是模块级单例，会跨 legacy Sandbox
// 共享。CookieStore 实例仍按 Realm 键控；Cookie Map 按 origin 共享——
// cookie 是 origin 作用域，同源 iframe 必须与父页面互通。
const cookieSlot = createRealmSlot(() => ({
  cookies: null,
  cookieStoreInstance: null,
}), "cookie-state");

function cookieState() {
  const state = cookieSlot.get(globalThis);
  if (state.cookies === null) {
    state.cookies = originScopedState("cookies", () => new Map()).value;
  }
  return state;
}

export function configureCookies(encoded = "") {
  const state = cookieSlot.get(globalThis);
  const { value: cookies, created } = originScopedState(
    "cookies",
    () => new Map(),
  );
  state.cookies = cookies;
  // 只在该 origin 首次建容器时灌入序列化数据。同源子 Realm 的
  // `configureCookies("")` 不能把父页面已有的 cookie 清掉。
  if (created) {
    cookies.clear();
    let offset = 0;
    while (offset < encoded.length) {
      const fields = [];
      for (let index = 0; index < 8; index += 1) {
        const decoded = decodeString(encoded, offset);
        fields.push(decoded.value);
        offset = decoded.offset;
      }
      const [
        name,
        value,
        domain,
        path,
        expires,
        secure,
        sameSite,
        partitioned,
      ] = fields;
      const cookie = {
        name,
        value,
        domain,
        path,
        expires: expires === "" ? null : Number(expires),
        secure: secure === "1",
        sameSite,
        partitioned: partitioned === "1",
      };
      cookies.set(cookieKey(name, domain, path), cookie);
    }
  }
  state.cookieStoreInstance = null;
}

export function encodeCookies() {
  purgeExpired();
  let output = "";
  for (const cookie of cookieState().cookies.values()) {
    output += encodeString(cookie.name);
    output += encodeString(cookie.value);
    output += encodeString(cookie.domain);
    output += encodeString(cookie.path);
    output += encodeString(
      cookie.expires === null ? "" : `${cookie.expires}`,
    );
    output += encodeString(cookie.secure ? "1" : "0");
    output += encodeString(cookie.sameSite);
    output += encodeString(cookie.partitioned ? "1" : "0");
  }
  return output;
}

/**
 * cookie 匹配用的文档 URL。
 *
 * `about:blank` / `about:srcdoc` 这类非 http(s) 文档没有可用的 host/path，
 * 但它们的安全 origin 继承自容器。直接 `new URL(currentHref())` 会得到空
 * hostname，导致同源 iframe 读不到父页面的 cookie。这里回退到 origin 根。
 */
function cookieUrl() {
  try {
    const url = new URL(currentHref());
    if (url.protocol === "http:" || url.protocol === "https:") return url;
  } catch {
    // 落到 origin 回退
  }
  return new URL(currentOrigin());
}

export function documentCookieString() {
  purgeExpired();
  const url = cookieUrl();
  return [...cookieState().cookies.values()]
    .filter(cookie => visibleAt(cookie, url))
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

export function setDocumentCookie(source) {
  const parts = `${source}`.split(";").map(part => part.trim());
  const first = parts.shift() ?? "";
  const equals = first.indexOf("=");
  if (equals <= 0) {
    return;
  }
  const url = cookieUrl();
  const cookie = {
    name: first.slice(0, equals).trim(),
    value: first.slice(equals + 1).trim(),
    domain: url.hostname,
    path: defaultPath(url.pathname),
    expires: null,
    secure: false,
    sameSite: "strict",
    partitioned: false,
  };
  for (const part of parts) {
    const [rawName, ...rest] = part.split("=");
    const name = rawName.toLowerCase();
    const value = rest.join("=");
    if (name === "domain") {
      const domain = value.replace(/^\./u, "").toLowerCase();
      if (url.hostname !== domain && !url.hostname.endsWith(`.${domain}`)) {
        return;
      }
      cookie.domain = domain;
    } else if (name === "path") {
      cookie.path = value.startsWith("/") ? value : "/";
    } else if (name === "expires") {
      const time = Date.parse(value);
      cookie.expires = Number.isNaN(time) ? null : time;
    } else if (name === "max-age") {
      const seconds = Number(value);
      if (Number.isFinite(seconds)) {
        cookie.expires = Date.now() + seconds * 1000;
      }
    } else if (name === "secure") {
      cookie.secure = true;
    } else if (name === "samesite") {
      cookie.sameSite = value.toLowerCase();
    } else if (name === "partitioned") {
      cookie.partitioned = true;
    }
  }
  // RFC6265bis：非安全源（http）不能写 Secure cookie，整个 cookie 被忽略。
  // 迁移前不校验 scheme，http 页面写下的 Secure cookie 会被 https 页面读到，
  // 等于凭空多出一条安全 cookie。
  if (cookie.secure && !isSecureOrigin(url)) {
    return;
  }
  storeCookie(cookie);
}

export function cookieStoreGet(options) {
  purgeExpired();
  const name = typeof options === "string"
    ? options
    : options?.name === undefined ? "" : `${options.name}`;
  return visibleCookies().find(cookie => cookie.name === name) ?? null;
}

export function cookieStoreGetAll(options) {
  purgeExpired();
  const name = typeof options === "string"
    ? options
    : options?.name === undefined ? null : `${options.name}`;
  return visibleCookies().filter(cookie => name === null || cookie.name === name);
}

export function cookieStoreSet(nameOrOptions, value) {
  const url = cookieUrl();
  const input = typeof nameOrOptions === "object" && nameOrOptions !== null
    ? nameOrOptions
    : { name: nameOrOptions, value };
  if (input.name === undefined || input.value === undefined) {
    throw new TypeError("Cookie name and value are required.");
  }
  const cookie = {
    name: `${input.name}`,
    value: `${input.value}`,
    domain: input.domain === undefined ? url.hostname : `${input.domain}`,
    path: input.path === undefined ? "/" : `${input.path}`,
    expires: input.expires === undefined ? null : Number(input.expires),
    secure: Boolean(input.secure),
    sameSite: input.sameSite === undefined ? "strict" : `${input.sameSite}`,
    partitioned: Boolean(input.partitioned),
  };
  storeCookie(cookie);
}

export function cookieStoreDelete(options) {
  const input = typeof options === "string" ? { name: options } : Object(options);
  const url = cookieUrl();
  const name = `${input.name}`;
  const path = input.path === undefined ? "/" : `${input.path}`;
  const key = cookieKey(name, url.hostname, path);
  const state = cookieState();
  const deleted = state.cookies.get(key);
  state.cookies.delete(key);
  if (deleted !== undefined) {
    notifyCookieChange([], [publicCookie(deleted)]);
  }
}

export function setCookieStoreInstance(value) {
  cookieState().cookieStoreInstance = value;
}

function storeCookie(cookie) {
  const key = cookieKey(cookie.name, cookie.domain, cookie.path);
  if (cookie.expires !== null && cookie.expires <= Date.now()) {
    const state = cookieState();
    const deleted = state.cookies.get(key);
    state.cookies.delete(key);
    if (deleted !== undefined) {
      notifyCookieChange([], [publicCookie(deleted)]);
    }
    return;
  }
  cookieState().cookies.set(key, cookie);
  notifyCookieChange([publicCookie(cookie)], []);
}

function notifyCookieChange(changed, deleted) {
  const state = cookieState();
  if (state.cookieStoreInstance === null) {
    return;
  }
  queueMicrotask(() => {
    const event = new CookieChangeEvent("change", { changed, deleted });
    state.cookieStoreInstance.dispatchEvent(event);
    const handler = state.cookieStoreInstance.onchange;
    if (typeof handler === "function") {
      handler.call(state.cookieStoreInstance, event);
    }
  });
}

function visibleCookies() {
  const url = cookieUrl();
  return [...cookieState().cookies.values()].filter(cookie => visibleAt(cookie, url)).map(publicCookie);
}

function visibleAt(cookie, url) {
  return (
    (url.hostname === cookie.domain || url.hostname.endsWith(`.${cookie.domain}`))
    && pathMatchesCookie(cookie.path, url.pathname)
    && (!cookie.secure || isSecureOrigin(url))
  );
}

/**
 * RFC6265 的 path-match。
 *
 * cookie path 与 request path 相同，或 cookie path 是 request path 的前缀且
 * cookie path 以 "/" 结尾，或前缀之后的第一个字符是 "/"。
 * 迁移前用裸 `startsWith`：`Path=/foo` 会错误匹配 `/foobar`。
 */
function pathMatchesCookie(cookiePath, requestPath) {
  if (cookiePath === requestPath) return true;
  if (!requestPath.startsWith(cookiePath)) return false;
  if (cookiePath.endsWith("/")) return true;
  return requestPath.charAt(cookiePath.length) === "/";
}

function isSecureOrigin(url) {
  return url.protocol === "https:" || url.protocol === "wss:";
}

function publicCookie(cookie) {
  return {
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path,
    expires: cookie.expires,
    secure: cookie.secure,
    sameSite: cookie.sameSite,
    partitioned: cookie.partitioned,
  };
}

function purgeExpired() {
  const now = Date.now();
  const cookies = cookieState().cookies;
  for (const [key, cookie] of cookies) {
    if (cookie.expires !== null && cookie.expires <= now) {
      cookies.delete(key);
    }
  }
}

function defaultPath(pathname) {
  const slash = pathname.lastIndexOf("/");
  return slash <= 0 ? "/" : pathname.slice(0, slash + 1);
}

function cookieKey(name, domain, path) {
  return `${name}\u0000${domain}\u0000${path}`;
}

function encodeString(value) {
  return `${value.length}:${value}`;
}

function decodeString(encoded, offset) {
  const separator = encoded.indexOf(":", offset);
  if (separator < 0) {
    throw new TypeError("Invalid encoded cookie data.");
  }
  const length = Number(encoded.slice(offset, separator));
  const start = separator + 1;
  const end = start + length;
  if (!Number.isSafeInteger(length) || length < 0 || end > encoded.length) {
    throw new TypeError("Invalid encoded cookie data.");
  }
  return { value: encoded.slice(start, end), offset: end };
}
