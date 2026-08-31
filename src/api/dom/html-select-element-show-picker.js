import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
export const showPicker = {
  showPicker() {
    requireSelect(this).pickerOpen = true;
    traceCall("window.HTMLSelectElement.prototype.showPicker", "HTMLSelectElement", [], undefined);
  },
}.showPicker;
registerNativeFunction(showPicker, "showPicker");
