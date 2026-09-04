import * as runtime from "../api/origin/origin-runtime.js";
import { ORIGIN_SURFACE } from "../api/origin/origin-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineStaticMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

export function installOrigin() {
  delete runtime.Origin.prototype.constructor;
  defineGlobalConstructor("Origin", runtime.Origin);
  do {
    installAccessor(("opaque"));
  } while (false);
do {
    installMethod(("isSameOrigin"), (1));
  } while (false);
do {
    installMethod(("isSameSite"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink(runtime.Origin.prototype, runtime.Origin);
    }
  } while (false);
do {
    {
      defineToStringTag(runtime.Origin.prototype, "Origin");
    }
  } while (false);
  defineStaticMethod(runtime.Origin, "from", runtime.originFrom, 1);
  installOriginGlobal();
}

function installAccessor(name) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.originProperty(this, name);
    },
  }, name).get;
  registerNativeGetter(getter, name);
  definePrototypeGetter(runtime.Origin.prototype, name, getter);
}

function installMethod(name, length) {
  const callback = {
    [name](...args) {
      return runtime.originOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(runtime.Origin.prototype, name, callback);
}

function installOriginGlobal() {
  const descriptor = Object.getOwnPropertyDescriptor({
    get origin() {
      return runtime.currentGlobalOrigin();
    },
    set origin(value) {
      Object.defineProperty(globalThis, "origin", {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    },
  }, "origin");
  registerNativeGetter(descriptor.get, "origin");
  registerNativeFunction(descriptor.set, "set origin");
  Object.defineProperty(globalThis, "origin", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}
