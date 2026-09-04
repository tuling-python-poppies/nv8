import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireForm } from "./html-form-element-state.js";

export const submit = {
  submit() {
    requireForm(this).submitCount += 1;
    traceCall("window.HTMLFormElement.prototype.submit", "HTMLFormElement", [], undefined);
  },
}.submit;
registerNativeFunction(submit, "submit");
