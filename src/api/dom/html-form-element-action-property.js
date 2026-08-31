import { traceGetter } from "../../trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import { ownerURL } from "./html-reflection.js";
import { requireForm } from "./html-form-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get action() {
    requireForm(this);
    const raw = this.getAttribute("action");
    const result = new URL(raw === null || raw === "" ? ownerURL(this) : raw, ownerURL(this)).href;
    traceGetter("window.HTMLFormElement.prototype.action", "HTMLFormElement", result);
    return result;
  },
  set action(value) {
    requireForm(this);
    this.setAttribute("action", `${value}`);
  },
}, "action");
export const action = descriptor.get;
export const setAction = descriptor.set;
registerNativeGetter(action, "action");
registerNativeFunction(setAction, "set action");
