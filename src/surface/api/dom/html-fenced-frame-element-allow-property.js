import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
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
