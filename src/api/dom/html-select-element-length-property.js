import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get length() {
    const result = requireSelect(this).options.length;
    traceGetter("window.HTMLSelectElement.prototype.length", "HTMLSelectElement", result);
    return result;
  },
  set length(value) {
    requireSelect(this).options.length = value;
  },
}, "length");
export const length = descriptor.get;
export const setLength = descriptor.set;
registerNativeGetter(length, "length");
registerNativeFunction(setLength, "set length");
