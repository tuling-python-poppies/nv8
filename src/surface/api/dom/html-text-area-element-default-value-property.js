import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextArea } from "./html-text-area-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get defaultValue() {
    requireTextArea(this);
    const result = this.textContent;
    traceGetter("window.HTMLTextAreaElement.prototype.defaultValue", "HTMLTextAreaElement", result);
    return result;
  },
  set defaultValue(value) {
    const state = requireTextArea(this);
    const normalized = `${value}`;
    this.textContent = normalized;
    if (!state.valueDirty) state.value = normalized;
  },
}, "defaultValue");
export const defaultValue = descriptor.get;
export const setDefaultValue = descriptor.set;
registerNativeGetter(defaultValue, "defaultValue");
registerNativeFunction(setDefaultValue, "set defaultValue");
