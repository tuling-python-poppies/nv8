import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
export const select = { select() {
  const state = requireInput(this);
  state.selectionStart = 0;
  state.selectionEnd = state.value.length;
  state.selectionDirection = "none";
  traceCall("window.HTMLInputElement.prototype.select", "HTMLInputElement", [], undefined);
}}.select;
registerNativeFunction(select, "select");
