import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
function normalize(value) {
  const text = `${value}`.toLowerCase();
  return text === "high" || text === "low" ? text : "auto";
}
const descriptor = Object.getOwnPropertyDescriptor({
  get fetchPriority() {
    requireElement(this);
    const result = normalize(this.getAttribute("fetchpriority") ?? "");
    traceGetter("window.HTMLLinkElement.prototype.fetchPriority", "HTMLLinkElement", result);
    return result;
  },
  set fetchPriority(value) {
    requireElement(this);
    this.setAttribute("fetchpriority", normalize(value));
  },
}, "fetchPriority");
export const fetchPriority = descriptor.get;
export const setFetchPriority = descriptor.set;
registerNativeGetter(fetchPriority, "fetchPriority");
registerNativeFunction(setFetchPriority, "set fetchPriority");
