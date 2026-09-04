import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireOutput } from "./html-output-element-state.js";

export const reportValidity = {
  reportValidity() {
    requireOutput(this);
    const result = true;
    traceCall("window.HTMLOutputElement.prototype.reportValidity", "HTMLOutputElement", [], result);
    return result;
  },
}.reportValidity;
registerNativeFunction(reportValidity, "reportValidity");
