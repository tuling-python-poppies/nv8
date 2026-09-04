import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { mutateURLSearchParams } from "./url-search-params-state.js";

export const set = {
  set(name, value) {
    if (arguments.length < 2) {
      throw new TypeError("Failed to execute 'set' on 'URLSearchParams': 2 arguments required");
    }
    const normalizedName = `${name}`;
    const normalizedValue = `${value}`;
    mutateURLSearchParams(this, (pairs) => {
      const first = pairs.findIndex(([key]) => key === normalizedName);
      if (first === -1) {
        pairs.push([normalizedName, normalizedValue]);
        return;
      }
      pairs[first][1] = normalizedValue;
      for (let index = pairs.length - 1; index > first; index -= 1) {
        if (pairs[index][0] === normalizedName) {
          pairs.splice(index, 1);
        }
      }
    });
    traceCall(
      "window.URLSearchParams.prototype.set",
      "URLSearchParams",
      [normalizedName, normalizedValue],
      undefined,
    );
  },
}.set;
registerNativeFunction(set, "set");
export function installURLSearchParamsSet() {
  definePrototypeMethod(URLSearchParams.prototype, "set", set);
}
