import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { normalizedInputType, requireInput } from "./html-input-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get type() {
    const result = normalizedInputType(this);
    traceGetter("window.HTMLInputElement.prototype.type", "HTMLInputElement", result);
    return result;
  },
  set type(value) {
    requireInput(this);
    this.setAttribute("type", `${value}`);
  },
}, "type");
export const type = descriptor.get;
export const setType = descriptor.set;
registerNativeGetter(type, "type");
registerNativeFunction(setType, "set type");
