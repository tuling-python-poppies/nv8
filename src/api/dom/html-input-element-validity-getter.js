import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
export const validity = Object.getOwnPropertyDescriptor({
  get validity() {
    const result = requireInput(this).validity;
    traceGetter("window.HTMLInputElement.prototype.validity", "HTMLInputElement", result);
    return result;
  },
}, "validity").get;
registerNativeGetter(validity, "validity");
