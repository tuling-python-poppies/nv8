import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
export const namedItem = {
  namedItem(name) {
    const result = requireSelect(this).options.namedItem(name);
    traceCall("window.HTMLSelectElement.prototype.namedItem", "HTMLSelectElement", [name], result);
    return result;
  },
}.namedItem;
registerNativeFunction(namedItem, "namedItem");
