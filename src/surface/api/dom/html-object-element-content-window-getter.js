import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireObjectElement } from "./html-object-element-state.js";
export const contentWindow = Object.getOwnPropertyDescriptor({
  get contentWindow() {
    requireObjectElement(this);
    const result = null;
    traceGetter("window.HTMLObjectElement.prototype.contentWindow", "HTMLObjectElement", result);
    return result;
  },
}, "contentWindow").get;
registerNativeGetter(contentWindow, "contentWindow");
