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
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

export function installWGSLLanguageFeatures() {
  delete runtime.WGSLLanguageFeatures.prototype.constructor;
  defineGlobalConstructor(
    "WGSLLanguageFeatures",
    runtime.WGSLLanguageFeatures,
  );
  const methods = new Map();
  do {
    installAccessor(("size"));
  } while (false);
do {
    {
      methods.set(("entries"), installMethod(("entries"), (0)));
    }
  } while (false);
do {
    {
      methods.set(("forEach"), installMethod(("forEach"), (1)));
    }
  } while (false);
do {
    {
      methods.set(("has"), installMethod(("has"), (1)));
    }
  } while (false);
do {
    {
      methods.set(("keys"), installMethod(("keys"), (0)));
    }
  } while (false);
do {
    {
      methods.set(("values"), installMethod(("values"), (0)));
    }
  } while (false);
do {
    {
      defineConstructorBacklink(
        runtime.WGSLLanguageFeatures.prototype,
        runtime.WGSLLanguageFeatures,
      );
    }
  } while (false);
do {
    {
      defineToStringTag(
        runtime.WGSLLanguageFeatures.prototype,
        "WGSLLanguageFeatures",
      );
    }
  } while (false);
do {
    {
      Object.defineProperty(
        runtime.WGSLLanguageFeatures.prototype,
        Symbol.iterator,
        {
          value: methods.get(("values")),
          writable: true,
          enumerable: false,
          configurable: true,
        },
      );
    }
  } while (false);
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
