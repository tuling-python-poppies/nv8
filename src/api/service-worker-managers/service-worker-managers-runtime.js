import { notificationPermission } from "../user-agency/user-agency-runtime.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { createRealmSlot } from "../../core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const swManagerSlot = createRealmSlot(() => ({
  nextPushSubscription: 0,
}), "swManager");

function swManagerState() {
  return swManagerSlot.get(globalThis);
}

const state = new WeakMap();

export function CookieStoreManager() {
  throw new TypeError("Illegal constructor");
}
export function NavigationPreloadManager() {
  throw new TypeError("Illegal constructor");
}
export function PeriodicSyncManager() {
  throw new TypeError("Illegal constructor");
}
export function PushManager() {
  throw new TypeError("Illegal constructor");
}
export function PushSubscription() {
  throw new TypeError("Illegal constructor");
}
export function PushSubscriptionOptions() {
  throw new TypeError("Illegal constructor");
}
export function SyncManager() {
  throw new TypeError("Illegal constructor");
}

export const serviceWorkerManagerConstructors = Object.freeze([
  CookieStoreManager,
  NavigationPreloadManager,
  PeriodicSyncManager,
  PushManager,
  PushSubscription,
  PushSubscriptionOptions,
  SyncManager,
]);
for (const Constructor of serviceWorkerManagerConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createCookieStoreManager() {
  return create(CookieStoreManager, {
    kind: "cookies",
    subscriptions: new Map(),
  });
}

export function createNavigationPreloadManager() {
  return create(NavigationPreloadManager, {
    kind: "navigationPreload",
    enabled: false,
    headerValue: "true",
  });
}

export function createPeriodicSyncManager() {
  return create(PeriodicSyncManager, {
    kind: "periodicSync",
    tags: new Set(),
  });
}

export function createPushManager() {
  const manager = create(PushManager, {
    kind: "pushManager",
    subscription: null,
  });
  return manager;
}

export function createSyncManager() {
  return create(SyncManager, {
    kind: "sync",
    tags: new Set(),
  });
}

export function serviceWorkerManagerProperty(value, name) {
  return requireRecord(value)[name];
}

export function serviceWorkerManagerOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "sync") {
    if (name === "getTags") return Promise.resolve(sorted(record.tags));
    if (name === "register") {
      requireArgument(args, "register requires a tag");
      const tag = `${args[0]}`;
      if (tag.length === 0) throw new TypeError("The tag cannot be empty");
      record.tags.add(tag);
      return Promise.resolve();
    }
  }
  if (record.kind === "periodicSync") {
    if (name === "getTags") return Promise.resolve(sorted(record.tags));
    requireArgument(args, `${name} requires a tag`);
    const tag = `${args[0]}`;
    if (name === "register") record.tags.add(tag);
    if (name === "unregister") record.tags.delete(tag);
    return Promise.resolve();
  }
  if (record.kind === "navigationPreload") {
    if (name === "enable" || name === "disable") {
      record.enabled = name === "enable";
      return Promise.resolve();
    }
    if (name === "setHeaderValue") {
      record.headerValue = `${args[0]}`;
      return Promise.resolve();
    }
    if (name === "getState") {
      return Promise.resolve({
        enabled: record.enabled,
        headerValue: record.headerValue,
      });
    }
  }
  if (record.kind === "cookies") {
    if (name === "getSubscriptions") {
      return Promise.resolve(
        [...record.subscriptions.values()].map(({ name, url }) => ({
          name,
          url,
        })),
      );
    }
    if (!Array.isArray(args[0])) {
      throw new TypeError(`CookieStoreManager.${name} requires a sequence`);
    }
    for (const input of args[0]) {
      const subscription = normalizeCookieSubscription(input);
      const key = `${subscription.name}\0${subscription.url}`;
      if (name === "subscribe") record.subscriptions.set(key, subscription);
      if (name === "unsubscribe") record.subscriptions.delete(key);
    }
    return Promise.resolve();
  }
  if (record.kind === "pushManager") {
    if (name === "getSubscription") {
      return Promise.resolve(record.subscription);
    }
    if (name === "permissionState") {
      return Promise.resolve(notificationPermission());
    }
    if (name === "subscribe") {
      if (record.subscription !== null) {
        return Promise.resolve(record.subscription);
      }
      const options = createPushSubscriptionOptions(args[0]);
      const subscription = create(PushSubscription, {
        kind: "pushSubscription",
        endpoint: `https://push.invalid/subscription/${++swManagerState().nextPushSubscription}`,
        expirationTime: null,
        options,
        p256dh: Uint8Array.from({ length: 65 }, (_, index) => index + 1),
        auth: Uint8Array.from({ length: 16 }, (_, index) => index + 1),
        active: true,
      });
      record.subscription = subscription;
      return Promise.resolve(subscription);
    }
  }
  if (record.kind === "pushSubscription") {
    if (name === "getKey") {
      const bytes = record[`${args[0]}`];
      if (!(bytes instanceof Uint8Array)) return null;
      return bytes.slice().buffer;
    }
    if (name === "unsubscribe") {
      const wasActive = record.active;
      record.active = false;
      return Promise.resolve(wasActive);
    }
    if (name === "toJSON") {
      return {
        endpoint: record.endpoint,
        expirationTime: record.expirationTime,
        keys: {
          p256dh: base64Url(record.p256dh),
          auth: base64Url(record.auth),
        },
      };
    }
  }
  throw new TypeError(`Unsupported Service Worker manager operation: ${name}`);
}

function createPushSubscriptionOptions(init) {
  const input = init !== null && typeof init === "object" ? init : {};
  return create(PushSubscriptionOptions, {
    kind: "pushSubscriptionOptions",
    userVisibleOnly: Boolean(input.userVisibleOnly),
    applicationServerKey: input.applicationServerKey ?? null,
  });
}

function create(Constructor, record) {
  const value = Object.create(Constructor.prototype);
  state.set(value, record);
  return value;
}

function normalizeCookieSubscription(input) {
  const value = input !== null && typeof input === "object" ? input : {};
  return {
    name: `${value.name ?? ""}`,
    url: `${value.url ?? ""}`,
  };
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireArgument(args, message) {
  if (args.length === 0) throw new TypeError(message);
}

function sorted(values) {
  return [...values].sort();
}

function base64Url(bytes) {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let output = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const remaining = bytes.length - index;
    const value = (bytes[index] << 16)
      | ((remaining > 1 ? bytes[index + 1] : 0) << 8)
      | (remaining > 2 ? bytes[index + 2] : 0);
    output += alphabet[(value >>> 18) & 63];
    output += alphabet[(value >>> 12) & 63];
    if (remaining > 1) output += alphabet[(value >>> 6) & 63];
    if (remaining > 2) output += alphabet[value & 63];
  }
  return output;
}
