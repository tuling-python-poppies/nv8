import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
export const validity = Object.getOwnPropertyDescriptor({
  get validity() {
    const result = requireSelect(this).validity;
    traceGetter("window.HTMLSelectElement.prototype.validity", "HTMLSelectElement", result);
    return result;
  },
}, "validity").get;
registerNativeGetter(validity, "validity");
