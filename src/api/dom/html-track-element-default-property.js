import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTrackElement } from "./html-track-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get default() {
    requireTrackElement(this);
    const result = this.hasAttribute("default");
    traceGetter("window.HTMLTrackElement.prototype.default", "HTMLTrackElement", result);
    return result;
  },
  set default(value) {
    requireTrackElement(this);
    if (Boolean(value)) this.setAttribute("default", "");
    else this.removeAttribute("default");
  },
}, "default");
export const defaultEnabled = descriptor.get;
export const setDefault = descriptor.set;
registerNativeGetter(defaultEnabled, "default");
registerNativeFunction(setDefault, "set default");
