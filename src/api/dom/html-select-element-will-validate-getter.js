import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
export const willValidate = Object.getOwnPropertyDescriptor({
  get willValidate() {
    requireSelect(this);
    const result = !this.disabled;
    traceGetter("window.HTMLSelectElement.prototype.willValidate", "HTMLSelectElement", result);
    return result;
  },
}, "willValidate").get;
registerNativeGetter(willValidate, "willValidate");
