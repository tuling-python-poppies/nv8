import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireDialog } from "./html-dialog-element-state.js";
import { closeDialog } from "./html-dialog-element-close.js";
export const requestClose = {
  requestClose() {
    const state = requireDialog(this);
    if (!state.open) {
      return;
    }
    const accepted = this.dispatchEvent(new Event("cancel", { cancelable: true }));
    if (accepted) {
      closeDialog(this, arguments.length > 0, arguments[0]);
    }
    traceCall("window.HTMLDialogElement.prototype.requestClose", "HTMLDialogElement", [...arguments], undefined);
  },
}.requestClose;
registerNativeFunction(requestClose, "requestClose");
