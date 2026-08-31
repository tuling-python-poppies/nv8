import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireFencedFrameElement } from "./html-fenced-frame-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get height() {
    requireFencedFrameElement(this);
    const result = this.getAttribute("height") ?? "";
    traceGetter("window.HTMLFencedFrameElement.prototype.height", "HTMLFencedFrameElement", result);
    return result;
  },
  set height(value) {
    requireFencedFrameElement(this);
    this.setAttribute("height", `${value}`);
  },
}, "height");
export const height = descriptor.get;
export const setHeight = descriptor.set;
registerNativeGetter(height, "height");
registerNativeFunction(setHeight, "set height");
