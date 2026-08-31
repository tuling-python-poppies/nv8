import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireDialog } from "./html-dialog-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get closedBy() {
    const result = requireDialog(this).closedBy;
    traceGetter("window.HTMLDialogElement.prototype.closedBy", "HTMLDialogElement", result);
    return result;
  },
  set closedBy(value) {
    const normalized = `${value}`.toLowerCase();
    requireDialog(this).closedBy =
      normalized === "any" || normalized === "closerequest"
        ? normalized
        : "none";
  },
}, "closedBy");
export const closedBy = descriptor.get;
export const setClosedBy = descriptor.set;
registerNativeGetter(closedBy, "closedBy");
registerNativeFunction(setClosedBy, "set closedBy");
