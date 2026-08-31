import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireObjectElement } from "./html-object-element-state.js";
export const checkValidity = {
  checkValidity() {
    requireObjectElement(this);
    const result = true;
    traceCall("window.HTMLObjectElement.prototype.checkValidity", "HTMLObjectElement", [], result);
    return result;
  },
}.checkValidity;
registerNativeFunction(checkValidity, "checkValidity");
