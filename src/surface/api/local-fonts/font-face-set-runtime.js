import { EventTarget } from "../event/event-target-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const state = new WeakMap();

// FontFaceSet prototype 安装标记、Edge 151 surface 开关和 Worker fonts 单例
// 原先是模块级状态，会让不同 Realm 共享初始化结果。
const fontFaceSetSlot = createRealmSlot(() => ({
  prototypeInstalled: false,
  edge151SurfaceEnabled: false,
  workerFonts: null,
}), "font-face-set-runtime");

function fontFaceSetState() {
  return fontFaceSetSlot.get(globalThis);
}

export function FontFaceSet() {
  if (new.target === undefined) {
    throw new TypeError("FontFaceSet requires new");
  }
  const input = arguments[0];
  const faces = input === undefined
    ? []
    : Array.from(input);
  initializeFontFaceSet(this, faces);
}
registerNativeFunction(FontFaceSet, "FontFaceSet");

export function createFontFaceSet() {
  installFontFaceSetPrototype();
  return new FontFaceSet();
}

export function installFontFaceSetConstructor({ edge151Surface = false } = {}) {
  installFontFaceSetPrototype(edge151Surface);
  defineGlobalConstructor("FontFaceSet", FontFaceSet);
}

export function installWorkerFontFaceSet({ exposeGlobal = false } = {}) {
  if (exposeGlobal) {
    installFontFaceSetConstructor({ edge151Surface: true });
  } else {
    installFontFaceSetPrototype();
  }
  const getter = Object.getOwnPropertyDescriptor({
    get fonts() {
      fontFaceSetState().workerFonts ??= createFontFaceSet();
      return fontFaceSetState().workerFonts;
    },
  }, "fonts").get;
  registerNativeGetter(getter, "fonts");
  definePrototypeGetter(globalThis.WorkerGlobalScope.prototype, "fonts", getter);
}

function installFontFaceSetPrototype(edge151Surface = false) {
  fontFaceSetState().edge151SurfaceEnabled ||= edge151Surface;
  if (fontFaceSetState().prototypeInstalled) return;
  fontFaceSetState().prototypeInstalled = true;
  Object.setPrototypeOf(FontFaceSet.prototype, EventTarget.prototype);
  Object.setPrototypeOf(FontFaceSet, EventTarget);
  delete FontFaceSet.prototype.constructor;
  for (const name of ["onloading", "onloadingdone", "onloadingerror"]) {
    const descriptor = Object.getOwnPropertyDescriptor({
      get [name]() { return requireState(this).handlers.get(name) ?? null; },
      set [name](value) {
        const record = requireState(this);
        if (typeof value === "function" || isObject(value)) {
          record.handlers.set(name, value);
        } else {
          record.handlers.delete(name);
        }
      },
    }, name);
    registerNativeGetter(descriptor.get, name);
    registerNativeFunction(descriptor.set, `set ${name}`);
    definePrototypeAccessor(
      FontFaceSet.prototype,
      name,
      descriptor.get,
      descriptor.set,
    );
  }
  const properties = edge151Surface
    ? ["ready", "status", "size"]
    : ["status", "ready", "size"];
  for (const name of properties) {
    const getter = Object.getOwnPropertyDescriptor({
      get [name]() { return fontFaceSetProperty(this, name); },
    }, name).get;
    registerNativeGetter(getter, name);
    definePrototypeGetter(FontFaceSet.prototype, name, getter);
  }
  const lengths = Object.freeze({
    check: 1,
    load: 1,
    add: 1,
    clear: 0,
    delete: 1,
    entries: 0,
    forEach: 1,
    has: 1,
    keys: 0,
    values: 0,
  });
  for (const [name, length] of Object.entries(lengths)) {
    const callback = {
      [name](...args) {
        return fontFaceSetOperation(this, name, args);
      },
    }[name];
    Object.defineProperty(callback, "length", {
      value: length,
      configurable: true,
    });
    registerNativeFunction(callback, name);
    definePrototypeMethod(FontFaceSet.prototype, name, callback);
  }
  defineConstructorBacklink(FontFaceSet.prototype, FontFaceSet);
  defineToStringTag(FontFaceSet.prototype, "FontFaceSet");
  Object.defineProperty(FontFaceSet.prototype, Symbol.iterator, {
    value: FontFaceSet.prototype.values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function initializeFontFaceSet(value, input) {
  initializeEventTarget(value);
  const faces = [...new Set(input.filter(isObject))];
  const record = {
    faces,
    handlers: new Map(),
    ready: null,
  };
  record.ready = Promise.resolve(value);
  state.set(value, record);
}

function fontFaceSetProperty(value, name) {
  const record = requireState(value);
  if (name === "status") return "loaded";
  if (name === "size") return record.faces.length;
  return record.ready;
}

function fontFaceSetOperation(value, name, args) {
  if (name === "load" && fontFaceSetState().edge151SurfaceEnabled && !state.has(value)) {
    return Promise.reject(
      new TypeError("Failed to execute 'load' on 'FontFaceSet': Illegal invocation"),
    );
  }
  const record = requireState(value);
  if (name === "check") return `${args[0]}`.trim().length > 0;
  if (name === "load") return Promise.resolve([...record.faces]);
  if (name === "add") {
    if (!isObject(args[0])) {
      throw new TypeError("FontFaceSet.add requires a FontFace");
    }
    if (!record.faces.includes(args[0])) record.faces.push(args[0]);
    return value;
  }
  if (name === "clear") {
    record.faces.length = 0;
    return undefined;
  }
  if (name === "delete") {
    const index = record.faces.indexOf(args[0]);
    if (index === -1) return false;
    record.faces.splice(index, 1);
    return true;
  }
  if (name === "has") return record.faces.includes(args[0]);
  if (name === "values" || name === "keys") {
    return record.faces.values();
  }
  if (name === "entries") {
    return record.faces.map(face => [face, face]).values();
  }
  if (name === "forEach") {
    if (typeof args[0] !== "function") {
      throw new TypeError("FontFaceSet.forEach requires a callback");
    }
    const receiver = args[1];
    for (const face of [...record.faces]) {
      Reflect.apply(args[0], receiver, [face, face, value]);
    }
    return undefined;
  }
  throw new TypeError(`Unsupported FontFaceSet operation: ${name}`);
}

function requireState(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function isObject(value) {
  return (typeof value === "object" && value !== null)
    || typeof value === "function";
}
