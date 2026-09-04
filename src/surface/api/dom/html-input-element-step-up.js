import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { applyInputStep } from "./html-input-element-step-state.js";
export const stepUp = { stepUp() {
  applyInputStep(this, 1, arguments[0]);
  traceCall("window.HTMLInputElement.prototype.stepUp", "HTMLInputElement", [...arguments], undefined);
}}.stepUp;
registerNativeFunction(stepUp, "stepUp");
