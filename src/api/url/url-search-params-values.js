import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { requireURLSearchParams } from "./url-search-params-state.js";

export const values = {
  values() {
    const result = requireURLSearchParams(this).pairs
      .map(([, value]) => value)
      .values();
    traceCall("window.URLSearchParams.prototype.values", "URLSearchParams", [], result);
    return result;
  },
}.values;
registerNativeFunction(values, "values");
export function installURLSearchParamsValues() {
  definePrototypeMethod(URLSearchParams.prototype, "values", values);
}
