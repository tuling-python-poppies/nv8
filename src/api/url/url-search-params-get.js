import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { requireURLSearchParams } from "./url-search-params-state.js";

export const get = {
  get(name) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'get' on 'URLSearchParams': 1 argument required");
    }
    const normalized = `${name}`;
    const pair = requireURLSearchParams(this).pairs.find(([key]) => key === normalized);
    const value = pair?.[1] ?? null;
    traceCall("window.URLSearchParams.prototype.get", "URLSearchParams", [normalized], value);
    return value;
  },
}.get;
registerNativeFunction(get, "get");
export function installURLSearchParamsGet() {
  definePrototypeMethod(URLSearchParams.prototype, "get", get);
}
