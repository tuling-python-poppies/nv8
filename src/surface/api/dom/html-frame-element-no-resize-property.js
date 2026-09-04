import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireFrameElement } from "./html-frame-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get noResize() {
    requireFrameElement(this);
    const result = this.hasAttribute("noresize");
    traceGetter("window.HTMLFrameElement.prototype.noResize", "HTMLFrameElement", result);
    return result;
  },
  set noResize(value) {
    requireFrameElement(this);
    if (Boolean(value)) this.setAttribute("noresize", "");
    else this.removeAttribute("noresize");
  },
}, "noResize");
export const noResize = descriptor.get;
export const setNoResize = descriptor.set;
registerNativeGetter(noResize, "noResize");
registerNativeFunction(setNoResize, "set noResize");
