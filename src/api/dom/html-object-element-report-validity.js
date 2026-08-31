import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireObjectElement } from "./html-object-element-state.js";
export const reportValidity = {
  reportValidity() {
    requireObjectElement(this);
    const result = true;
    traceCall("window.HTMLObjectElement.prototype.reportValidity", "HTMLObjectElement", [], result);
    return result;
  },
}.reportValidity;
registerNativeFunction(reportValidity, "reportValidity");
