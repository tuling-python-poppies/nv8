import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireFrameElement } from "./html-frame-element-state.js";
export const contentWindow = Object.getOwnPropertyDescriptor({
  get contentWindow() {
    requireFrameElement(this);
    const result = null;
    traceGetter("window.HTMLFrameElement.prototype.contentWindow", "HTMLFrameElement", result);
    return result;
  },
}, "contentWindow").get;
registerNativeGetter(contentWindow, "contentWindow");
