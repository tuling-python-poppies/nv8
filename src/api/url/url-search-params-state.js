import {
  URLSearchParams,
} from "./url-search-params-constructor.js";

const paramsState = new WeakMap();

export function initializeURLSearchParams(value, init, owner = null) {
  paramsState.set(value, {
    pairs: pairsFromInit(init),
    owner,
  });
}

export function createLinkedURLSearchParams(query, owner) {
  const value = Object.create(URLSearchParams.prototype);
  initializeURLSearchParams(value, query, owner);
  return value;
}

export function requireURLSearchParams(value) {
  const state = paramsState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function replaceURLSearchParams(value, query) {
  requireURLSearchParams(value).pairs = parseQuery(query);
}

export function mutateURLSearchParams(value, operation) {
  const state = requireURLSearchParams(value);
  operation(state.pairs);
  if (state.owner !== null) {
    state.owner(serializePairs(state.pairs));
  }
}

export function serializeURLSearchParams(value) {
  return serializePairs(requireURLSearchParams(value).pairs);
}

function pairsFromInit(init) {
  if (init === undefined) {
    return [];
  }
  if (paramsState.has(init)) {
    return requireURLSearchParams(init).pairs.map(([name, value]) => [name, value]);
  }
  if (typeof init === "string") {
    return parseQuery(init);
  }
  if (init === null) {
    return [["null", ""]];
  }
  const source = Object(init);
  if (typeof source[Symbol.iterator] === "function") {
    const output = [];
    for (const entry of source) {
      const pair = Array.from(entry);
      if (pair.length !== 2) {
        throw new TypeError(
          "Each query pair must be an iterable with exactly two items",
        );
      }
      output.push([`${pair[0]}`, `${pair[1]}`]);
    }
    return output;
  }
  return Object.keys(source).map((key) => [key, `${source[key]}`]);
}

function parseQuery(query) {
  const input = `${query}`.replace(/^\?/u, "");
  if (input === "") {
    return [];
  }
  return input.split("&").map((part) => {
    const separator = part.indexOf("=");
    const name = separator === -1 ? part : part.slice(0, separator);
    const value = separator === -1 ? "" : part.slice(separator + 1);
    return [decodeForm(name), decodeForm(value)];
  });
}

function serializePairs(pairs) {
  return pairs.map(([name, value]) => (
    `${encodeForm(name)}=${encodeForm(value)}`
  )).join("&");
}

function decodeForm(value) {
  try {
    return decodeURIComponent(value.replaceAll("+", " "));
  } catch {
    return value.replaceAll("+", " ");
  }
}

function encodeForm(value) {
  return encodeURIComponent(value)
    .replace(/[!'()~]/gu, (character) => (
      `%${character.codePointAt(0).toString(16).toUpperCase()}`
    ))
    .replaceAll("%20", "+");
}
