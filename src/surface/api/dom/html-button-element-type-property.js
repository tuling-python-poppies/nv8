import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { normalizedButtonType, requireButton } from "./html-button-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get type() {
    const result = normalizedButtonType(this);
    traceGetter("window.HTMLButtonElement.prototype.type", "HTMLButtonElement", result);
    return result;
  },
  set type(value) {
    requireButton(this);
    const text = `${value}`.toLowerCase();
    this.setAttribute("type", text === "reset" || text === "button" ? text : "submit");
  },
}, "type");
export const type = descriptor.get;
export const setType = descriptor.set;
registerNativeGetter(type, "type");
registerNativeFunction(setType, "set type");
