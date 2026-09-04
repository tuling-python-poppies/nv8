import { Event } from "../event/event-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const state = new WeakMap();

// 权限状态、剪贴板内容和两个单例原先是模块级状态，会跨 Realm 泄漏权限
// 查询结果与剪贴板数据。
const userAgencySlot = createRealmSlot(() => ({
  permissionStates: new Map(),
  clipboardItems: [],
  permissionsSingleton: null,
  clipboardSingleton: null,
}), "user-agency-runtime");

function userAgencyState() {
  return userAgencySlot.get(globalThis);
}

export function Permissions() { illegalConstructor("Permissions"); }
export function PermissionStatus() { illegalConstructor("PermissionStatus"); }
export function Clipboard() { illegalConstructor("Clipboard"); }
export function ClipboardItem(items) {
  requireNew(new.target, "ClipboardItem");
  if (items === null || typeof items !== "object") {
    throw new TypeError("ClipboardItem data is required");
  }
  const entries = new Map();
  for (const [type, value] of Object.entries(items)) {
    entries.set(`${type}`.toLowerCase(), Promise.resolve(value).then(blob => {
      if (blob instanceof Blob) return blob;
      return new Blob([blob], { type });
    }));
  }
  state.set(this, {
    kind: "clipboardItem",
    entries,
    types: Object.freeze([...entries.keys()]),
  });
}
export function Notification(title) {
  requireNew(new.target, "Notification");
  initializeEventTarget(this);
  const options = arguments[1] ?? {};
  state.set(this, {
    kind: "notification",
    object: this,
    title: `${title}`,
    dir: `${options.dir ?? "auto"}`,
    lang: `${options.lang ?? ""}`,
    body: `${options.body ?? ""}`,
    tag: `${options.tag ?? ""}`,
    icon: `${options.icon ?? ""}`,
    badge: `${options.badge ?? ""}`,
    vibrate: Object.freeze([...(options.vibrate ?? [])].map(Number)),
    timestamp: Number(options.timestamp ?? Date.now()),
    renotify: Boolean(options.renotify),
    silent: options.silent ?? null,
    requireInteraction: Boolean(options.requireInteraction),
    data: cloneData(options.data ?? null),
    actions: Object.freeze([...(options.actions ?? [])].map(action => Object.freeze({
      ...action,
    }))),
    image: `${options.image ?? ""}`,
    scenario: `${options.scenario ?? "default"}`,
    handlers: handlers(["onclick", "onshow", "onerror", "onclose"]),
    closed: false,
  });
  emit(state.get(this), "show", "onshow");
}

export const userAgencyConstructors = Object.freeze([
  Permissions,
  PermissionStatus,
  Clipboard,
  ClipboardItem,
  Notification,
]);
for (const constructor of userAgencyConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

export function createPermissions() {
  if (userAgencyState().permissionsSingleton !== null) return userAgencyState().permissionsSingleton;
  const value = Object.create(Permissions.prototype);
  state.set(value, { kind: "permissions" });
  userAgencyState().permissionsSingleton = value;
  return value;
}

export function createClipboard() {
  if (userAgencyState().clipboardSingleton !== null) return userAgencyState().clipboardSingleton;
  const value = Object.create(Clipboard.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "clipboard",
    object: value,
    handlers: handlers(["onclipboardchange"]),
  });
  userAgencyState().clipboardSingleton = value;
  return value;
}

export function userAgencyProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  return record[name];
}

export function setUserAgencyProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
  }
}

export function userAgencyOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "permissions" && name === "query") {
    const descriptor = args[0];
    if (descriptor === null || typeof descriptor !== "object") {
      return Promise.reject(new TypeError("Permission descriptor is required"));
    }
    return Promise.resolve(permissionStatus(`${descriptor.name}`));
  }
  if (record.kind === "clipboard") return clipboardOperation(record, name, args);
  if (record.kind === "clipboardItem" && name === "getType") {
    const promise = record.entries.get(`${args[0]}`.toLowerCase());
    return promise ?? Promise.reject(new DOMException(
      "Clipboard type was not found.",
      "NotFoundError",
    ));
  }
  if (record.kind === "notification" && name === "close") {
    if (record.closed) return;
    record.closed = true;
    emit(record, "close", "onclose");
    return;
  }
  throw new TypeError(`Unsupported user-agency operation: ${name}`);
}

export function notificationPermission() {
  return "default";
}

export function requestNotificationPermission(callback) {
  const promise = Promise.resolve("default");
  if (typeof callback === "function") {
    promise.then(value => Reflect.apply(callback, undefined, [value]));
  }
  return promise;
}

export function clipboardItemSupports(type) {
  return ["text/plain", "text/html", "image/png"].includes(`${type}`.toLowerCase());
}

function permissionStatus(name) {
  let value = userAgencyState().permissionStates.get(name);
  if (value !== undefined) return value;
  value = Object.create(PermissionStatus.prototype);
  initializeEventTarget(value);
  const fixedState = [
    "clipboard-read",
    "clipboard-write",
    "notifications",
  ].includes(name) ? "granted" : [
    "camera",
    "microphone",
    "geolocation",
    "bluetooth",
  ].includes(name) ? "denied" : "prompt";
  state.set(value, {
    kind: "permissionStatus",
    object: value,
    name,
    state: fixedState,
    handlers: handlers(["onchange"]),
  });
  userAgencyState().permissionStates.set(name, value);
  return value;
}

function clipboardOperation(record, name, args) {
  if (name === "read") return Promise.resolve([...userAgencyState().clipboardItems]);
  if (name === "write") {
    const items = [...args[0]];
    if (!items.every(item => state.get(item)?.kind === "clipboardItem")) {
      return Promise.reject(new TypeError("Expected ClipboardItem values"));
    }
    userAgencyState().clipboardItems = [...items];
    emit(record, "clipboardchange", "onclipboardchange");
    return Promise.resolve();
  }
  if (name === "writeText") {
    userAgencyState().clipboardItems = [new ClipboardItem({
      "text/plain": new Blob([`${args[0]}`], { type: "text/plain" }),
    })];
    emit(record, "clipboardchange", "onclipboardchange");
    return Promise.resolve();
  }
  if (name === "readText") {
    return Promise.resolve().then(async () => {
      for (const item of userAgencyState().clipboardItems) {
        const itemRecord = requireRecord(item);
        if (itemRecord.entries.has("text/plain")) {
          return (await itemRecord.entries.get("text/plain")).text();
        }
      }
      return "";
    });
  }
}

function emit(record, type, handlerName) {
  Promise.resolve().then(() => {
    const event = new Event(type);
    record.object.dispatchEvent(event);
    const handler = record.handlers.get(handlerName);
    if (handler !== null) Reflect.apply(handler, record.object, [event]);
  });
}

function handlers(names) {
  return new Map(names.map(name => [name, null]));
}

function cloneData(value) {
  if (value === undefined) return null;
  return JSON.parse(JSON.stringify(value));
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) {
    throw new TypeError(`Failed to construct '${name}': use the new operator`);
  }
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
