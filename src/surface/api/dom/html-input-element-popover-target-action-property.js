import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get popoverTargetAction() {
    const result = requireInput(this).popoverTargetAction;
    traceGetter("window.HTMLInputElement.prototype.popoverTargetAction", "HTMLInputElement", result);
    return result;
  },
  set popoverTargetAction(value) {
    const state = requireInput(this);
    const text = `${value}`.toLowerCase();
    state.popoverTargetAction = text === "show" || text === "hide" ? text : "toggle";
  },
}, "popoverTargetAction");
export const popoverTargetAction = descriptor.get;
export const setPopoverTargetAction = descriptor.set;
registerNativeGetter(popoverTargetAction, "popoverTargetAction");
registerNativeFunction(setPopoverTargetAction, "set popoverTargetAction");
