import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { requireURLSearchParams } from "./url-search-params-state.js";

export const has = {
  has(name) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'has' on 'URLSearchParams': 1 argument required");
    }
    const normalizedName = `${name}`;
    const normalizedValue = arguments.length > 1 ? `${arguments[1]}` : null;
    const value = requireURLSearchParams(this).pairs.some(([key, item]) => (
      key === normalizedName
      && (normalizedValue === null || item === normalizedValue)
    ));
    traceCall(
      "window.URLSearchParams.prototype.has",
      "URLSearchParams",
      normalizedValue === null
        ? [normalizedName]
        : [normalizedName, normalizedValue],
      value,
    );
    return value;
  },
}.has;
registerNativeFunction(has, "has");
export function installURLSearchParamsHas() {
  definePrototypeMethod(URLSearchParams.prototype, "has", has);
}
