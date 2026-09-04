import {
  Request,
  requestClone,
  requireRequest,
  requireResponse,
  responseClone,
} from "../fetch/request-response-runtime.js";
import { replayRequest } from "../fetch/fetch-replay.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();
let storageSingleton = null;

export function Cache() { illegalConstructor("Cache"); }
export function CacheStorage() { illegalConstructor("CacheStorage"); }
export const cacheConstructors = Object.freeze([Cache, CacheStorage]);
for (const Constructor of cacheConstructors) registerNativeFunction(Constructor, Constructor.name);

export function createCacheStorage() {
  if (storageSingleton !== null) return storageSingleton;
  const value = Object.create(CacheStorage.prototype);
  state.set(value, { kind: "storage", caches: new Map() });
  storageSingleton = value;
  return value;
}

export function cacheOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "storage") return storageOperation(record, name, args);
  if (record.kind === "cache") return cacheEntryOperation(record, name, args);
  throw new TypeError(`Unsupported Cache API operation: ${name}`);
}

function storageOperation(record, name, args) {
  const cacheName = `${args[0]}`;
  if (name === "open") {
    let cache = record.caches.get(cacheName);
    if (cache === undefined) {
      cache = Object.create(Cache.prototype);
      state.set(cache, { kind: "cache", entries: [] });
      record.caches.set(cacheName, cache);
    }
    return Promise.resolve(cache);
  }
  if (name === "has") return Promise.resolve(record.caches.has(cacheName));
  if (name === "delete") return Promise.resolve(record.caches.delete(cacheName));
  if (name === "keys") return Promise.resolve([...record.caches.keys()]);
  if (name === "match") {
    return Promise.resolve().then(async () => {
      for (const cache of record.caches.values()) {
        const matched = await cacheEntryOperation(requireRecord(cache), "match", args);
        if (matched !== undefined) return matched;
      }
      return undefined;
    });
  }
}

function cacheEntryOperation(record, name, args) {
  if (name === "put") {
    const request = normalizeRequest(args[0]);
    const response = args[1];
    requireResponse(response);
    if (requireRequest(request).method !== "GET") {
      return Promise.reject(new TypeError("Only GET requests can be cached"));
    }
    const index = matchingIndex(record, request, {});
    const entry = { request: requestClone(request), response: responseClone(response) };
    if (index === -1) record.entries.push(entry);
    else record.entries[index] = entry;
    return Promise.resolve();
  }
  if (name === "add") return addRequests(record, [args[0]]);
  if (name === "addAll") return addRequests(record, [...args[0]]);
  if (name === "match") {
    const request = normalizeRequest(args[0]);
    const index = matchingIndex(record, request, args[1] ?? {});
    return Promise.resolve(index === -1
      ? undefined
      : responseClone(record.entries[index].response));
  }
  if (name === "matchAll") {
    const input = args[0];
    const options = args[1] ?? {};
    const matches = input === undefined
      ? record.entries
      : record.entries.filter(entry => requestsMatch(
        entry.request,
        normalizeRequest(input),
        options,
      ));
    return Promise.resolve(matches.map(entry => responseClone(entry.response)));
  }
  if (name === "delete") {
    const request = normalizeRequest(args[0]);
    const index = matchingIndex(record, request, args[1] ?? {});
    if (index === -1) return Promise.resolve(false);
    record.entries.splice(index, 1);
    return Promise.resolve(true);
  }
  if (name === "keys") {
    const input = args[0];
    const options = args[1] ?? {};
    const entries = input === undefined
      ? record.entries
      : record.entries.filter(entry => requestsMatch(
        entry.request,
        normalizeRequest(input),
        options,
      ));
    return Promise.resolve(entries.map(entry => requestClone(entry.request)));
  }
}

async function addRequests(record, inputs) {
  const fetched = [];
  for (const input of inputs) {
    const request = normalizeRequest(input);
    const response = replayRequest(request);
    if (!response.ok) throw new TypeError("Cache.add received a non-success response");
    fetched.push([request, response]);
  }
  for (const [request, response] of fetched) {
    await cacheEntryOperation(record, "put", [request, response]);
  }
}

function matchingIndex(record, request, options) {
  return record.entries.findIndex(entry => requestsMatch(entry.request, request, options));
}

function requestsMatch(left, right, options) {
  const leftState = requireRequest(left);
  const rightState = requireRequest(right);
  if (!options.ignoreMethod && rightState.method !== "GET") return false;
  return requestURL(leftState.url, options.ignoreSearch)
    === requestURL(rightState.url, options.ignoreSearch);
}

function requestURL(value, ignoreSearch) {
  const url = new URL(value);
  if (ignoreSearch) url.search = "";
  url.hash = "";
  return url.href;
}

function normalizeRequest(input) {
  return input instanceof Request ? input : new Request(input);
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function illegalConstructor(name) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    name === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
