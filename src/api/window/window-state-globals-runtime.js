import {
  evaluateMediaQuery,
} from "../css/media-query-list-state.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import { currentScreenDevicePixelRatio } from "../screen/screen-state.js";

const viewState = {
  name: "",
  status: "",
  closed: false,
  scrollX: 0,
  scrollY: 0,
  screenX: 0,
  screenY: 0,
  viewportWidth: undefined,
  viewportHeight: undefined,
  eventStack: [],
};
let styleMedia;

/**
 * 本 Realm 所属的 iframe 元素（父 Realm 的对象），顶层窗口为 `null`。
 *
 * 原先 `frameElement` 硬编码 `() => null`，于是 iframe 里的脚本永远看不到自己
 * 的容器元素。广告与反爬代码常用它判断「我是不是被嵌在别人页面里」，
 * 恒为 null 等于声称自己是顶层窗口，而同时 `parent !== window`——**自相矛盾**，
 * 比单独一处错更容易被识别。
 *
 * 值是父 Realm 的 DOM 对象，跨 Realm 传递是**正确**的：真实浏览器里
 * `frameElement` 属于父文档，所以 `frameElement instanceof HTMLIFrameElement`
 * 在子 Realm 里也是 false（要用 `parent.HTMLIFrameElement` 才为 true）。
 */
let frameElementValue = null;

/**
 * 注入本 Realm 的 `frameElement`。
 *
 * 跨源时必须传 `null`：规范规定容器文档与本文档不同源时 `frameElement`
 * 返回 null，泄露元素等于把跨源隔离打穿。
 *
 * @param {object | null} element
 */
export function configureFrameElement(element) {
  frameElementValue = (element === undefined || element === null)
    ? null
    : element;
}

export function installWindowStateGlobals() {
  defineStatefulAccessor("name");
  defineStatefulAccessor("status");
  defineReadonlyAccessor("closed", () => viewState.closed);
  defineReplaceableAccessor("frames", () => globalThis);
  defineReplaceableAccessor("length", directFrameCount);
  defineReplaceableAccessor("opener", () => null);
  defineReadonlyAccessor("frameElement", () => frameElementValue);
  defineReplaceableAccessor("innerWidth", () => viewportWidth());
  defineReplaceableAccessor("innerHeight", () => viewportHeight());
  defineReplaceableAccessor("scrollX", () => viewState.scrollX);
  defineReplaceableAccessor("pageXOffset", () => viewState.scrollX);
  defineReplaceableAccessor("scrollY", () => viewState.scrollY);
  defineReplaceableAccessor("pageYOffset", () => viewState.scrollY);
  defineReplaceableAccessor("screenX", () => viewState.screenX);
  defineReplaceableAccessor("screenY", () => viewState.screenY);
  defineReplaceableAccessor("outerWidth", () => viewportWidth());
  defineReplaceableAccessor("outerHeight", () => viewportHeight() + 57);
  defineReplaceableAccessor(
    "devicePixelRatio",
    () => currentScreenDevicePixelRatio(),
  );
  defineReplaceableAccessor(
    "event",
    () => viewState.eventStack.at(-1),
  );
  defineReplaceableAccessor("clientInformation", () => globalThis.navigator);
  defineReplaceableAccessor("offscreenBuffering", () => true, false);
  defineReplaceableAccessor("screenLeft", () => viewState.screenX);
  defineReplaceableAccessor("screenTop", () => viewState.screenY);
  defineReadonlyAccessor("styleMedia", styleMediaValue);
  defineReadonlyAccessor("isSecureContext", () => true);
  defineReadonlyAccessor("crossOriginIsolated", () => false);
  defineReadonlyAccessor("originAgentCluster", () => true);
  defineReadonlyAccessor("credentialless", () => false);
}

export function setWindowClosed(value) {
  viewState.closed = Boolean(value);
}

