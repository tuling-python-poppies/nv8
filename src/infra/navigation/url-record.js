/**
 * URL 记录的解析、序列化与组件更新。
 *
 * 基准是**真实浏览器**（Edge 151 / Chromium），既不是规范条文也不是 Node 的
 * `URL`。三者在主机解析上并不一致，实测对比：
 *
 * | 输入 | 真实 Edge | Node | WHATWG 条文 |
 * |---|---|---|---|
 * | `https://a b/` | `https://a%20b/` | THROWS | 失败 |
 * | `http://%` | THROWS | THROWS | 失败 |
 * | `nv8-unknown://x` | `nv8-unknown://x` | 同 | 同 |
 *
 * 空格那一行尤其说明为什么不能拿 Node 当代理：Chromium 的
 * `url_canon_host.cc` 里 `kHostCharLookup` 把空格标成 **escape** 而不是
 * **invalid**，所以浏览器接受并编码成 `%20`；规范和 Node 都判失败。
 * 按 Node 实现会得出「应该抛」的错误结论。
 *
 * 因此主机字符分三类而不是两类：
 *
 * - **safe** —— 原样（字母折成小写）
 * - **escape** —— 百分号编码，不失败
 * - **forbidden** —— 解析失败
 *
 * 只有 forbidden 一类会抛。把 escape 类错记成 forbidden 会让大量真实可用的
 * URL 变成 TypeError，比放过更危险——`new URL()` 常被放在 try/catch 里当输入
 * 校验，一旦误判整段逻辑就走错分支。
 */

