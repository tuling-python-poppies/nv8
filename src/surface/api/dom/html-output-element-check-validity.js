import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireOutput } from "./html-output-element-state.js";

export const checkValidity = {
  checkValidity() {
    requireOutput(this);
    const result = true;
    traceCall("window.HTMLOutputElement.prototype.checkValidity", "HTMLOutputElement", [], result);
    return result;
  },
}.checkValidity;
registerNativeFunction(checkValidity, "checkValidity");
