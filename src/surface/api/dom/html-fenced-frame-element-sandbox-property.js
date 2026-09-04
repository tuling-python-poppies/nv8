import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireFencedFrameElement } from "./html-fenced-frame-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get sandbox() {
    const result = requireFencedFrameElement(this).sandbox;
    traceGetter("window.HTMLFencedFrameElement.prototype.sandbox", "HTMLFencedFrameElement", result);
    return result;
  },
  set sandbox(value) {
    requireFencedFrameElement(this);
    this.setAttribute("sandbox", `${value}`);
  },
}, "sandbox");
export const sandbox = descriptor.get;
export const setSandbox = descriptor.set;
registerNativeGetter(sandbox, "sandbox");
registerNativeFunction(setSandbox, "set sandbox");
