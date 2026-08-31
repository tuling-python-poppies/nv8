import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();
const componentNames = Object.freeze([
  "protocol", "username", "password", "hostname", "port", "pathname",
  "search", "hash",
]);

export function URLPattern() {
  if (new.target === undefined) {
    throw new TypeError("URLPattern must be constructed with new");
  }
  const input = arguments[0] ?? {};
  const baseURL = arguments[1];
  const patterns = normalizePattern(input, baseURL);
  state.set(this, {
    kind: "urlPattern",
    patterns,
    compiled: Object.fromEntries(componentNames.map(name => [
      name,
      compilePattern(patterns[name]),
    ])),
    hasRegExpGroups: componentNames.some(name => /[():]/u.test(patterns[name])),
  });
}
registerNativeFunction(URLPattern, "URLPattern");

export function urlPatternProperty(value, name) {
  const record = requireRecord(value);
  if (name === "hasRegExpGroups") return record.hasRegExpGroups;
  return record.patterns[name];
}

export function urlPatternOperation(value, name, args) {
  const record = requireRecord(value);
  const result = match(record, args[0], args[1]);
  if (name === "test") return result !== null;
  if (name === "exec") return result;
  throw new TypeError(`Unsupported URLPattern operation: ${name}`);
}

function match(record, input, baseURL) {
  let url;
  try {
    url = input !== null && typeof input === "object" && !(input instanceof URL)
      ? objectURL(input, baseURL)
      : new URL(`${input}`, baseURL ?? globalThis.location?.href);
  } catch {
    return null;
  }
  const values = urlComponents(url);
  const output = { inputs: [input] };
  for (const name of componentNames) {
    const matched = record.compiled[name].exec(values[name]);
    if (matched === null) return null;
    output[name] = {
      input: values[name],
      groups: Object.freeze({ ...(matched.groups ?? {}) }),
    };
  }
  return output;
}

function normalizePattern(input, baseURL) {
  if (typeof input === "string" || input instanceof URL) {
    const url = new URL(`${input}`, baseURL ?? globalThis.location?.href);
    return urlComponents(url);
  }
  if (input === null || typeof input !== "object") {
    throw new TypeError("URLPattern input must be a string or object");
  }
  const base = new URL(
    `${input.baseURL ?? baseURL ?? globalThis.location?.href}`,
    globalThis.location?.href,
  );
  const defaults = urlComponents(base);
  return Object.fromEntries(componentNames.map(name => [
    name,
    input[name] === undefined
      ? (["protocol", "hostname", "port"].includes(name) ? defaults[name] : "*")
      : `${input[name]}`.replace(
        name === "protocol" ? /:$/u : /^[?#]/u,
        "",
      ),
  ]));
}

function objectURL(input, baseURL) {
  const base = new URL(`${baseURL ?? input.baseURL ?? globalThis.location?.href}`);
  for (const name of componentNames) {
    if (input[name] === undefined) continue;
    if (name === "protocol") base.protocol = `${input[name]}`.replace(/:$/u, "");
    else if (name === "search") base.search = `${input[name]}`.replace(/^\?/u, "");
    else if (name === "hash") base.hash = `${input[name]}`.replace(/^#/u, "");
    else base[name] = `${input[name]}`;
  }
  return base;
}

function urlComponents(url) {
  return {
    protocol: url.protocol.replace(/:$/u, ""),
    username: url.username,
    password: url.password,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search.replace(/^\?/u, ""),
    hash: url.hash.replace(/^#/u, ""),
  };
}

function compilePattern(pattern) {
  let source = "";
  let wildcardIndex = 0;
  for (let index = 0; index < pattern.length;) {
    if (pattern[index] === "*") {
      source += `(?<_${wildcardIndex}>.*)`;
      wildcardIndex += 1;
      index += 1;
      continue;
    }
    if (pattern[index] === ":") {
      const matched = /^[A-Za-z_][A-Za-z0-9_]*/u.exec(pattern.slice(index + 1));
      if (matched !== null) {
        source += `(?<${matched[0]}>[^/]+)`;
        index += matched[0].length + 1;
        continue;
      }
    }
    source += escapeRegExp(pattern[index]);
    index += 1;
  }
  return new RegExp(`^${source}$`, "u");
}

function escapeRegExp(value) {
  return /[\\^$.*+?()[\]{}|]/u.test(value) ? `\\${value}` : value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