const absoluteUrlPattern = /^([A-Za-z][A-Za-z0-9+.-]*):\/\/([^/?#]*)([^?#]*)(\?[^#]*)?(#.*)?$/u;

/**
 * 有 scheme 但**没有** `//` 的绝对 URL —— WHATWG 的「opaque path」
 * （旧称 cannot-be-a-base-URL）。
 *
 * `about:blank` / `mailto:` / `data:` / `javascript:` / `tel:` / `urn:` 全属此类。
 * 原实现完全不认它们，后果分两种，第二种更糟：
 *
 * | 输入 | 原行为 | 真实浏览器 |
 * |---|---|---|
 * | `new URL('mailto:a@b.com')` | THROWS | `mailto:a@b.com` |
 * | `new URL('mailto:a@b.com', base)` | `https://t.test/dir/mailto:a@b.com` | `mailto:a@b.com` |
 *
 * 抛错至少是显式失败；**带 base 时它静默拼成了一个 http URL**，origin 还成了
 * 父页面的。脚本拿这个结果去比对或发请求都会走到完全错误的分支。
 */
const opaqueUrlPattern = /^([A-Za-z][A-Za-z0-9+.-]*):([^?#]*)(\?[^#]*)?(#.*)?$/u;

/**
 * WHATWG 的 "special scheme"。影响三件事，缺一件都会出现可检测偏差：
 *
 * 1. 主机不可为空（`file:` 例外，`file:///etc/passwd` 的主机就是空的）
 * 2. 空路径序列化成 `/`；非特殊 scheme **不补**尾斜杠
 *    （实测 `nv8-unknown://x` 的 `href` 就是 `nv8-unknown://x`）
 * 3. 主机按 domain 规则解析（可转义），而不是 opaque 规则（只校验）
 */
const SPECIAL_SCHEMES = new Set([
  "ftp:",
  "file:",
  "http:",
  "https:",
  "ws:",
  "wss:",
]);

/**
 * 特殊 scheme 的默认端口。
 *
 * `file:` 的默认端口是 `null`——它没有端口概念，因此没有可剥离的默认端口。
 * 只认 http/https 会让 `ws://x:80/`、`wss://x:443/`、`ftp://x:21/` 的
 * `host` 与 `origin` 都多出一个端口，与真实浏览器不一致。
 */
const DEFAULT_PORTS = Object.freeze({
  "ftp:": "21",
  "file:": null,
  "http:": "80",
  "https:": "443",
  "ws:": "80",
  "wss:": "443",
});

/** domain 主机里导致**解析失败**的 ASCII 字符（另加 C0 控制符与 DEL）。 */
const FORBIDDEN_DOMAIN_CHARS = new Set([
  "%",
  "#",
  "/",
  ":",
  "<",
  ">",
  "?",
  "@",
  "[",
  "\\",
  "]",
  "^",
  "|",
]);

/** domain 主机里可以原样保留的字符；其余 ASCII 走百分号编码。 */
const SAFE_DOMAIN_CHAR = /^[A-Za-z0-9\-._~]$/u;

/**
 * opaque 主机（非特殊 scheme）的禁用字符。
 *
 * 这里按规范的 forbidden host code point，**不**做 escape 分类——非特殊
 * scheme 的主机不参与 IDN，浏览器也不对它做 domain 那套转义。
 */
const FORBIDDEN_OPAQUE_CHARS = new Set([
  "\u0000",
  "\t",
  "\n",
  "\r",
  " ",
  "#",
  "/",
  ":",
  "<",
  ">",
  "?",
  "@",
  "[",
  "\\",
  "]",
  "^",
  "|",
]);

const IPV6_PATTERN = new RegExp(
  "^(?:"
  + "(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}"
  + "|(?:[0-9a-f]{1,4}:){1,7}:"
  + "|(?:[0-9a-f]{1,4}:){1,6}:[0-9a-f]{1,4}"
  + "|(?:[0-9a-f]{1,4}:){1,5}(?::[0-9a-f]{1,4}){1,2}"
  + "|(?:[0-9a-f]{1,4}:){1,4}(?::[0-9a-f]{1,4}){1,3}"
  + "|(?:[0-9a-f]{1,4}:){1,3}(?::[0-9a-f]{1,4}){1,4}"
  + "|(?:[0-9a-f]{1,4}:){1,2}(?::[0-9a-f]{1,4}){1,5}"
  + "|[0-9a-f]{1,4}:(?::[0-9a-f]{1,4}){1,6}"
  + "|:(?:(?::[0-9a-f]{1,4}){1,7}|:)"
  + "|(?:[0-9a-f]{1,4}:){6}(?:\\d{1,3}\\.){3}\\d{1,3}"
  + "|(?:[0-9a-f]{1,4}:){1,5}:(?:\\d{1,3}\\.){3}\\d{1,3}"
  + "|::(?:[0-9a-f]{1,4}:){0,5}(?:\\d{1,3}\\.){3}\\d{1,3}"
  + ")$",
  "u",
);

export function parseUrl(value, base = null) {
  const input = applySpecialSchemeBackslashes(`${value}`, base);
  if (input.startsWith("blob:")) {
    return parseBlobUrl(input);
  }
  const absolute = absoluteUrlPattern.exec(input);
  if (absolute !== null) {
    return fromAbsoluteMatch(absolute);
  }
  const opaque = opaqueUrlPattern.exec(input);
  if (opaque !== null) {
    return fromOpaqueMatch(opaque);
  }
  if (base === null) {
    throw new TypeError("Invalid URL");
  }
  if (base.opaquePath === true) {
    // opaque path 不能当相对解析的基准：`mailto:a@b` 没有目录结构可以拼。
    // 规范只允许纯 fragment。空串按"沿用 base"处理——它不产生新路径，
    // 而抛错会让 `new URL('', location.href)` 这类无害写法失败。
    if (input.startsWith("#")) return { ...base, hash: input };
    if (input === "") return { ...base };
    throw new TypeError("Invalid URL");
  }
  if (input.startsWith("//")) {
    return parseUrl(`${base.protocol}${input}`, null);
  }
  if (input.startsWith("#")) {
    return { ...base, hash: input };
  }
  if (input.startsWith("?")) {
    return { ...base, search: input, hash: "" };
  }
  if (input === "") {
    return { ...base, hash: "" };
  }
  const split = splitPathQueryHash(input);
  const pathname = split.pathname.startsWith("/")
    ? normalizePath(split.pathname)
    : normalizePath(`${directoryOf(base.pathname)}${split.pathname}`);
  return {
    ...base,
    pathname,
    search: split.search,
    hash: split.hash,
  };
}

/**
 * 特殊 scheme 里 `\` 与 `/` 等价（WHATWG 的 "special" 判定）。
 *
 * 原实现把 `\` 当普通字符送进主机解析，于是 `http://a\b/` 抛 TypeError；
 * 真实浏览器把它当分隔符，解析成 host=`a`、path=`/b/`。
 *
 * 只替换 `?` / `#` 之前的部分：query 与 fragment 里的 `\` 是普通字符。
 * 这一步必须发生在正则切分之前，否则 `http:\\a\b` 这类输入连 scheme 都识别不出。
 */
function applySpecialSchemeBackslashes(input, base) {
  const schemeMatch = /^([A-Za-z][A-Za-z0-9+.-]*):/u.exec(input);
  const protocol = schemeMatch === null
    ? base?.protocol ?? null
    : `${schemeMatch[1].toLowerCase()}:`;
  if (protocol === null || !SPECIAL_SCHEMES.has(protocol)) {
    return input;
  }
  const terminator = input.search(/[?#]/u);
  if (terminator === -1) {
    return input.replaceAll("\\", "/");
  }
  return `${input.slice(0, terminator).replaceAll("\\", "/")}${input.slice(terminator)}`;
}

export function serializeUrl(record) {
  if (record.protocol === "blob:") {
    return `blob:${record.pathname}${record.search}${record.hash}`;
  }
  if (record.opaquePath === true) {
    // opaque path 不带 `//`，也没有 authority
    return `${record.protocol}${record.pathname}${record.search}${record.hash}`;
  }
  // username 为空但 password 非空时必须保留 `:password@`：
  // `new URL('http://:secret@x/')` 的 href 就带这个前导冒号，丢掉它等于吞凭据。
  const credentials = record.username === "" && record.password === ""
    ? ""
    : `${record.username}${record.password === "" ? "" : `:${record.password}`}@`;
  return `${record.protocol}//${credentials}${record.host}${record.pathname}${record.search}${record.hash}`;
}

export function urlOrigin(record) {
  if (record.protocol === "blob:") {
    return record.blobOrigin ?? "null";
  }
  // 只有特殊 scheme 有元组 origin。其余一律不透明，返回 `"null"`。
  //
  // 之前非特殊 scheme 会拼出 `protocol//host`，于是 `about:blank` 之间、
  // `nv8-unknown://x` 之间会被判成**同源**——真实浏览器给的是两个互不相同的
  // 不透明 origin。同源判断错在放宽方向上，比报错危险。
  //
  // `file:` 保留 `file://`（host 为空），与 Chromium 实测一致。
  if (!SPECIAL_SCHEMES.has(record.protocol)) {
    return "null";
  }
  return `${record.protocol}//${record.host}`;
}

export function updateUrlComponent(record, component, value) {
  const input = `${value}`;
  // opaque path 没有 authority，也没有可结构化的路径。规范要求这四个 setter
  // 静默忽略——真去写会造出 `mailto://host` 这种既无法序列化回原样、
  // 也不可能出现在真实浏览器里的记录。
  if (
    record.opaquePath === true
    && ["host", "hostname", "port", "pathname"].includes(component)
  ) {
    return record;
  }
  switch (component) {
    case "href":
      return parseUrl(input, record);
    case "protocol":
      return updateProtocol(record, input);
    case "username":
      return { ...record, username: encodeUserInfo(input) };
    case "password":
      return { ...record, password: encodeUserInfo(input) };
    case "host":
      return withHost(record, input);
    case "hostname":
      return withHostname(record, input);
    case "port":
      return withPort(record, input);
    case "pathname":
      return {
        ...record,
        pathname: normalizePath(input.startsWith("/") ? input : `/${input}`),
      };
    case "search":
      // `URL.search` setter 语义：先剥掉一个前导 `?`，再按 query 的
      // percent-encode 集合编码。不编码的话 `#` 会在后续解析中被当成
      // fragment 起点，把用户写的查询截断。
      return {
        ...record,
        search: input === "" ? "" : `?${encodeQuery(input.replace(/^\?/u, ""))}`,
      };
    case "hash":
      return {
        ...record,
        hash: input === "" ? "" : `#${input.replace(/^#/u, "")}`,
      };
    default:
      return record;
  }
}

function fromAbsoluteMatch(match) {
  const protocol = `${match[1].toLowerCase()}:`;
  const { authority, path } = ignoreExtraAuthoritySlashes(
    protocol,
    match[2],
    match[3],
  );
  const parsed = parseAuthority(authority, protocol);
  if (parsed === null) {
    throw new TypeError("Invalid URL");
  }
  const { username, password, hostname, port, host } = parsed;
  return {
    protocol,
    username,
    password,
    host,
    hostname,
    port,
    pathname: normalizeAbsolutePath(path, protocol),
    search: match[4] || "",
    hash: match[5] || "",
  };
}

/**
 * 特殊 scheme 会忽略 `//` 之后多余的斜杠：`http:///a` 在真实浏览器里等价于
 * `http://a/`。
 *
 * `file:` 例外——`file:///etc/passwd` 的主机确实是空的，把第三个斜杠当成主机
 * 起点会把它解析成 `file://etc/passwd`。
 */
function ignoreExtraAuthoritySlashes(protocol, authority, path) {
  if (
    authority !== ""
    || protocol === "file:"
    || !SPECIAL_SCHEMES.has(protocol)
  ) {
    return { authority, path };
  }
  const trimmed = path.replace(/^\/+/u, "");
  if (trimmed === "") {
    return { authority, path };
  }
  const cut = trimmed.indexOf("/");
  return cut === -1
    ? { authority: trimmed, path: "" }
    : { authority: trimmed.slice(0, cut), path: trimmed.slice(cut) };
}

/**
 * 绝对 URL 的路径。
 *
 * 特殊 scheme 空路径补 `/`；非特殊 scheme **保持为空**——实测真实 Edge
 * 给出的 `new URL('nv8-unknown://x').href` 是 `nv8-unknown://x`，
 * 补成 `nv8-unknown://x/` 就是一处可检测偏差。
 */
function normalizeAbsolutePath(path, protocol) {
  if (path !== "") {
    return normalizePath(path);
  }
  return SPECIAL_SCHEMES.has(protocol) ? "/" : "";
}

/**
 * 构造 opaque path 记录。
 *
 * 特殊 scheme 即使写成 `http:example.com/`（没有 `//`）也**不是** opaque path：
 * 规范的 "special authority ignore slashes state" 会跳过缺失/多余的斜杠直接进
 * authority，所以它等价于 `http://example.com/`。这条不处理的话，
 * `http:example.com/` 会被当成 opaque path，origin 变成 `null`。
 */
function fromOpaqueMatch(match) {
  const protocol = `${match[1].toLowerCase()}:`;
  const path = match[2] ?? "";
  const search = match[3] ?? "";
  const hash = match[4] ?? "";

  if (SPECIAL_SCHEMES.has(protocol)) {
    return parseUrl(
      `${protocol}//${path.replace(/^\/+/u, "")}${search}${hash}`,
      null,
    );
  }

  return {
    protocol,
    username: "",
    password: "",
    host: "",
    hostname: "",
    port: "",
    pathname: path,
    search,
    hash,
    opaquePath: true,
  };
}

function parseBlobUrl(input) {
  const split = splitPathQueryHash(input.slice(5));
  const originMatch = /^([A-Za-z][A-Za-z0-9+.-]*:\/\/[^/]+)(?:\/|$)/u
    .exec(split.pathname);
  return {
    protocol: "blob:",
    username: "",
    password: "",
    host: "",
    hostname: "",
    port: "",
    pathname: split.pathname,
    search: split.search,
    hash: split.hash,
    blobOrigin: originMatch === null
      ? "null"
      : blobInnerOrigin(originMatch[1]),
  };
}

function blobInnerOrigin(prefix) {
  try {
    return urlOrigin(fromAbsoluteMatch(
      absoluteUrlPattern.exec(`${prefix}/`),
    ));
  } catch {
    return "null";
  }
}

function splitPathQueryHash(value) {
  const hashIndex = value.indexOf("#");
  const withoutHash = hashIndex === -1 ? value : value.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : value.slice(hashIndex);
  const queryIndex = withoutHash.indexOf("?");
  return {
    pathname: queryIndex === -1
      ? withoutHash
      : withoutHash.slice(0, queryIndex),
    search: queryIndex === -1 ? "" : withoutHash.slice(queryIndex),
    hash,
  };
}

function directoryOf(pathname) {
  const slash = pathname.lastIndexOf("/");
  return slash === -1 ? "/" : pathname.slice(0, slash + 1);
}

/**
 * WHATWG 的 path state。
 *
 * 按段处理而不是「split 后丢掉空段」：
 *
 * | 输入 | 原行为 | 真实 Edge / 规范 |
 * |---|---|---|
 * | `/a//b` | `/a/b`（吞空段） | `/a//b` |
 * | `/a/b/..` | `/a`（丢尾斜杠） | `/a/` |
 * | `/a/b/.` | `/a/b` | `/a/b/` |
 * | `/a/%2e%2e/b` | 原样 | `/b`（`.%2e` 等也算 dot segment） |
 *
 * 规则：路径以根空段开头并**保留**它（`..` 不再把它弹掉）；遇到 `..` 弹栈，
 * `.` 归并；`.` / `..` 位于末尾时补一个空段，序列化时表现为尾斜杠。
 * 分隔符之间的空段一律入栈，所以 `/a//b` 不会被吞成 `/a/b`。
 */
function normalizePath(pathname) {
  const rooted = pathname.startsWith("/");
  // 根路径的路径列表以空段开头（序列化时每个段前加 `/`，第一个空段就是根斜杠）。
  const segments = rooted ? [""] : [];
  const floor = rooted ? 1 : 0;
  let start = rooted ? 1 : 0;
  for (let index = start; index <= pathname.length; index += 1) {
    const atEnd = index === pathname.length;
    if (!atEnd && pathname[index] !== "/") {
      continue;
    }
    const segment = pathname.slice(start, index);
    if (isDoubleDotPathSegment(segment)) {
      if (segments.length > floor) {
        segments.pop();
      }
      if (atEnd) {
        segments.push("");
      }
    } else if (isSingleDotPathSegment(segment)) {
      if (atEnd) {
        segments.push("");
      }
    } else {
      segments.push(encodePathSegment(segment));
    }
    start = index + 1;
  }
  return segments.join("/");
}

function isDoubleDotPathSegment(segment) {
  return /^(?:\.\.|\.%2e|%2e\.|%2e%2e)$/iu.test(segment);
}

function isSingleDotPathSegment(segment) {
  return segment === "." || /^%2e$/iu.test(segment);
}

/** path 的 percent-encode 集合（WHATWG path percent-encode set）。 */
const PATH_PERCENT_ENCODE = new Set([
  " ",
  "\"",
  "#",
  "<",
  ">",
  "?",
  "`",
  "{",
  "}",
]);

function encodePathSegment(segment) {
  return percentEncodeForSet(segment, PATH_PERCENT_ENCODE);
}

// ------------------------------------------------------------- 主机与端口

/**
 * 解析 authority（可能含 userinfo / 主机 / 端口）。
 *
 * @returns {{username: string, password: string, hostname: string,
 *   port: string, host: string} | null} 解析失败返回 `null`，由调用方决定
 *   是抛 TypeError（构造器）还是静默忽略（setter）。
 */
function parseAuthority(authority, protocol) {
  const at = authority.lastIndexOf("@");
  const userInfo = at === -1 ? "" : authority.slice(0, at);
  const rawHost = at === -1 ? authority : authority.slice(at + 1);
  const userSeparator = userInfo.indexOf(":");
  const username = encodeUserInfo(
    userSeparator === -1 ? userInfo : userInfo.slice(0, userSeparator),
  );
  const password = encodeUserInfo(
    userSeparator === -1 ? "" : userInfo.slice(userSeparator + 1),
  );
  const hostAndPort = parseHostAndPort(rawHost, protocol);
  if (hostAndPort === null) {
    return null;
  }
  return { username, password, ...hostAndPort };
}

/**
 * 拆主机与端口，然后分别校验。
 *
 * 端口按**最左**冒号切分而不是最右：`a:b:c` 的端口是 `b:c`，非法，
 * 于是整个 URL 解析失败（实测真实 Edge 对 `http://a:b:c/` 抛 TypeError）。
 * 按最右冒号切会把 `a:b` 当成主机名放过去。
 */
function parseHostAndPort(value, protocol) {
  const split = splitHostPort(value);
  if (split === null) {
    return null;
  }
  const hostname = parseHostname(split.host, protocol);
  if (hostname === null) {
    return null;
  }
  const normalizedHostname = SPECIAL_SCHEMES.has(protocol)
    ? parseIPv4(hostname) ?? hostname
    : hostname;
  const port = normalizePortValue(split.port, protocol);
  if (port === null) {
    return null;
  }
  return {
    hostname: normalizedHostname,
    port,
    host: port === "" ? normalizedHostname : `${normalizedHostname}:${port}`,
  };
}

function splitHostPort(value) {
  if (value.startsWith("[")) {
    const close = value.indexOf("]");
    if (close === -1) {
      return null;
    }
    const rest = value.slice(close + 1);
    if (rest === "") {
      return { host: value, port: "" };
    }
    if (!rest.startsWith(":")) {
      return null;
    }
    return { host: value.slice(0, close + 1), port: rest.slice(1) };
  }
  const colon = value.indexOf(":");
  return colon === -1
    ? { host: value, port: "" }
    : { host: value.slice(0, colon), port: value.slice(colon + 1) };
}

function parseHostname(value, protocol) {
  if (value.startsWith("[")) {
    return parseIPv6Host(value);
  }
  const special = SPECIAL_SCHEMES.has(protocol);
  if (value === "") {
    // 空主机只对 `file:` 与非特殊 scheme 合法。
    return special && protocol !== "file:" ? null : "";
  }
  return special ? parseDomainHost(value) : parseOpaqueHost(value);
}

/**
 * IPv6 字面量。
 *
 * 没有闭合的 `]` 直接失败——这正是 `http://[` 抛 TypeError 的原因。
 * 不做压缩形式的重新序列化（真实浏览器会，但没有探针覆盖，
 * 编一个近似实现只会引入新的偏差）。
 */
function parseIPv6Host(value) {
  if (!value.endsWith("]") || value.length < 3) {
    return null;
  }
  const body = value.slice(1, -1).toLowerCase();
  return IPV6_PATTERN.test(body) ? `[${body}]` : null;
}

/**
 * domain 主机（特殊 scheme）。
 *
 * 三类字符：safe 原样、escape 编码、forbidden 失败。分类依据是 Chromium 的
 * `kHostCharLookup`，不是规范的 forbidden domain code point ——两者对空格
 * 的判定相反。
 */
function parseDomainHost(value) {
  let output = "";
  let index = 0;
  while (index < value.length) {
    const character = value[index];
    if (character === "%") {
      const hex = value.slice(index + 1, index + 3);
      if (!/^[0-9A-Fa-f]{2}$/u.test(hex)) {
        // 无效的转义序列。`http://%` 走这条路。
        return null;
      }
      const byte = Number.parseInt(hex, 16);
      if (isForbiddenDomainByte(byte)) {
        return null;
      }
      output += `%${hex.toUpperCase()}`;
      index += 3;
      continue;
    }
    const code = value.codePointAt(index);
    if (code > 0x7f) {
      // 非 ASCII 走 ToASCII（punycode）。真实浏览器把 `你好.test` 序列化为
      // `xn--6qq79v.test`；原样保留会造出与浏览器不同的 href（F24）。
      // 需要整段主机一次性转换（IDNA 是按 label 的），这里在检测到首个
      // 非 ASCII 字符时对整段重新走 domainToASCII，失败则整个解析失败。
      return asciiDomain(value) ?? null;
    }
    index += 1;
    if (isForbiddenDomainByte(code)) {
      return null;
    }
    if (SAFE_DOMAIN_CHAR.test(character)) {
      output += character.toLowerCase();
      continue;
    }
    output += percentEncodeByte(code);
  }
  return output;
}

function isForbiddenDomainByte(byte) {
  if (byte <= 0x1f || byte === 0x7f) {
    return true;
  }
  return FORBIDDEN_DOMAIN_CHARS.has(String.fromCharCode(byte));
}

/**
 * domain 主机的 ToASCII：逐 label 处理，非 ASCII label 转 punycode，
 * ASCII label 走与解析阶段一致的 safe/escape/forbidden 分类；
 * 空 label（末尾点除外）或转换失败返回 null。
 */
function asciiDomain(value) {
  const labels = value.split(".");
  if (labels.some((label, index) => label.length === 0 && index !== labels.length - 1)) {
    return null;
  }
  const output = [];
  for (const label of labels) {
    const ascii = asciiLabel(label);
    if (ascii === null) return null;
    output.push(ascii);
  }
  return output.join(".");
}

function asciiLabel(label) {
  if (label === "") return "";
  let output = "";
  for (const character of label) {
    const code = character.codePointAt(0);
    if (code > 0x7f) return punycodeLabel(label);
    if (isForbiddenDomainByte(code)) return null;
    if (SAFE_DOMAIN_CHAR.test(character)) {
      output += character.toLowerCase();
      continue;
    }
    output += percentEncodeByte(code);
  }
  return output;
}

// RFC 3492 bootstring encoder. Kept local because internal Realm modules may not
// import node:url (the module loader deliberately rejects host-module imports).
const PUNYCODE_BASE = 36;
const PUNYCODE_TMIN = 1;
const PUNYCODE_TMAX = 26;
const PUNYCODE_SKEW = 38;
const PUNYCODE_DAMP = 700;
const PUNYCODE_INITIAL_BIAS = 72;
const PUNYCODE_INITIAL_N = 128;

function punycodeLabel(label) {
  const codePoints = [...label].map(character => character.codePointAt(0));
  let output = codePoints.filter(code => code < 0x80).map(code => String.fromCharCode(code));
  const basicCount = output.length;
  let handled = basicCount;
  if (handled > 0) output.push("-");
  let n = PUNYCODE_INITIAL_N;
  let delta = 0;
  let bias = PUNYCODE_INITIAL_BIAS;
  while (handled < codePoints.length) {
    let minimum = Number.MAX_SAFE_INTEGER;
    for (const code of codePoints) {
      if (code >= n && code < minimum) minimum = code;
    }
    if (!Number.isSafeInteger(minimum) || minimum - n > Math.floor(
      (Number.MAX_SAFE_INTEGER - delta) / (handled + 1),
    )) return null;
    delta += (minimum - n) * (handled + 1);
    n = minimum;
    for (const code of codePoints) {
      if (code < n) delta += 1;
      if (code !== n) continue;
      let quotient = delta;
      for (let k = PUNYCODE_BASE;; k += PUNYCODE_BASE) {
        const threshold = k <= bias + PUNYCODE_TMIN
          ? PUNYCODE_TMIN
          : k >= bias + PUNYCODE_TMAX
            ? PUNYCODE_TMAX
            : k - bias;
        if (quotient < threshold) break;
        const digit = threshold + (quotient - threshold) % (PUNYCODE_BASE - threshold);
        output.push(punycodeDigit(digit));
        quotient = Math.floor((quotient - threshold) / (PUNYCODE_BASE - threshold));
      }
      output.push(punycodeDigit(quotient));
      bias = punycodeAdapt(delta, handled + 1, handled === basicCount);
      delta = 0;
      handled += 1;
    }
    delta += 1;
    n += 1;
  }
  const result = `xn--${output.join("")}`;
  return result.length <= 63 ? result : null;
}

function punycodeDigit(value) {
  return String.fromCharCode(value < 26 ? 0x61 + value : 0x30 + value - 26);
}

function punycodeAdapt(delta, points, first) {
  let value = first ? Math.floor(delta / PUNYCODE_DAMP) : Math.floor(delta / 2);
  value += Math.floor(value / points);
  let divisions = 0;
  while (value > Math.floor(
    ((PUNYCODE_BASE - PUNYCODE_TMIN) * PUNYCODE_TMAX) / 2,
  )) {
    value = Math.floor(value / (PUNYCODE_BASE - PUNYCODE_TMIN));
    divisions += PUNYCODE_BASE;
  }
  return divisions + Math.floor(
    ((PUNYCODE_BASE - PUNYCODE_TMIN + 1) * value)
      / (value + PUNYCODE_SKEW),
  );
}

function parseIPv4(value) {
  if (!/^\d+(?:\.\d+){0,3}$/u.test(value)) return null;
  const parts = value.split(".").map(Number);
  if (parts.some(part => !Number.isSafeInteger(part) || part < 0)) return null;
  // WHATWG：最后一段必须小于 256 ** (5 − 段数)，其余段必须是字节。
  const limit = [0x100000000, 0x1000000, 0x10000, 0x100][parts.length - 1];
  if (parts.slice(0, -1).some(part => part > 255) || parts.at(-1) >= limit) return null;
  let number = parts.at(-1);
  for (let index = 0; index < parts.length - 1; index += 1) {
    number += parts[index] * 256 ** (3 - index);
  }
  return [number >>> 24, (number >>> 16) & 255, (number >>> 8) & 255, number & 255].join(".");
}

function parseOpaqueHost(value) {
  for (const character of value) {
    if (FORBIDDEN_OPAQUE_CHARS.has(character)) {
      return null;
    }
  }
  return value;
}

function percentEncodeByte(byte) {
  return `%${byte.toString(16).toUpperCase().padStart(2, "0")}`;
}

/**
 * 端口归一化。
 *
 * @returns {string | null} 非法端口返回 `null`（解析时抛、setter 时忽略）。
 */
function normalizePortValue(port, protocol) {
  if (port === "") {
    return "";
  }
  if (!/^\d+$/u.test(port)) {
    return null;
  }
  const number = Number(port);
  if (number > 65535) {
    return null;
  }
  const normalized = `${number}`;
  return isDefaultPort(protocol, normalized) ? "" : normalized;
}

/** `host` setter：非法值静默忽略，规范要求不抛。 */
function withHost(record, host) {
  const parsed = parseHostAndPort(host, record.protocol);
  if (parsed === null) {
    return record;
  }
  return {
    ...record,
    host: parsed.host,
    hostname: parsed.hostname,
    port: parsed.port,
  };
}

/** `hostname` setter：非法值静默忽略。 */
function withHostname(record, hostname) {
  const parsed = parseHostname(hostname, record.protocol);
  if (parsed === null) {
    return record;
  }
  const normalized = SPECIAL_SCHEMES.has(record.protocol)
    ? parseIPv4(parsed) ?? parsed
    : parsed;
  return {
    ...record,
    hostname: normalized,
    host: record.port === "" ? normalized : `${normalized}:${record.port}`,
  };
}

/** `port` setter：非法值静默忽略。 */
function withPort(record, port) {
  const normalized = normalizePortValue(port, record.protocol);
  if (normalized === null) {
    return record;
  }
  return {
    ...record,
    port: normalized,
    host: normalized === ""
      ? record.hostname
      : `${record.hostname}:${normalized}`,
  };
}

function isDefaultPort(protocol, port) {
  const defaultPort = DEFAULT_PORTS[protocol];
  return typeof defaultPort === "string" && defaultPort === port;
}

function updateProtocol(record, value) {
  const scheme = value.replace(/:$/u, "").toLowerCase();
  if (!/^[a-z][a-z0-9+.-]*$/u.test(scheme)) {
    return record;
  }
  const protocol = `${scheme}:`;
  const port = isDefaultPort(protocol, record.port) ? "" : record.port;
  return {
    ...record,
    protocol,
    port,
    host: port === "" ? record.hostname : `${record.hostname}:${port}`,
  };
}

/**
 * userinfo 的 percent-encode 集合：path 集合加 `/ : ; = @ [ \ ] ^ |`。
 *
 * 与旧实现的差别有两条，都是可检测偏差：
 *
 * 1. **不再二次编码**。旧实现用 `encodeURIComponent`，把输入里合法的
 *    `%3A` 变成 `%253A`；WHATWG 对 `%` 不做编码，合法/非法转义都原样保留。
 * 2. **`:` 编码成 `%3A` 而不是还原成字面 `:`**。旧实现把 `%3A` 反解成 `:`,
 *    于是用户名里的冒号会重新被解析成 user/password 分隔符。
 */
const USERINFO_PERCENT_ENCODE = new Set([
  " ",
  "\"",
  "#",
  "<",
  ">",
  "?",
  "`",
  "{",
  "}",
  "/",
  ":",
  ";",
  "=",
  "@",
  "[",
  "\\",
  "]",
  "^",
  "|",
]);

function encodeUserInfo(value) {
  return percentEncodeForSet(value, USERINFO_PERCENT_ENCODE);
}

/** query 的 percent-encode 集合。`'` 在真实 Chromium 中一律编码。 */
const QUERY_PERCENT_ENCODE = new Set([" ", "\"", "#", "<", ">", "'"]);

function encodeQuery(value) {
  return percentEncodeForSet(value, QUERY_PERCENT_ENCODE);
}

function percentEncodeForSet(value, encodeSet) {
  let output = "";
  for (const character of value) {
    const code = character.codePointAt(0);
    if (code <= 0x1f || code > 0x7e || encodeSet.has(character)) {
      output += percentEncodeCharacter(character);
      continue;
    }
    // `%` 不属于任何 encode 集合：合法转义与孤立 `%` 都原样保留。
    output += character;
  }
  return output;
}

function percentEncodeCharacter(character) {
  const code = character.codePointAt(0);
  if (code <= 0x7f) {
    return percentEncodeByte(code);
  }
  // 非 ASCII 走 UTF-8 百分号编码；`encodeURIComponent` 对单个码点
  // 的处理与规范的 "UTF-8 percent-encode" 一致，且正确合并代理对。
  return encodeURIComponent(character);
}
