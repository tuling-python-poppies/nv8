import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireObjectElement } from "./html-object-element-state.js";
export const getSVGDocument = {
  getSVGDocument() {
    requireObjectElement(this);
    const result = null;
    traceCall("window.HTMLObjectElement.prototype.getSVGDocument", "HTMLObjectElement", [], result);
    return result;
  },
}.getSVGDocument;
registerNativeFunction(getSVGDocument, "getSVGDocument");
