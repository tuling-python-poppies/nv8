import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { ownerURL } from "./html-reflection.js";
import { requireButton } from "./html-button-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get formAction() {
    requireButton(this);
    const raw = this.getAttribute("formaction");
    const result = new URL(raw === null || raw === "" ? ownerURL(this) : raw, ownerURL(this)).href;
    traceGetter("window.HTMLButtonElement.prototype.formAction", "HTMLButtonElement", result);
    return result;
  },
  set formAction(value) {
    requireButton(this);
    this.setAttribute("formaction", `${value}`);
  },
}, "formAction");
export const formAction = descriptor.get;
export const setFormAction = descriptor.set;
registerNativeGetter(formAction, "formAction");
registerNativeFunction(setFormAction, "set formAction");
