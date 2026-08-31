import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireSelect, selectIsValid } from "./html-select-element-state.js";
export const checkValidity = {
  checkValidity() {
    requireSelect(this);
    const result = !this.willValidate || selectIsValid(this);
    if (!result) {
      this.dispatchEvent(new Event("invalid", { cancelable: true }));
    }
    traceCall("window.HTMLSelectElement.prototype.checkValidity", "HTMLSelectElement", [], result);
    return result;
  },
}.checkValidity;
registerNativeFunction(checkValidity, "checkValidity");
