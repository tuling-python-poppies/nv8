import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextArea } from "./html-text-area-element-state.js";
function normalize(value) {
  const text = `${value}`;
  return text === "forward" || text === "backward" ? text : "none";
}
const descriptor = Object.getOwnPropertyDescriptor({
  get selectionDirection() {
    const result = requireTextArea(this).selectionDirection;
    traceGetter("window.HTMLTextAreaElement.prototype.selectionDirection", "HTMLTextAreaElement", result);
    return result;
  },
  set selectionDirection(value) {
    requireTextArea(this).selectionDirection = normalize(value);
  },
}, "selectionDirection");
export const selectionDirection = descriptor.get;
export const setSelectionDirection = descriptor.set;
registerNativeGetter(selectionDirection, "selectionDirection");
registerNativeFunction(setSelectionDirection, "set selectionDirection");
