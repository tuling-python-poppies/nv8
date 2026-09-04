import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { requireURLSearchParams } from "./url-search-params-state.js";

export const forEach = {
  forEach(callback) {
    const state = requireURLSearchParams(this);
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'forEach' on 'URLSearchParams': 1 argument required");
    }
    if (typeof callback !== "function") {
      throw new TypeError("URLSearchParams.forEach callback is not callable");
    }
    const thisArg = arguments[1];
    for (let index = 0; index < state.pairs.length; index += 1) {
      const [name, value] = state.pairs[index];
      Reflect.apply(callback, thisArg, [value, name, this]);
    }
    traceCall(
      "window.URLSearchParams.prototype.forEach",
      "URLSearchParams",
      [callback, thisArg],
      undefined,
    );
  },
}.forEach;
registerNativeFunction(forEach, "forEach");
export function installURLSearchParamsForEach() {
  definePrototypeMethod(URLSearchParams.prototype, "forEach", forEach);
}
