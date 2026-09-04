import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
function normalize(value) {
  const text = `${value}`;
  return text === "forward" || text === "backward" ? text : "none";
}
const descriptor = Object.getOwnPropertyDescriptor({
  get selectionDirection() {
    const result = requireInput(this).selectionDirection;
    traceGetter("window.HTMLInputElement.prototype.selectionDirection", "HTMLInputElement", result);
    return result;
  },
  set selectionDirection(value) {
    requireInput(this).selectionDirection = normalize(value);
  },
}, "selectionDirection");
export const selectionDirection = descriptor.get;
export const setSelectionDirection = descriptor.set;
registerNativeGetter(selectionDirection, "selectionDirection");
registerNativeFunction(setSelectionDirection, "set selectionDirection");
