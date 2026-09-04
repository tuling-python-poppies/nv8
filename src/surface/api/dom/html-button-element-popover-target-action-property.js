import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireButton } from "./html-button-element-state.js";
const actions = new WeakMap();
const descriptor = Object.getOwnPropertyDescriptor({
  get popoverTargetAction() {
    requireButton(this);
    const result = actions.get(this) ?? "toggle";
    traceGetter("window.HTMLButtonElement.prototype.popoverTargetAction", "HTMLButtonElement", result);
    return result;
  },
  set popoverTargetAction(value) {
    requireButton(this);
    const text = `${value}`.toLowerCase();
    actions.set(this, text === "show" || text === "hide" ? text : "toggle");
  },
}, "popoverTargetAction");
export const popoverTargetAction = descriptor.get;
export const setPopoverTargetAction = descriptor.set;
registerNativeGetter(popoverTargetAction, "popoverTargetAction");
registerNativeFunction(setPopoverTargetAction, "set popoverTargetAction");
