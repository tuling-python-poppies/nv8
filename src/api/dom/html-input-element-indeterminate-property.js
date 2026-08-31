import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get indeterminate() {
    const result = requireInput(this).indeterminate;
    traceGetter("window.HTMLInputElement.prototype.indeterminate", "HTMLInputElement", result);
    return result;
  },
  set indeterminate(value) {
    requireInput(this).indeterminate = Boolean(value);
  },
}, "indeterminate");
export const indeterminate = descriptor.get;
export const setIndeterminate = descriptor.set;
registerNativeGetter(indeterminate, "indeterminate");
registerNativeFunction(setIndeterminate, "set indeterminate");
