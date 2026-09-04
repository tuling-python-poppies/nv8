import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
export const options = Object.getOwnPropertyDescriptor({
  get options() {
    const result = requireSelect(this).options;
    traceGetter("window.HTMLSelectElement.prototype.options", "HTMLSelectElement", result);
    return result;
  },
}, "options").get;
registerNativeGetter(options, "options");
