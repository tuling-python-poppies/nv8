import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { controlsAreValid, requireForm } from "./html-form-element-state.js";

export const reportValidity = {
  reportValidity() {
    requireForm(this);
    const result = controlsAreValid(this, true);
    traceCall("window.HTMLFormElement.prototype.reportValidity", "HTMLFormElement", [], result);
    return result;
  },
}.reportValidity;
registerNativeFunction(reportValidity, "reportValidity");
