import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireInput, setInputValue } from "./html-input-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get value() {
    const result = requireInput(this).value;
    traceGetter("window.HTMLInputElement.prototype.value", "HTMLInputElement", result);
    return result;
  },
  set value(value) {
    setInputValue(this, value);
  },
}, "value");
export const value = descriptor.get;
export const setValue = descriptor.set;
registerNativeGetter(value, "value");
registerNativeFunction(setValue, "set value");
