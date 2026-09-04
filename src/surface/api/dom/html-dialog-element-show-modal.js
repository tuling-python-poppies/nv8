import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireDialog } from "./html-dialog-element-state.js";
export const showModal = {
  showModal() {
    const state = requireDialog(this);
    if (state.open) {
      if (!state.modal) {
        throw new TypeError("The dialog is already open as a non-modal dialog");
      }
      return;
    }
    state.open = true;
    state.modal = true;
    traceCall("window.HTMLDialogElement.prototype.showModal", "HTMLDialogElement", [], undefined);
  },
}.showModal;
registerNativeFunction(showModal, "showModal");
