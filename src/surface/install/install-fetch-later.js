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
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

export function installFetchLater() {
  delete runtime.FetchLaterResult.prototype.constructor;
  defineGlobalConstructor("FetchLaterResult", runtime.FetchLaterResult);

    installAccessor("activated");

    {
      defineConstructorBacklink(
        runtime.FetchLaterResult.prototype,
        runtime.FetchLaterResult,
      );
    }

    {
      defineToStringTag(
        runtime.FetchLaterResult.prototype,
        "FetchLaterResult",
      );
    }

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
