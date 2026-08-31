import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
export const select = { select() {
  const state = requireInput(this);
  state.selectionStart = 0;
  state.selectionEnd = state.value.length;
  state.selectionDirection = "none";
  traceCall("window.HTMLInputElement.prototype.select", "HTMLInputElement", [], undefined);
}}.select;
registerNativeFunction(select, "select");
