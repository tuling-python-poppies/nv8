import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireDialog } from "./html-dialog-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get returnValue() {
    const result = requireDialog(this).returnValue;
    traceGetter("window.HTMLDialogElement.prototype.returnValue", "HTMLDialogElement", result);
    return result;
  },
  set returnValue(value) {
    requireDialog(this).returnValue = `${value}`;
  },
}, "returnValue");
export const returnValue = descriptor.get;
export const setReturnValue = descriptor.set;
registerNativeGetter(returnValue, "returnValue");
registerNativeFunction(setReturnValue, "set returnValue");
