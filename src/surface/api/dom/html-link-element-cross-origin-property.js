import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get crossOrigin() {
    requireElement(this);
    const result = this.getAttribute("crossorigin");
    traceGetter("window.HTMLLinkElement.prototype.crossOrigin", "HTMLLinkElement", result);
    return result;
  },
  set crossOrigin(value) {
    requireElement(this);
    if (value === null) this.removeAttribute("crossorigin");
    else this.setAttribute("crossorigin", `${value}`);
  },
}, "crossOrigin");
export const crossOrigin = descriptor.get;
export const setCrossOrigin = descriptor.set;
registerNativeGetter(crossOrigin, "crossOrigin");
registerNativeFunction(setCrossOrigin, "set crossOrigin");
