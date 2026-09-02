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
  parentPostMessage: null,
}), "window-messaging");

function messagingState() {
  return messagingSlot.get(globalThis);
}

/**
 * 当前 incumbent —— 「刚刚是哪个子 Realm 在读 `parent` / `top`」。
 *
 * 这是对规范里 incumbent settings object 的近似。真实浏览器调
 * `otherWindow.postMessage()` 时引擎知道调用方是哪个 Realm；NV8 的两个 Realm
 * 是两个 vm context，`parent.postMessage(...)` 是子 Realm 的 JS 直接调用父 Realm
 * 的函数对象，`this` 在两种调用下都是父 global，父侧无从分辨。
 *
 * 可利用的信号是：**`parent` 在子 Realm 里是 getter**。
 * `parent.postMessage(x, '*')` 是单个表达式——先跑 getter，紧接着取
 * `.postMessage` 并调用，中间不可能插入其他 Realm 的代码（单线程）。所以 getter
 * 顺手登记「现在是我」，父侧的 `postMessage` 消费一次即清。
 *
 * **失效边界（刻意记下来，不要指望它总是精确）**：
 *
 * ```js
 * const p = parent;                      // 这里登记
 * setTimeout(() => p.postMessage(x));    // 这里已经清掉了
 * ```
 *
 * 别名 + 跨任务的写法会退化成「父窗口自己」，也就是不做这套机制时的行为。
 * 退化方向是安全的（不会把 A 的消息记成 B 的），但不精确。
 *
 * 为此除了「用后即清」还要**在微任务末清空**：只读了 `parent` 却没发消息时，
 * 残留的登记不能让之后一次父窗口自发的 `window.postMessage` 被误记成来自子帧。
 */
const incumbentSlot = createRealmSlot(() => ({
  resolve: null,
  scheduled: false,
}), "window-incumbent");

/**
 * 由子 Realm（经父 Realm 的闭包）登记 incumbent。
 *
 * @param {() => unknown} resolve 取回子窗口的函数，延迟到消费时才调用——
 *   登记发生在 `parent` 求值那一刻，那时子窗口一定已经存在，但保持惰性可以
 *   避免在拆除过程中拿到陈旧引用。
 */
export function registerIncumbentSource(resolve) {
  const state = incumbentSlot.get(globalThis);
  state.resolve = typeof resolve === "function" ? resolve : null;
  if (state.scheduled) return;
  state.scheduled = true;
  queueMicrotask(() => {
    state.scheduled = false;
    state.resolve = null;
  });
}

function consumeIncumbentSource() {
  const state = incumbentSlot.get(globalThis);
  const resolve = state.resolve;
  state.resolve = null;
  if (resolve === null) return null;
  try {
    return resolve() ?? null;
  } catch {
    return null;
  }
}

/**
 * 配置本 Realm 的窗口消息与 `parent` / `top`。
 *
 * 同源父窗口**直接交出真实的父 global**，不再包一层 facade。
 *
 * 原实现返回 `Object.create(parentWindow)` 并覆盖 `postMessage`，目的是让子 → 父
 * 的消息带上子 Realm 的 `source`。实测证明这条路走不通：**原型委托对 vm 全局
 * 只有一半有效**。
 *
 * | 访问方式 | 普通数据属性 | `document` / `location` |
 * |---|---|---|
 * | `Object.create(parentWindow)` | 委托成功 | **返回子自己的** |
 * | 直接持有父 global | 正确 | 正确 |
 *
 * `document` / `location` 这类由 contextify 拦截器支撑的访问器不跟随原型，会落回
 * **访问方所在 Realm** 的全局。于是同源子 frame 里 `parent.document === document`
 * 为 true——读到的是自己的文档。不报错、不为 null，返回一个形状完全正常的
 * `HTMLDocument`，所以 `parent.document.cookie` / `.referrer` /
 * `.querySelector()` 全部**静默读错对象**。
 *
 * 对协议恢复来说这是最坏的一类失败：脚本跑完、吐出格式正常的 token，只是算错了
 * 输入，本地零信号。相比之下 `event.source` 不对会让应答收不到，是能定位的停止。
 *
 * 代价（已实测、已登记）：子 → 父的 `parent.postMessage()` 现在走父 Realm 自己的
 * `postMessage`，`event.source` 变成父窗口自己而不是子窗口。`event.origin`
 * **两者相同**——同源场景父子 origin 本来一样，facade 在 origin 上并没有换来额外
 * 正确性。详见 `docs/adr/0007-parent-window-identity.md`。
 *
 * 跨源父窗口仍走 `createWindowFacade()`：那条路径本来就只暴露规范允许的成员，
 * 不依赖原型委托，所以没有同一个问题。
 */
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
  state.parentPostMessage = typeof parentPostMessage === "function"
    ? parentPostMessage
    : null;
  if (parentWindow === null || typeof parentPostMessage !== "function") {
    state.parentFacade = globalThis;
    state.topFacade = globalThis;
  } else if (sameOrigin) {
    state.parentFacade = parentWindow;
    state.topFacade = topWindow ?? parentWindow;
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

export function windowParent() {
  notifyParentIncumbent();
  return messagingState().parentFacade ?? globalThis;
}

export function windowTop() {
  notifyParentIncumbent();
  return messagingState().topFacade ?? globalThis;
}

/**
 * 告诉父 Realm「本 Realm 正在读 `parent` / `top`」。
 *
 * `notifyIncumbent` 挂在 `parentPostMessage` 函数对象上，随同一条通道下发。
 * 这样做是为了不再往 `bootstrapRoot()` 的 40+ 个位置参数里加第 4 个透传项——
 * 两个能力属于同一段父子关系，放在一起比分开穿更不容易漏。
 *
 * 顶层窗口没有 `parentPostMessage`，这里整体是 no-op。
 */
function notifyParentIncumbent() {
  const bridge = messagingState().parentPostMessage;
  if (bridge === null) return;
  bridge.notifyIncumbent?.();
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
    // 同源子帧调 `parent.postMessage()` 走到的就是这里（`parent` 现在是真实的父
    // global，所以 `target === globalThis`）。`source` 优先取 incumbent，
    // 取不到才退回 `globalThis`——那既是父窗口自发 `window.postMessage()` 的
    // 正确答案，也是别名写法下可接受的退化值。
    enqueueWindowMessage(
      message,
      state.localOrigin,
      consumeIncumbentSource() ?? globalThis,
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
