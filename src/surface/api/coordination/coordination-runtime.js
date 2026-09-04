import { initializeEventTarget } from "../event/event-target-state.js";
import { Event } from "../event/event-constructor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const state = new WeakMap();

// Locks、WakeLock 单例和命名锁队列原先是模块级状态，会跨 Realm 共享锁。
const coordinationSlot = createRealmSlot(() => ({
  namedLocks: new Map(),
  lockManagerSingleton: null,
  wakeLockSingleton: null,
}), "coordination-runtime");

function coordinationState() {
  return coordinationSlot.get(globalThis);
}

export function Lock() { illegalConstructor("Lock"); }
export function LockManager() { illegalConstructor("LockManager"); }
export function WakeLock() { illegalConstructor("WakeLock"); }
export function WakeLockSentinel() { illegalConstructor("WakeLockSentinel"); }
export const coordinationConstructors = Object.freeze([
  Lock, LockManager, WakeLock, WakeLockSentinel,
]);
for (const Constructor of coordinationConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createLockManager() {
  if (coordinationState().lockManagerSingleton !== null) return coordinationState().lockManagerSingleton;
  const value = Object.create(LockManager.prototype);
  state.set(value, { kind: "lockManager" });
  coordinationState().lockManagerSingleton = value;
  return value;
}

export function createWakeLock() {
  if (coordinationState().wakeLockSingleton !== null) return coordinationState().wakeLockSingleton;
  const value = Object.create(WakeLock.prototype);
  state.set(value, { kind: "wakeLock" });
  coordinationState().wakeLockSingleton = value;
  return value;
}

export function coordinationProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  return record[name];
}

export function setCoordinationProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
  }
}

export function coordinationOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "lockManager") {
    if (name === "query") return Promise.resolve(lockSnapshot());
    if (name === "request") return requestLock(args);
  }
  if (record.kind === "wakeLock" && name === "request") {
    const type = `${args[0] ?? "screen"}`;
    if (type !== "screen") return Promise.reject(new TypeError("Unsupported wake lock type"));
    return Promise.resolve(createSentinel(type));
  }
  if (record.kind === "sentinel" && name === "release") {
    releaseSentinel(record);
    return Promise.resolve();
  }
  throw new TypeError(`Unsupported coordination operation: ${name}`);
}

function requestLock(args) {
  const name = `${args[0]}`;
  const options = typeof args[1] === "function" ? {} : args[1] ?? {};
  const callback = typeof args[1] === "function" ? args[1] : args[2];
  if (typeof callback !== "function") {
    return Promise.reject(new TypeError("Lock callback must be callable"));
  }
  const mode = `${options.mode ?? "exclusive"}`;
  if (!["exclusive", "shared"].includes(mode)) {
    return Promise.reject(new TypeError("Invalid lock mode"));
  }
  const bucket = lockBucket(name);
  if (options.ifAvailable && !canGrant(bucket, mode)) {
    return Promise.resolve(Reflect.apply(callback, undefined, [null]));
  }
  return new Promise((resolve, reject) => {
    const request = { name, mode, callback, resolve, reject, signal: options.signal };
    if (request.signal?.aborted) {
      reject(request.signal.reason ?? new DOMException("Lock request aborted", "AbortError"));
      return;
    }
    bucket.queue.push(request);
    if (request.signal) {
      request.signal.addEventListener("abort", () => {
        const index = bucket.queue.indexOf(request);
        if (index === -1) return;
        bucket.queue.splice(index, 1);
        reject(request.signal.reason ?? new DOMException("Lock request aborted", "AbortError"));
      }, { once: true });
    }
    scheduleBucket(bucket);
  });
}

function scheduleBucket(bucket) {
  while (bucket.queue.length > 0 && canGrant(bucket, bucket.queue[0].mode)) {
    const request = bucket.queue.shift();
    const lock = Object.create(Lock.prototype);
    state.set(lock, { kind: "lock", name: request.name, mode: request.mode });
    bucket.active.push(lock);
    Promise.resolve().then(() => Reflect.apply(request.callback, undefined, [lock]))
      .then(request.resolve, request.reject)
      .finally(() => {
        bucket.active.splice(bucket.active.indexOf(lock), 1);
        if (bucket.active.length === 0 && bucket.queue.length === 0) {
          coordinationState().namedLocks.delete(request.name);
        }
        scheduleBucket(bucket);
      });
    if (request.mode === "exclusive") break;
  }
}

function canGrant(bucket, mode) {
  return bucket.active.length === 0
    || (mode === "shared"
      && bucket.active.every(lock => requireRecord(lock).mode === "shared"));
}

function lockBucket(name) {
  let bucket = coordinationState().namedLocks.get(name);
  if (bucket === undefined) {
    bucket = { name, active: [], queue: [] };
    coordinationState().namedLocks.set(name, bucket);
  }
  return bucket;
}

function lockSnapshot() {
  const held = [];
  const pending = [];
  for (const bucket of coordinationState().namedLocks.values()) {
    held.push(...bucket.active.map(lock => ({
      name: requireRecord(lock).name,
      mode: requireRecord(lock).mode,
      clientId: null,
    })));
    pending.push(...bucket.queue.map(request => ({
      name: request.name, mode: request.mode, clientId: null,
    })));
  }
  return Object.freeze({
    held: Object.freeze(held),
    pending: Object.freeze(pending),
  });
}

function createSentinel(type) {
  const value = Object.create(WakeLockSentinel.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "sentinel",
    object: value,
    type,
    released: false,
    handlers: new Map([["onrelease", null]]),
  });
  return value;
}

function releaseSentinel(record) {
  if (record.released) return;
  record.released = true;
  Promise.resolve().then(() => {
    const event = new Event("release");
    record.object.dispatchEvent(event);
    const handler = record.handlers.get("onrelease");
    if (handler !== null) Reflect.apply(handler, record.object, [event]);
  });
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
