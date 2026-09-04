import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { requireURLSearchParams } from "./url-search-params-state.js";

export const entries = {
  entries() {
    const snapshot = requireURLSearchParams(this).pairs
      .map(([name, value]) => [name, value]);
    const result = snapshot.values();
    traceCall("window.URLSearchParams.prototype.entries", "URLSearchParams", [], result);
    return result;
  },
}.entries;
registerNativeFunction(entries, "entries");
export function installURLSearchParamsEntries() {
  definePrototypeMethod(URLSearchParams.prototype, "entries", entries);
}
