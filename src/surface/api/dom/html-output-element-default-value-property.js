import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import { requireOutput } from "./html-output-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get defaultValue() {
    const result = requireOutput(this).defaultValue;
    traceGetter("window.HTMLOutputElement.prototype.defaultValue", "HTMLOutputElement", result);
    return result;
  },
  set defaultValue(value) {
    const state = requireOutput(this);
    const normalized = `${value}`;
    state.defaultValue = normalized;
    if (!state.valueDirty) {
      state.value = normalized;
    }
    this.textContent = normalized;
  },
}, "defaultValue");
export const defaultValue = descriptor.get;
export const setDefaultValue = descriptor.set;
registerNativeGetter(defaultValue, "defaultValue");
registerNativeFunction(setDefaultValue, "set defaultValue");
