import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { applyInputStep } from "./html-input-element-step-state.js";
export const stepDown = { stepDown() {
  applyInputStep(this, -1, arguments[0]);
  traceCall("window.HTMLInputElement.prototype.stepDown", "HTMLInputElement", [...arguments], undefined);
}}.stepDown;
registerNativeFunction(stepDown, "stepDown");
