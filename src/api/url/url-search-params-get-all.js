import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { requireURLSearchParams } from "./url-search-params-state.js";

export const getAll = {
  getAll(name) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'getAll' on 'URLSearchParams': 1 argument required");
    }
    const normalized = `${name}`;
    const value = requireURLSearchParams(this).pairs
      .filter(([key]) => key === normalized)
      .map(([, item]) => item);
    traceCall("window.URLSearchParams.prototype.getAll", "URLSearchParams", [normalized], value);
    return value;
  },
}.getAll;
registerNativeFunction(getAll, "getAll");
export function installURLSearchParamsGetAll() {
  definePrototypeMethod(URLSearchParams.prototype, "getAll", getAll);
}
