import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireDialog } from "./html-dialog-element-state.js";
export const close = {
  close() {
    closeDialog(this, arguments.length > 0, arguments[0]);
    traceCall("window.HTMLDialogElement.prototype.close", "HTMLDialogElement", [...arguments], undefined);
  },
}.close;
registerNativeFunction(close, "close");

export function closeDialog(dialog, hasValue, value) {
  const state = requireDialog(dialog);
  if (!state.open) {
    return;
  }
  if (hasValue) {
    state.returnValue = `${value}`;
  }
  state.open = false;
  state.modal = false;
  dialog.dispatchEvent(new Event("close"));
}
