import * as runtime from "../api/cache/cache-runtime.js";
import { CACHE_SURFACES } from "../api/cache/cache-surface.js";
import {
  defineConstructorBacklink, defineGlobalConstructor, definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { registerNativeFunction, registerNativeGetter } from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.cacheConstructors.map(Constructor => [Constructor.name, Constructor]),
));

export function installCacheAPI() {
  do {
    delete (((runtime.cacheConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.cacheConstructors)[0])).name, (((runtime.cacheConstructors)[0])));
  } while (false);
do {
    delete (((runtime.cacheConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.cacheConstructors)[1])).name, (((runtime.cacheConstructors)[1])));
  } while (false);
  do {
    do {
      {
        const callback = { [("add")](...args) {
          return runtime.cacheOperation(this, ("add"), args);
        } }[("add")];
        Object.defineProperty(callback, "length", { value: (1), configurable: true });
        registerNativeFunction(callback, ("add"));
        definePrototypeMethod(constructors[("Cache")].prototype, ("add"), callback);
      }
    } while (false);
do {
      {
        const callback = { [("addAll")](...args) {
          return runtime.cacheOperation(this, ("addAll"), args);
        } }[("addAll")];
        Object.defineProperty(callback, "length", { value: (1), configurable: true });
        registerNativeFunction(callback, ("addAll"));
        definePrototypeMethod(constructors[("Cache")].prototype, ("addAll"), callback);
      }
    } while (false);
do {
      {
        const callback = { [("delete")](...args) {
          return runtime.cacheOperation(this, ("delete"), args);
        } }[("delete")];
        Object.defineProperty(callback, "length", { value: (1), configurable: true });
        registerNativeFunction(callback, ("delete"));
        definePrototypeMethod(constructors[("Cache")].prototype, ("delete"), callback);
      }
    } while (false);
do {
      {
        const callback = { [("keys")](...args) {
          return runtime.cacheOperation(this, ("keys"), args);
        } }[("keys")];
        Object.defineProperty(callback, "length", { value: (0), configurable: true });
        registerNativeFunction(callback, ("keys"));
        definePrototypeMethod(constructors[("Cache")].prototype, ("keys"), callback);
      }
    } while (false);
do {
      {
        const callback = { [("match")](...args) {
          return runtime.cacheOperation(this, ("match"), args);
        } }[("match")];
        Object.defineProperty(callback, "length", { value: (1), configurable: true });
        registerNativeFunction(callback, ("match"));
        definePrototypeMethod(constructors[("Cache")].prototype, ("match"), callback);
      }
    } while (false);
do {
      {
        const callback = { [("matchAll")](...args) {
          return runtime.cacheOperation(this, ("matchAll"), args);
        } }[("matchAll")];
        Object.defineProperty(callback, "length", { value: (0), configurable: true });
        registerNativeFunction(callback, ("matchAll"));
        definePrototypeMethod(constructors[("Cache")].prototype, ("matchAll"), callback);
      }
    } while (false);
do {
      {
        const callback = { [("put")](...args) {
          return runtime.cacheOperation(this, ("put"), args);
        } }[("put")];
        Object.defineProperty(callback, "length", { value: (2), configurable: true });
        registerNativeFunction(callback, ("put"));
        definePrototypeMethod(constructors[("Cache")].prototype, ("put"), callback);
      }
    } while (false);
do {
      {
        defineConstructorBacklink(constructors[("Cache")].prototype, constructors[("Cache")]);
      }
    } while (false);
do {
      {
        defineToStringTag(constructors[("Cache")].prototype, ("Cache"));
      }
    } while (false);
  } while (false);
do {
    do {
      {
        const callback = { [("delete")](...args) {
          return runtime.cacheOperation(this, ("delete"), args);
        } }[("delete")];
        Object.defineProperty(callback, "length", { value: (1), configurable: true });
        registerNativeFunction(callback, ("delete"));
        definePrototypeMethod(constructors[("CacheStorage")].prototype, ("delete"), callback);
      }
    } while (false);
do {
      {
        const callback = { [("has")](...args) {
          return runtime.cacheOperation(this, ("has"), args);
        } }[("has")];
        Object.defineProperty(callback, "length", { value: (1), configurable: true });
        registerNativeFunction(callback, ("has"));
        definePrototypeMethod(constructors[("CacheStorage")].prototype, ("has"), callback);
      }
    } while (false);
do {
      {
        const callback = { [("keys")](...args) {
          return runtime.cacheOperation(this, ("keys"), args);
        } }[("keys")];
        Object.defineProperty(callback, "length", { value: (0), configurable: true });
        registerNativeFunction(callback, ("keys"));
        definePrototypeMethod(constructors[("CacheStorage")].prototype, ("keys"), callback);
      }
    } while (false);
do {
      {
        const callback = { [("match")](...args) {
          return runtime.cacheOperation(this, ("match"), args);
        } }[("match")];
        Object.defineProperty(callback, "length", { value: (1), configurable: true });
        registerNativeFunction(callback, ("match"));
        definePrototypeMethod(constructors[("CacheStorage")].prototype, ("match"), callback);
      }
    } while (false);
do {
      {
        const callback = { [("open")](...args) {
          return runtime.cacheOperation(this, ("open"), args);
        } }[("open")];
        Object.defineProperty(callback, "length", { value: (1), configurable: true });
        registerNativeFunction(callback, ("open"));
        definePrototypeMethod(constructors[("CacheStorage")].prototype, ("open"), callback);
      }
    } while (false);
do {
      {
        defineConstructorBacklink(constructors[("CacheStorage")].prototype, constructors[("CacheStorage")]);
      }
    } while (false);
do {
      {
        defineToStringTag(constructors[("CacheStorage")].prototype, ("CacheStorage"));
      }
    } while (false);
  } while (false);
  const descriptor = Object.getOwnPropertyDescriptor({
    get caches() { return runtime.createCacheStorage(); },
  }, "caches");
  registerNativeGetter(descriptor.get, "caches");
  Object.defineProperty(globalThis, "caches", {
    get: descriptor.get,
    enumerable: true,
    configurable: true,
  });
}
