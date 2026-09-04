import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireFieldSet } from "./html-field-set-element-state.js";

export const checkValidity = {
  checkValidity() {
    requireFieldSet(this);
    const result = true;
    traceCall("window.HTMLFieldSetElement.prototype.checkValidity", "HTMLFieldSetElement", [], result);
    return result;
  },
}.checkValidity;
registerNativeFunction(checkValidity, "checkValidity");
