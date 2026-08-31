import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextArea } from "./html-text-area-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get selectionEnd() {
    const result = requireTextArea(this).selectionEnd;
    traceGetter("window.HTMLTextAreaElement.prototype.selectionEnd", "HTMLTextAreaElement", result);
    return result;
  },
  set selectionEnd(value) {
    const state = requireTextArea(this);
    const position = Math.min(Number(value) >>> 0, state.value.length);
    state.selectionEnd = position;
    if (position < state.selectionStart) state.selectionStart = position;
  },
}, "selectionEnd");
export const selectionEnd = descriptor.get;
export const setSelectionEnd = descriptor.set;
registerNativeGetter(selectionEnd, "selectionEnd");
registerNativeFunction(setSelectionEnd, "set selectionEnd");
