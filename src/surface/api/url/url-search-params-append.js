import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { mutateURLSearchParams } from "./url-search-params-state.js";

export const append = {
  append(name, value) {
    if (arguments.length < 2) {
      throw new TypeError("Failed to execute 'append' on 'URLSearchParams': 2 arguments required");
    }
    const pair = [`${name}`, `${value}`];
    mutateURLSearchParams(this, (pairs) => pairs.push(pair));
    traceCall("window.URLSearchParams.prototype.append", "URLSearchParams", pair, undefined);
  },
}.append;
registerNativeFunction(append, "append");
export function installURLSearchParamsAppend() {
  definePrototypeMethod(URLSearchParams.prototype, "append", append);
}
