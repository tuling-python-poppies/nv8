import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { controlsAreValid, requireForm } from "./html-form-element-state.js";

export const checkValidity = {
  checkValidity() {
    requireForm(this);
    const result = controlsAreValid(this);
    traceCall("window.HTMLFormElement.prototype.checkValidity", "HTMLFormElement", [], result);
    return result;
  },
}.checkValidity;
registerNativeFunction(checkValidity, "checkValidity");
