import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireFieldSet } from "./html-field-set-element-state.js";

export const validity = Object.getOwnPropertyDescriptor({
  get validity() {
    const result = requireFieldSet(this).validity;
    traceGetter("window.HTMLFieldSetElement.prototype.validity", "HTMLFieldSetElement", result);
    return result;
  },
}, "validity").get;
registerNativeGetter(validity, "validity");
