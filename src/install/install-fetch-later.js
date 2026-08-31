import * as runtime from "../api/fetch-later/fetch-later-runtime.js";
import {
  FETCH_LATER_SURFACE,
} from "../api/fetch-later/fetch-later-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineGlobalFunction,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

export function installFetchLater() {
  delete runtime.FetchLaterResult.prototype.constructor;
  defineGlobalConstructor("FetchLaterResult", runtime.FetchLaterResult);
  do {
    installAccessor(("activated"));
  } while (false);
do {
    {
      defineConstructorBacklink(
        runtime.FetchLaterResult.prototype,
        runtime.FetchLaterResult,
      );
    }
  } while (false);
do {
    {
      defineToStringTag(
        runtime.FetchLaterResult.prototype,
        "FetchLaterResult",
      );
    }
  } while (false);
  registerNativeFunction(runtime.fetchLater, "fetchLater");
  defineGlobalFunction("fetchLater", runtime.fetchLater);
}

function installAccessor(name) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.fetchLaterProperty(this, name);
    },
  }, name).get;
  registerNativeGetter(getter, name);
  definePrototypeGetter(runtime.FetchLaterResult.prototype, name, getter);
}
