import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireDialog } from "./html-dialog-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get open() {
    const result = requireDialog(this).open;
    traceGetter("window.HTMLDialogElement.prototype.open", "HTMLDialogElement", result);
    return result;
  },
  set open(value) {
    const state = requireDialog(this);
    state.open = Boolean(value);
    if (!state.open) {
      state.modal = false;
    }
  },
}, "open");
export const open = descriptor.get;
export const setOpen = descriptor.set;
registerNativeGetter(open, "open");
registerNativeFunction(setOpen, "set open");
