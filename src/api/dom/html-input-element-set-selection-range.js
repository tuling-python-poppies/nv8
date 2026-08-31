import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
export const setSelectionRange = { setSelectionRange(start, end) {
  const state = requireInput(this);
  const normalizedEnd = Math.min(Number(end) >>> 0, state.value.length);
  state.selectionEnd = normalizedEnd;
  state.selectionStart = Math.min(Number(start) >>> 0, normalizedEnd);
  const direction = arguments[2];
  state.selectionDirection = direction === "forward" || direction === "backward"
    ? direction : "none";
  traceCall("window.HTMLInputElement.prototype.setSelectionRange", "HTMLInputElement", [...arguments], undefined);
}}.setSelectionRange;
registerNativeFunction(setSelectionRange, "setSelectionRange");
