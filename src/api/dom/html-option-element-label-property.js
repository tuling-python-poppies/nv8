import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { getAttributeValue, requireElement, setAttributeValue } from "./element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get label() {
    requireElement(this);
    const result = getAttributeValue(this, "label") ?? this.text;
    traceGetter("window.HTMLOptionElement.prototype.label", "HTMLOptionElement", result);
    return result;
  },
  set label(value) {
    requireElement(this);
    setAttributeValue(this, "label", `${value}`);
  },
}, "label");
export const label = descriptor.get;
export const setLabel = descriptor.set;
registerNativeGetter(label, "label");
registerNativeFunction(setLabel, "set label");
