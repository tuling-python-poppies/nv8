import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { getAttributeValue, requireElement, setAttributeValue } from "./element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get value() {
    requireElement(this);
    const result = getAttributeValue(this, "value") ?? this.text;
    traceGetter("window.HTMLOptionElement.prototype.value", "HTMLOptionElement", result);
    return result;
  },
  set value(value) {
    requireElement(this);
    setAttributeValue(this, "value", `${value}`);
  },
}, "value");
export const value = descriptor.get;
export const setValue = descriptor.set;
registerNativeGetter(value, "value");
registerNativeFunction(setValue, "set value");
