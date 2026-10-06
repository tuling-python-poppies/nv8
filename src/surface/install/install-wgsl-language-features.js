import * as runtime from "../api/wgsl-language-features/wgsl-language-features-runtime.js";
import {
  WGSL_LANGUAGE_FEATURES_SURFACE,
} from "../api/wgsl-language-features/wgsl-language-features-surface.js";
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

export function installWGSLLanguageFeatures() {
  delete runtime.WGSLLanguageFeatures.prototype.constructor;
  defineGlobalConstructor(
    "WGSLLanguageFeatures",
    runtime.WGSLLanguageFeatures,
  );
  const methods = new Map();

    installAccessor("size");

    {
      methods.set("entries", installMethod("entries", 0));
    }

    {
      methods.set("forEach", installMethod("forEach", 1));
    }

    {
      methods.set("has", installMethod("has", 1));
    }

    {
      methods.set("keys", installMethod("keys", 0));
    }

    {
      methods.set("values", installMethod("values", 0));
    }

    {
      defineConstructorBacklink(
        runtime.WGSLLanguageFeatures.prototype,
        runtime.WGSLLanguageFeatures,
      );
    }

    {
      defineToStringTag(
        runtime.WGSLLanguageFeatures.prototype,
        "WGSLLanguageFeatures",
      );
    }

    {
      Object.defineProperty(
        runtime.WGSLLanguageFeatures.prototype,
        Symbol.iterator,
        {
          value: methods.get("values"),
          writable: true,
          enumerable: false,
          configurable: true,
        },
      );
    }

}

function installAccessor(name) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.wgslLanguageFeaturesProperty(this, name);
    },
  }, name).get;
  registerNativeGetter(getter, name);
  definePrototypeGetter(
    runtime.WGSLLanguageFeatures.prototype,
    name,
    getter,
  );
}

function installMethod(name, length) {
  const callback = {
    [name](...args) {
      return runtime.wgslLanguageFeaturesOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  return definePrototypeMethod(
    runtime.WGSLLanguageFeatures.prototype,
    name,
    callback,
  );
}
