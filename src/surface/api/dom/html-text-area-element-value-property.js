import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextArea, setTextAreaValue } from "./html-text-area-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get value() {
    const result = requireTextArea(this).value;
    traceGetter("window.HTMLTextAreaElement.prototype.value", "HTMLTextAreaElement", result);
    return result;
  },
  set value(value) {
    setTextAreaValue(this, value);
  },
}, "value");
export const value = descriptor.get;
export const setValue = descriptor.set;
registerNativeGetter(value, "value");
registerNativeFunction(setValue, "set value");
