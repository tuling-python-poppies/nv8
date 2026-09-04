import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
export const selectedOptions = Object.getOwnPropertyDescriptor({
  get selectedOptions() {
    const result = requireSelect(this).selectedOptions;
    traceGetter("window.HTMLSelectElement.prototype.selectedOptions", "HTMLSelectElement", result);
    return result;
  },
}, "selectedOptions").get;
registerNativeGetter(selectedOptions, "selectedOptions");