export function resizeWindowBy(width, height) {
  setViewportDimensions(
    Math.max(0, viewportWidth() + finiteNumber(width)),
    Math.max(0, viewportHeight() + finiteNumber(height)),
  );
}

export function resizeWindowTo(width, height) {
  setViewportDimensions(
    Math.max(0, finiteNumber(width)),
    Math.max(0, finiteNumber(height)),
  );
}

export function scrollWindowBy(x, y) {
  viewState.scrollX = Math.max(0, viewState.scrollX + finiteNumber(x));
  viewState.scrollY = Math.max(0, viewState.scrollY + finiteNumber(y));
}

export function scrollWindowTo(x, y) {
  viewState.scrollX = Math.max(0, finiteNumber(x));
  viewState.scrollY = Math.max(0, finiteNumber(y));
}

export function withWindowEvent(event, callback) {
  viewState.eventStack.push(event);
  try {
    return callback();
  } finally {
    viewState.eventStack.pop();
  }
}

function defineStatefulAccessor(name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() { return viewState[name]; },
    set [name](value) { viewState[name] = `${value}`; },
  }, name);
  registerAccessor(descriptor, name);
  Object.defineProperty(globalThis, name, {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

function defineReplaceableAccessor(name, read, enumerable = true) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() { return read(); },
    set [name](value) {
      Object.defineProperty(globalThis, name, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    },
  }, name);
  registerAccessor(descriptor, name);
  Object.defineProperty(globalThis, name, {
    get: descriptor.get,
    set: descriptor.set,
    enumerable,
    configurable: true,
  });
}

function defineReadonlyAccessor(name, read, enumerable = true) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() { return read(); },
  }, name).get;
  registerNativeGetter(getter, name);
  Object.defineProperty(globalThis, name, {
    get: getter,
    enumerable,
    configurable: true,
  });
}

function registerAccessor(descriptor, name) {
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
}

function viewportWidth() {
  return viewState.viewportWidth
    ?? Number(globalThis.screen?.width ?? 1280);
}

function viewportHeight() {
  return viewState.viewportHeight
    ?? Number(globalThis.screen?.height ?? 720);
}

function directFrameCount() {
  return globalThis.document?.getElementsByTagName?.("iframe").length ?? 0;
}

function styleMediaValue() {
  if (styleMedia !== undefined) return styleMedia;
  const state = new WeakSet();
  const prototype = {};
  const type = Object.getOwnPropertyDescriptor({
    get type() {
      requireStyleMedia(this, state);
      return "screen";
    },
  }, "type").get;
  registerNativeGetter(type, "type");
  Object.defineProperty(prototype, "type", {
    get: type,
    enumerable: true,
    configurable: true,
  });
  const matchMedium = {
    matchMedium() {
      requireStyleMedia(this, state);
      return evaluateMediaQuery(
        `${arguments[0]}`,
        viewportWidth(),
        viewportHeight(),
        Number(globalThis.devicePixelRatio),
      );
    },
  }.matchMedium;
  registerNativeFunction(matchMedium, "matchMedium");
  Object.defineProperty(prototype, "matchMedium", {
    value: matchMedium,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(prototype, Symbol.toStringTag, {
    value: "StyleMedia",
    writable: false,
    enumerable: false,
    configurable: true,
  });
  styleMedia = Object.create(prototype);
  state.add(styleMedia);
  return styleMedia;
}

function requireStyleMedia(value, state) {
  if (!state.has(value)) throw new TypeError("Illegal invocation");
}

function replaceDimension(width, height) {
  replaceGlobalNumber("innerWidth", width);
  replaceGlobalNumber("innerHeight", height);
  replaceGlobalNumber("outerWidth", width);
  replaceGlobalNumber("outerHeight", height);
}

function setViewportDimensions(width, height) {
  viewState.viewportWidth = width;
  viewState.viewportHeight = height;
  replaceDimension(width, height);
}

function replaceGlobalNumber(name, value) {
  Object.defineProperty(globalThis, name, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
