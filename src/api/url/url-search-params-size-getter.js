import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { requireURLSearchParams } from "./url-search-params-state.js";

export const size = Object.getOwnPropertyDescriptor({
  get size() {
    const value = requireURLSearchParams(this).pairs.length;
    traceGetter("window.URLSearchParams.prototype.size", "URLSearchParams", value);
    return value;
  },
}, "size").get;
registerNativeGetter(size, "size");
export function installURLSearchParamsSize() {
  definePrototypeGetter(URLSearchParams.prototype, "size", size);
}
