import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireObjectElement } from "./html-object-element-state.js";
export const contentDocument = Object.getOwnPropertyDescriptor({
  get contentDocument() {
    requireObjectElement(this);
    const result = null;
    traceGetter("window.HTMLObjectElement.prototype.contentDocument", "HTMLObjectElement", result);
    return result;
  },
}, "contentDocument").get;
registerNativeGetter(contentDocument, "contentDocument");
