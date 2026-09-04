import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireFrameElement } from "./html-frame-element-state.js";
export const contentDocument = Object.getOwnPropertyDescriptor({
  get contentDocument() {
    requireFrameElement(this);
    const result = null;
    traceGetter("window.HTMLFrameElement.prototype.contentDocument", "HTMLFrameElement", result);
    return result;
  },
}, "contentDocument").get;
registerNativeGetter(contentDocument, "contentDocument");
