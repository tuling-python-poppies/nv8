import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireInput, sanitizeInputValue } from "./html-input-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get defaultValue() {
    requireInput(this);
    const result = this.getAttribute("value") ?? "";
    traceGetter("window.HTMLInputElement.prototype.defaultValue", "HTMLInputElement", result);
    return result;
  },
  set defaultValue(value) {
    const state = requireInput(this);
    const normalized = `${value}`;
    this.setAttribute("value", normalized);
    if (!state.valueDirty) state.value = sanitizeInputValue(this, normalized);
  },
}, "defaultValue");
export const defaultValue = descriptor.get;
export const setDefaultValue = descriptor.set;
registerNativeGetter(defaultValue, "defaultValue");
registerNativeFunction(setDefaultValue, "set defaultValue");
