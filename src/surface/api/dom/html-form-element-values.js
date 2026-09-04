import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { formControls } from "./html-form-element-state.js";

export const values = {
  values() {
    const result = formControls(this)[Symbol.iterator]();
    traceCall("window.HTMLFormElement.prototype.values", "HTMLFormElement", [], result);
    return result;
  },
}.values;
registerNativeFunction(values, "values");
