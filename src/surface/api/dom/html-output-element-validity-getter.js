import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireOutput } from "./html-output-element-state.js";

export const validity = Object.getOwnPropertyDescriptor({
  get validity() {
    const result = requireOutput(this).validity;
    traceGetter("window.HTMLOutputElement.prototype.validity", "HTMLOutputElement", result);
    return result;
  },
}, "validity").get;
registerNativeGetter(validity, "validity");
