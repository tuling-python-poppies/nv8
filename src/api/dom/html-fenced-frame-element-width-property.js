import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireFencedFrameElement } from "./html-fenced-frame-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get width() {
    requireFencedFrameElement(this);
    const result = this.getAttribute("width") ?? "";
    traceGetter("window.HTMLFencedFrameElement.prototype.width", "HTMLFencedFrameElement", result);
    return result;
  },
  set width(value) {
    requireFencedFrameElement(this);
    this.setAttribute("width", `${value}`);
  },
}, "width");
export const width = descriptor.get;
export const setWidth = descriptor.set;
registerNativeGetter(width, "width");
registerNativeFunction(setWidth, "set width");
