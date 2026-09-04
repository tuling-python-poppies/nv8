import { Storage } from "./storage-constructor.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const storageState = new WeakMap();

// 迁移前 localStorage/sessionStorage/初始数据是模块级单例，会跨宿主 Realm
// 共享。按 Realm 宿主键控后，每个 Window/Worker 都拥有独立状态。
const storageSlot = createRealmSlot(() => ({
  localStorage: null,
  sessionStorage: null,
  initialLocalData: "",
  initialSessionData: "",
}), "storage-state");

// legacy bootstrap 没有显式 Realm 参数时保留原有单宿主行为。
const legacyHost = Object.freeze({ scope: "legacy-storage" });

function resolveHost(host) {
  return host ?? legacyHost;
}

export function configureStorage(localData = "", sessionData = "", host) {
  const state = storageSlot.get(resolveHost(host));
  state.initialLocalData = localData;
  state.initialSessionData = sessionData;
  state.localStorage = null;
  state.sessionStorage = null;
}

export function currentLocalStorage(host) {
  const state = storageSlot.get(resolveHost(host));
  if (state.localStorage === null) {
    state.localStorage = createStorage(state.initialLocalData);
  }
  return state.localStorage;
}

export function currentSessionStorage(host) {
  const state = storageSlot.get(resolveHost(host));
  if (state.sessionStorage === null) {
    state.sessionStorage = createStorage(state.initialSessionData);
  }
  return state.sessionStorage;
}

export function releaseStorage(host) {
  return storageSlot.clear(resolveHost(host));
}

export function requireStorage(value) {
  const state = storageState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function encodeLocalStorage() {
  return encodeRecord(requireStorage(currentLocalStorage()));
}

export function encodeSessionStorage() {
  return encodeRecord(requireStorage(currentSessionStorage()));
}

function createStorage(encoded) {
  const value = Object.create(Storage.prototype);
  storageState.set(value, decodeRecord(encoded));
  return value;
}

function encodeRecord(record) {
  let output = "";
  for (const key of record.order) {
    output += encodeString(key);
    output += encodeString(record.values.get(key));
  }
  return output;
}

function decodeRecord(encoded) {
  const order = [];
  const values = new Map();
  let offset = 0;
  while (offset < encoded.length) {
    const key = decodeString(encoded, offset);
    const value = decodeString(encoded, key.offset);
    order.push(key.value);
    values.set(key.value, value.value);
    offset = value.offset;
  }
  return { order, values };
}

function encodeString(value) {
  return `${value.length}:${value}`;
}

function decodeString(encoded, offset) {
  const separator = encoded.indexOf(":", offset);
  if (separator === -1) {
    throw new TypeError("Invalid encoded storage data");
  }
  const length = Number(encoded.slice(offset, separator));
  const start = separator + 1;
  const end = start + length;
  if (!Number.isSafeInteger(length) || length < 0 || end > encoded.length) {
    throw new TypeError("Invalid encoded storage data");
  }
  return { value: encoded.slice(start, end), offset: end };
}
