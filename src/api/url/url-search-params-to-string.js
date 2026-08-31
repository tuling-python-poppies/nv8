import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { serializeURLSearchParams } from "./url-search-params-state.js";

export const toString = {
  toString() {
    const value = serializeURLSearchParams(this);
    traceCall("window.URLSearchParams.prototype.toString", "URLSearchParams", [], value);
    return value;
  },
}.toString;
registerNativeFunction(toString, "toString");
export function installURLSearchParamsToString() {
  definePrototypeMethod(URLSearchParams.prototype, "toString", toString);
}
