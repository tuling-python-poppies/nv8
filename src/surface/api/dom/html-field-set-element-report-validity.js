import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireFieldSet } from "./html-field-set-element-state.js";

export const reportValidity = {
  reportValidity() {
    requireFieldSet(this);
    const result = true;
    traceCall("window.HTMLFieldSetElement.prototype.reportValidity", "HTMLFieldSetElement", [], result);
    return result;
  },
}.reportValidity;
registerNativeFunction(reportValidity, "reportValidity");
