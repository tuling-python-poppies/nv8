import {
  performStructuredCloneDetailed,
} from "../clone/structured-clone-algorithm.js";
import { MessageEvent } from "../messaging/messaging-runtime.js";
import { markEventTrusted } from "../event/event-state.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import { createRealmSlot } from "../../core/state-scope.js";

const facadeState = new WeakMap();

// 迁移前 windowHandlers/localOrigin/parentFacade/topFacade 是模块级状态，
// 会让 legacy 多 Sandbox 共享窗口消息配置。按当前 Realm 的 globalThis
// 键控，保留现有无参数 API。
const messagingSlot = createRealmSlot(() => ({
  windowHandlers: new Map(),
  localOrigin: "null",
  parentFacade: null,
  topFacade: null,
}), "window-messaging");

function messagingState() {
  return messagingSlot.get(globalThis);
}

export function configureWindowMessaging(
  origin,
  parentWindow = null,
  topWindow = null,
  parentOrigin = "",
  parentPostMessage = null,
  sameOrigin = false,
) {
  const state = messagingState();
  state.localOrigin = `${origin}`;
  if (parentWindow === null || typeof parentPostMessage !== "function") {
    state.parentFacade = globalThis;
    state.topFacade = globalThis;
  } else if (sameOrigin) {
    state.parentFacade = createSameOriginParentFacade(parentWindow, parentPostMessage);
    state.topFacade = createSameOriginParentFacade(
      topWindow ?? parentWindow,
      parentPostMessage,
    );
  } else {
    state.parentFacade = createWindowFacade({
      window: () => parentWindow,
      origin: () => `${parentOrigin}`,
      parent: () => null,
      top: () => null,
      postMessage: parentPostMessage,
    });
    state.topFacade = topWindow === null || topWindow === parentWindow
      ? state.parentFacade
      : createWindowFacade({
        window: () => topWindow,
        origin: () => `${parentOrigin}`,
        parent: () => null,
        top: () => null,
        postMessage: parentPostMessage,
      });
  }
}

