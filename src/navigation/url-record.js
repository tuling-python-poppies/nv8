const absoluteUrlPattern = /^([A-Za-z][A-Za-z0-9+.-]*):\/\/([^/?#]*)([^?#]*)(\?[^#]*)?(#.*)?$/u;

export function parseUrl(value, base = null) {
  const input = `${value}`;
  if (input.startsWith("blob:")) {
    return parseBlobUrl(input);
  }
  const absolute = absoluteUrlPattern.exec(input);
  if (absolute !== null) {
    return fromAbsoluteMatch(absolute);
  }
  if (base === null) {
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

export function serializeUrl(record) {
  if (record.protocol === "blob:") {
    return `blob:${record.pathname}${record.search}${record.hash}`;
  }
  const credentials = record.username === ""
    ? ""
    : `${record.username}${record.password === "" ? "" : `:${record.password}`}@`;
  return `${record.protocol}//${credentials}${record.host}${record.pathname}${record.search}${record.hash}`;
}

export function urlOrigin(record) {
  if (record.protocol === "blob:") {
    return record.blobOrigin ?? "null";
  }
  return `${record.protocol}//${record.host}`;
}

export function updateUrlComponent(record, component, value) {
  const input = `${value}`;
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
      return {
        ...record,
        hostname: input,
        host: record.port === "" ? input : `${input}:${record.port}`,
      };
    case "port":
      return withPort(record, input);
    case "pathname":
      return {
        ...record,
        pathname: normalizePath(input.startsWith("/") ? input : `/${input}`),
      };
    case "search":
      return {
        ...record,
        search: input === "" ? "" : `?${input.replace(/^\?/u, "")}`,
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
  const parsedAuthority = parseAuthority(match[2], protocol);
  const { username, password, hostname, port, host } = parsedAuthority;
  return {
    protocol,
    username,
    password,
    host,
    hostname,
    port,
    pathname: normalizePath(match[3] || "/"),
    search: match[4] || "",
    hash: match[5] || "",
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
      : urlOrigin(fromAbsoluteMatch(
        absoluteUrlPattern.exec(`${originMatch[1]}/`),
      )),
  };
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

function normalizePath(pathname) {
  const segments = pathname.split("/");
  const normalized = [];
  for (const segment of segments) {
    if (segment === "" || segment === ".") {
      continue;
    }
    if (segment === "..") {
      normalized.pop();
    } else {
      normalized.push(segment);
    }
  }
  return `/${normalized.join("/")}${pathname.endsWith("/") && normalized.length > 0 ? "/" : ""}`;
}

function withHost(record, host) {
  const { hostname, port } = splitHost(host, record.protocol);
  return {
    ...record,
    host: port === "" ? hostname : `${hostname}:${port}`,
    hostname,
    port,
  };
}

function withPort(record, port) {
  if (port !== "" && (!/^\d+$/u.test(port) || Number(port) > 65535)) {
    return record;
  }
  const normalized = isDefaultPort(record.protocol, port) ? "" : port;
  return {
    ...record,
    port: normalized,
    host: normalized === ""
      ? record.hostname
      : `${record.hostname}:${normalized}`,
  };
}

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
  return {
    username,
    password,
    ...splitHost(rawHost, protocol),
  };
}

function splitHost(value, protocol) {
  let hostname = value;
  let port = "";
  if (value.startsWith("[")) {
    const close = value.indexOf("]");
    if (close !== -1) {
      hostname = value.slice(0, close + 1).toLowerCase();
      if (value[close + 1] === ":") {
        port = validPort(value.slice(close + 2));
      }
    }
  } else {
    const separator = value.lastIndexOf(":");
    if (separator !== -1 && /^\d*$/u.test(value.slice(separator + 1))) {
      hostname = value.slice(0, separator).toLowerCase();
      port = validPort(value.slice(separator + 1));
    } else {
      hostname = value.toLowerCase();
    }
  }
  if (isDefaultPort(protocol, port)) {
    port = "";
  }
  return {
    hostname,
    port,
    host: port === "" ? hostname : `${hostname}:${port}`,
  };
}

function validPort(value) {
  return value === "" || Number(value) > 65535 ? "" : value;
}

function isDefaultPort(protocol, port) {
  return (protocol === "http:" && port === "80")
    || (protocol === "https:" && port === "443");
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

function encodeUserInfo(value) {
  return encodeURIComponent(value)
    .replaceAll("%3A", ":")
    .replaceAll("%3a", ":");
}
