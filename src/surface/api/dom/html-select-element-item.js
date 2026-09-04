import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
export const item = {
  item(index) {
    const result = requireSelect(this).options.item(index);
    traceCall("window.HTMLSelectElement.prototype.item", "HTMLSelectElement", [index], result);
    return result;
  },
}.item;
registerNativeFunction(item, "item");
