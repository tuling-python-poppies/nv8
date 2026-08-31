import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function Headers() {
  if (!new.target) throw new TypeError("Constructor Headers requires 'new'");
  const values = new Map();
  state.set(this, values);
  const initial = arguments[0];
  if (initial === undefined || initial === null) return;
  if (state.has(initial)) {
    for (const [name, value] of headersEntries(initial)) {
      values.set(name, value);
    }
    return;
  }
  if (typeof initial[Symbol.iterator] === "function") {
    for (const pair of initial) {
      if (!pair || typeof pair[Symbol.iterator] !== "function") {
        throw new TypeError("Each header entry must be a pair");
      }
      const [name, value] = pair;
      headersAppend(this, name, value);
    }
    return;
  }
  for (const name of Object.keys(Object(initial))) {
    headersAppend(this, name, initial[name]);
  }
}
registerNativeFunction(Headers, "Headers");

export function headersAppend(headers, name, value) {
  const values = requireHeaders(headers);
  const normalizedName = normalizeName(name);
  const normalizedValue = normalizeValue(value);
  const current = values.get(normalizedName);
  values.set(
    normalizedName,
    current === undefined ? normalizedValue : `${current}, ${normalizedValue}`,
  );
}

export function headersDelete(headers, name) {
  requireHeaders(headers).delete(normalizeName(name));
}

export function headersGet(headers, name) {
  return requireHeaders(headers).get(normalizeName(name)) ?? null;
}

export function headersGetSetCookie(headers) {
  const value = requireHeaders(headers).get("set-cookie");
  return value === undefined ? [] : [value];
}

export function headersHas(headers, name) {
  return requireHeaders(headers).has(normalizeName(name));
}

export function headersSet(headers, name, value) {
  requireHeaders(headers).set(normalizeName(name), normalizeValue(value));
}

export function headersEntries(headers) {
  return sorted(headers)[Symbol.iterator]();
}

export function headersForEach(headers, callback, thisArg) {
  if (typeof callback !== "function") throw new TypeError("A callback is required");
  for (const [name, value] of sorted(headers)) {
    Reflect.apply(callback, thisArg, [value, name, headers]);
  }
}

export function headersKeys(headers) {
  return sorted(headers).map(([name]) => name)[Symbol.iterator]();
}

export function headersValues(headers) {
  return sorted(headers).map(([, value]) => value)[Symbol.iterator]();
}

export function cloneHeaders(headers) {
  return new Headers(headers);
}

export function requireHeaders(value) {
  const values = state.get(value);
  if (values === undefined) throw new TypeError("Illegal invocation");
  return values;
}

function sorted(headers) {
  return [...requireHeaders(headers)].sort(([left], [right]) =>
    left.localeCompare(right));
}

function normalizeName(value) {
  const name = `${value}`.toLowerCase();
  if (!/^[!#$%&'*+\-.^_`|~0-9a-z]+$/u.test(name)) {
    throw new TypeError("Invalid header name");
  }
  return name;
}

function normalizeValue(value) {
  const result = `${value}`.trim();
  if (/[\0\r\n]/u.test(result)) throw new TypeError("Invalid header value");
  return result;
}
