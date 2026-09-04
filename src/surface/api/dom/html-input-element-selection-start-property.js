import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get selectionStart() {
    const result = requireInput(this).selectionStart;
    traceGetter("window.HTMLInputElement.prototype.selectionStart", "HTMLInputElement", result);
    return result;
  },
  set selectionStart(value) {
    const state = requireInput(this);
    const position = Math.min(Number(value) >>> 0, state.value.length);
    state.selectionStart = position;
    if (position > state.selectionEnd) state.selectionEnd = position;
  },
}, "selectionStart");
export const selectionStart = descriptor.get;
export const setSelectionStart = descriptor.set;
registerNativeGetter(selectionStart, "selectionStart");
registerNativeFunction(setSelectionStart, "set selectionStart");
