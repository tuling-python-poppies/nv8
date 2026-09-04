import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireTextArea } from "./html-text-area-element-state.js";
export const select = { select() {
  const state = requireTextArea(this);
  state.selectionStart = 0;
  state.selectionEnd = state.value.length;
  state.selectionDirection = "none";
  traceCall("window.HTMLTextAreaElement.prototype.select", "HTMLTextAreaElement", [], undefined);
}}.select;
registerNativeFunction(select, "select");
