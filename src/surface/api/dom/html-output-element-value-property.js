import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import { requireOutput } from "./html-output-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get value() {
    const result = requireOutput(this).value;
    traceGetter("window.HTMLOutputElement.prototype.value", "HTMLOutputElement", result);
    return result;
  },
  set value(value) {
    const state = requireOutput(this);
    state.value = `${value}`;
    state.valueDirty = true;
    this.textContent = state.value;
  },
}, "value");
export const value = descriptor.get;
export const setValue = descriptor.set;
registerNativeGetter(value, "value");
registerNativeFunction(setValue, "set value");
