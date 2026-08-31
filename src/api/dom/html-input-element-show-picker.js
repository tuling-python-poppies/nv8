import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
export const showPicker = { showPicker() {
  requireInput(this).pickerOpen = true;
  traceCall("window.HTMLInputElement.prototype.showPicker", "HTMLInputElement", [], undefined);
}}.showPicker;
registerNativeFunction(showPicker, "showPicker");
