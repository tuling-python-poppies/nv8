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

export function installWindowStateGlobals() {
  defineStatefulAccessor("name");
  defineStatefulAccessor("status");
  defineReadonlyAccessor("closed", () => viewState.closed);
  defineReplaceableAccessor("frames", () => globalThis);
  defineReplaceableAccessor("length", directFrameCount);
  defineReplaceableAccessor("opener", () => null);
  defineReadonlyAccessor("frameElement", () => null);
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
