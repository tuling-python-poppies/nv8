import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireDialog } from "./html-dialog-element-state.js";
export const show = {
  show() {
    const state = requireDialog(this);
    if (state.open) {
      if (state.modal) {
        throw new TypeError("The dialog is already open as a modal dialog");
      }
      return;
    }
    state.open = true;
    state.modal = false;
    traceCall("window.HTMLDialogElement.prototype.show", "HTMLDialogElement", [], undefined);
  },
}.show;
registerNativeFunction(show, "show");
