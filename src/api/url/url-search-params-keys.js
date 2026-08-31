import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { requireURLSearchParams } from "./url-search-params-state.js";

export const keys = {
  keys() {
    const result = requireURLSearchParams(this).pairs
      .map(([name]) => name)
      .values();
    traceCall("window.URLSearchParams.prototype.keys", "URLSearchParams", [], result);
    return result;
  },
}.keys;
registerNativeFunction(keys, "keys");
export function installURLSearchParamsKeys() {
  definePrototypeMethod(URLSearchParams.prototype, "keys", keys);
}
