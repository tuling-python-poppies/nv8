import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
export const webkitEntries = Object.getOwnPropertyDescriptor({
  get webkitEntries() {
    requireInput(this);
    const result = [];
    traceGetter("window.HTMLInputElement.prototype.webkitEntries", "HTMLInputElement", result);
    return result;
  },
}, "webkitEntries").get;
registerNativeGetter(webkitEntries, "webkitEntries");
