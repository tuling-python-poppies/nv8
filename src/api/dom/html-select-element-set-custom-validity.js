import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
export const setCustomValidity = {
  setCustomValidity(error) {
    requireSelect(this).customValidity = `${error}`;
    traceCall("window.HTMLSelectElement.prototype.setCustomValidity", "HTMLSelectElement", [error], undefined);
  },
}.setCustomValidity;
registerNativeFunction(setCustomValidity, "setCustomValidity");