function createSameOriginParentFacade(parentWindow, parentPostMessage) {
  const facade = Object.create(parentWindow);
  const postMessage = function postMessage(message) {
    return parentPostMessage(
      message,
      arguments[1],
      arguments[2],
    );
  };
  registerNativeFunction(postMessage, 'postMessage');
  Object.defineProperty(facade, 'postMessage', {
    value: postMessage,
    writable: false,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(facade, 'window', {
    value: parentWindow,
    writable: false,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(facade, 'self', {
    value: parentWindow,
    writable: false,
    enumerable: true,
    configurable: true,
  });
  return facade;
}

export function windowParent() {
  return messagingState().parentFacade ?? globalThis;
}

export function windowTop() {
  return messagingState().topFacade ?? globalThis;
}

export function createWindowFacade(options) {
  const facade = Object.create(null);
  const record = {
    facade,
    window: options.window,
    origin: options.origin,
    parent: options.parent ?? (() => globalThis),
    top: options.top ?? (() => globalThis),
    postMessage: options.postMessage,
    closed: options.closed ?? (() => options.window() === null),
    location: createCrossOriginLocation(),
  };
  facadeState.set(facade, record);

  ownGetter(facade, facade, "window", () => facade);
  ownGetter(facade, facade, "self", () => facade);
  ownAccessor(
    facade,
    facade,
    "location",
    () => record.location,
    () => undefined,
  );
  ownGetter(facade, facade, "closed", () => Boolean(record.closed()));
  ownGetter(facade, facade, "frames", () => facade);
  ownGetter(
    facade,
    facade,
    "length",
    () => Number(record.window()?.length ?? 0),
  );
  ownGetter(facade, facade, "top", () => record.top() ?? facade);
  ownGetter(facade, facade, "opener", () => null);
  ownGetter(facade, facade, "parent", () => record.parent() ?? facade);

  const blur = function blur() {};
  registerNativeFunction(blur, "blur");
  defineCrossOriginMethod(facade, "blur", blur);
  const close = function close() {};
  registerNativeFunction(close, "close");
  defineCrossOriginMethod(facade, "close", close);
  const focus = function focus() {};
  registerNativeFunction(focus, "focus");
  defineCrossOriginMethod(facade, "focus", focus);
  const postMessage = function postMessage(message) {
    return record.postMessage(
      message,
      arguments[1],
      arguments[2],
    );
  };
  registerNativeFunction(postMessage, "postMessage");
  defineCrossOriginMethod(facade, "postMessage", postMessage);
  Object.defineProperty(facade, "then", {
    value: undefined,
    writable: false,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(facade, Symbol.toStringTag, {
    value: undefined,
    writable: false,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(facade, Symbol.hasInstance, {
    value: undefined,
    writable: false,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(facade, Symbol.isConcatSpreadable, {
    value: undefined,
    writable: false,
    enumerable: false,
    configurable: true,
  });
  return facade;
}

function defineCrossOriginMethod(target, name, callback) {
  Object.defineProperty(target, name, {
    value: callback,
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

function createCrossOriginLocation() {
  const location = {};
  const hrefGetter = function () {
    securityError();
  };
  registerNativeGetter(hrefGetter, "href");
  Object.defineProperty(location, "href", {
    get: hrefGetter,
    enumerable: true,
    configurable: true,
  });
  const replace = function replace() {};
  registerNativeFunction(replace, "replace");
  Object.defineProperty(location, "replace", {
    value: replace,
    writable: false,
    enumerable: true,
    configurable: true,
  });
  return location;
}

export function windowPostMessage(target, message, targetOriginOrOptions, transfer) {
  const state = messagingState();
  if (target === globalThis) {
    const targetOrigin = readTargetOrigin(targetOriginOrOptions);
    if (!matchesTargetOrigin(targetOrigin, state.localOrigin, state.localOrigin)) return;
    enqueueWindowMessage(
      message,
      state.localOrigin,
      globalThis,
      transferOptions(targetOriginOrOptions, transfer),
    );
    return;
  }
  const record = requireFacade(target);
  return record.postMessage(message, targetOriginOrOptions, transfer);
}

export function windowHandler(name) {
  return messagingState().windowHandlers.get(name) ?? null;
}

export function setWindowHandler(name, value) {
  messagingState().windowHandlers.set(name, typeof value === "function" ? value : null);
}

export function receiveParentWindowMessage(
  message,
  origin,
  targetOriginOrOptions,
  transfer,
) {
  const targetOrigin = readTargetOrigin(targetOriginOrOptions);
  const state = messagingState();
  if (!matchesTargetOrigin(targetOrigin, `${origin}`, state.localOrigin)) return;
  enqueueWindowMessage(
    message,
    `${origin}`,
    state.parentFacade,
    transferOptions(targetOriginOrOptions, transfer),
  );
}

export function enqueueWindowMessage(message, origin, source, options) {
  const cloned = performStructuredCloneDetailed(message, options);
  Promise.resolve().then(() => {
    const event = new MessageEvent("message", {
      data: cloned.value,
      origin: `${origin}`,
      source,
      ports: cloned.transferred.filter(value =>
        Object.prototype.toString.call(value) === "[object MessagePort]"),
    });
    markEventTrusted(event);
    globalThis.dispatchEvent(event);
    const handler = messagingState().windowHandlers.get("onmessage") ?? null;
    if (handler !== null) Reflect.apply(handler, globalThis, [event]);
  });
}

export function normalizePostMessageTarget(
  targetOriginOrOptions,
  senderOrigin,
  targetOrigin,
) {
  const requested = readTargetOrigin(targetOriginOrOptions);
  return matchesTargetOrigin(requested, senderOrigin, targetOrigin);
}

export function transferOptions(targetOriginOrOptions, transfer) {
  if (
    targetOriginOrOptions !== null
    && typeof targetOriginOrOptions === "object"
    && !Array.isArray(targetOriginOrOptions)
  ) {
    return targetOriginOrOptions.transfer === undefined
      ? undefined
      : { transfer: targetOriginOrOptions.transfer };
  }
  return transfer === undefined ? undefined : { transfer };
}

function readTargetOrigin(value) {
  if (value === undefined) return "/";
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return `${value.targetOrigin ?? "/"}`;
  }
  return `${value}`;
}

function matchesTargetOrigin(requested, senderOrigin, targetOrigin) {
  if (requested === "*") return true;
  if (requested === "/") return senderOrigin === targetOrigin;
  let parsed;
  try {
    parsed = new URL(requested);
  } catch {
    throw new DOMException(
      "The target origin provided is not a valid origin.",
      "SyntaxError",
    );
  }
  return parsed.origin === targetOrigin;
}

function ownGetter(target, receiver, name, operation) {
  const getter = function () {
    if (this !== receiver) throw new TypeError("Illegal invocation");
    return operation();
  };
  registerNativeGetter(getter, name);
  Object.defineProperty(target, name, {
    get: getter,
    enumerable: false,
    configurable: true,
  });
}

function ownAccessor(target, receiver, name, getOperation, setOperation) {
  const getter = function () {
    if (this !== receiver) throw new TypeError("Illegal invocation");
    return getOperation();
  };
  const setter = function (value) {
    if (this !== receiver) throw new TypeError("Illegal invocation");
    return setOperation(value);
  };
  registerNativeGetter(getter, name);
  registerNativeFunction(setter, `set ${name}`);
  Object.defineProperty(target, name, {
    get: getter,
    set: setter,
    enumerable: false,
    configurable: true,
  });
}

function requireFacade(value) {
  const record = facadeState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function securityError() {
  throw new DOMException(
    "Blocked a frame with a different origin from accessing this frame.",
    "SecurityError",
  );
}
