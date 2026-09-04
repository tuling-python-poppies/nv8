import * as runtime from "../api/url-pattern/url-pattern-runtime.js";
import { URL_PATTERN_SURFACE } from "../api/url-pattern/url-pattern-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

export function installURLPattern() {
  delete runtime.URLPattern.prototype.constructor;
  defineGlobalConstructor("URLPattern", runtime.URLPattern);
  do {
    {
      const descriptor = Object.getOwnPropertyDescriptor({
        get [("protocol")]() { return runtime.urlPatternProperty(this, ("protocol")); },
      }, ("protocol"));
      registerNativeGetter(descriptor.get, ("protocol"));
      definePrototypeGetter(runtime.URLPattern.prototype, ("protocol"), descriptor.get);
    }
  } while (false);
do {
    {
      const descriptor = Object.getOwnPropertyDescriptor({
        get [("username")]() { return runtime.urlPatternProperty(this, ("username")); },
      }, ("username"));
      registerNativeGetter(descriptor.get, ("username"));
      definePrototypeGetter(runtime.URLPattern.prototype, ("username"), descriptor.get);
    }
  } while (false);
do {
    {
      const descriptor = Object.getOwnPropertyDescriptor({
        get [("password")]() { return runtime.urlPatternProperty(this, ("password")); },
      }, ("password"));
      registerNativeGetter(descriptor.get, ("password"));
      definePrototypeGetter(runtime.URLPattern.prototype, ("password"), descriptor.get);
    }
  } while (false);
do {
    {
      const descriptor = Object.getOwnPropertyDescriptor({
        get [("hostname")]() { return runtime.urlPatternProperty(this, ("hostname")); },
      }, ("hostname"));
      registerNativeGetter(descriptor.get, ("hostname"));
      definePrototypeGetter(runtime.URLPattern.prototype, ("hostname"), descriptor.get);
    }
  } while (false);
do {
    {
      const descriptor = Object.getOwnPropertyDescriptor({
        get [("port")]() { return runtime.urlPatternProperty(this, ("port")); },
      }, ("port"));
      registerNativeGetter(descriptor.get, ("port"));
      definePrototypeGetter(runtime.URLPattern.prototype, ("port"), descriptor.get);
    }
  } while (false);
do {
    {
      const descriptor = Object.getOwnPropertyDescriptor({
        get [("pathname")]() { return runtime.urlPatternProperty(this, ("pathname")); },
      }, ("pathname"));
      registerNativeGetter(descriptor.get, ("pathname"));
      definePrototypeGetter(runtime.URLPattern.prototype, ("pathname"), descriptor.get);
    }
  } while (false);
do {
    {
      const descriptor = Object.getOwnPropertyDescriptor({
        get [("search")]() { return runtime.urlPatternProperty(this, ("search")); },
      }, ("search"));
      registerNativeGetter(descriptor.get, ("search"));
      definePrototypeGetter(runtime.URLPattern.prototype, ("search"), descriptor.get);
    }
  } while (false);
do {
    {
      const descriptor = Object.getOwnPropertyDescriptor({
        get [("hash")]() { return runtime.urlPatternProperty(this, ("hash")); },
      }, ("hash"));
      registerNativeGetter(descriptor.get, ("hash"));
      definePrototypeGetter(runtime.URLPattern.prototype, ("hash"), descriptor.get);
    }
  } while (false);
do {
    {
      const descriptor = Object.getOwnPropertyDescriptor({
        get [("hasRegExpGroups")]() { return runtime.urlPatternProperty(this, ("hasRegExpGroups")); },
      }, ("hasRegExpGroups"));
      registerNativeGetter(descriptor.get, ("hasRegExpGroups"));
      definePrototypeGetter(runtime.URLPattern.prototype, ("hasRegExpGroups"), descriptor.get);
    }
  } while (false);
do {
    {
      const callback = { [("exec")](...args) {
        return runtime.urlPatternOperation(this, ("exec"), args);
      } }[("exec")];
      Object.defineProperty(callback, "length", { value: (0), configurable: true });
      registerNativeFunction(callback, ("exec"));
      definePrototypeMethod(runtime.URLPattern.prototype, ("exec"), callback);
    }
  } while (false);
do {
    {
      const callback = { [("test")](...args) {
        return runtime.urlPatternOperation(this, ("test"), args);
      } }[("test")];
      Object.defineProperty(callback, "length", { value: (0), configurable: true });
      registerNativeFunction(callback, ("test"));
      definePrototypeMethod(runtime.URLPattern.prototype, ("test"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink(runtime.URLPattern.prototype, runtime.URLPattern);
    }
  } while (false);
do {
    {
      defineToStringTag(runtime.URLPattern.prototype, "URLPattern");
    }
  } while (false);
}
