import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireFencedFrameElement } from "./html-fenced-frame-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get allow() {
    requireFencedFrameElement(this);
    const result = this.getAttribute("allow") ?? "";
    traceGetter("window.HTMLFencedFrameElement.prototype.allow", "HTMLFencedFrameElement", result);
    return result;
  },
  set allow(value) {
    requireFencedFrameElement(this);
    this.setAttribute("allow", `${value}`);
  },
}, "allow");
export const allow = descriptor.get;
export const setAllow = descriptor.set;
registerNativeGetter(allow, "allow");
registerNativeFunction(setAllow, "set allow");
