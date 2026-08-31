import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireOutput } from "./html-output-element-state.js";

export const validationMessage = Object.getOwnPropertyDescriptor({
  get validationMessage() {
    requireOutput(this);
    const result = "";
    traceGetter("window.HTMLOutputElement.prototype.validationMessage", "HTMLOutputElement", result);
    return result;
  },
}, "validationMessage").get;
registerNativeGetter(validationMessage, "validationMessage");
