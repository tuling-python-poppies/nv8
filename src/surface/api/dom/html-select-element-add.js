import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
export const add = {
  add(element) {
    const options = requireSelect(this).options;
    options.add(...arguments);
    traceCall("window.HTMLSelectElement.prototype.add", "HTMLSelectElement", [...arguments], undefined);
  },
}.add;
registerNativeFunction(add, "add");
