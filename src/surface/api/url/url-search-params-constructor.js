import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  initializeURLSearchParams,
} from "./url-search-params-state.js";

export function URLSearchParams(init = undefined) {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'URLSearchParams': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  initializeURLSearchParams(this, init);
}

registerNativeFunction(URLSearchParams, "URLSearchParams");

export function installURLSearchParamsConstructor() {
  delete URLSearchParams.prototype.constructor;
  defineToStringTag(URLSearchParams.prototype, "URLSearchParams");
  defineGlobalConstructor("URLSearchParams", URLSearchParams);
}

export function installURLSearchParamsConstructorBacklink() {
  defineConstructorBacklink(URLSearchParams.prototype, URLSearchParams);
}
