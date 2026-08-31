import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";

export const getSVGDocument = {
  getSVGDocument() {
    requireElement(this);
    const result = null;
    traceCall(
      "window.HTMLEmbedElement.prototype.getSVGDocument",
      "HTMLEmbedElement",
      [],
      result,
    );
    return result;
  },
}.getSVGDocument;
registerNativeFunction(getSVGDocument, "getSVGDocument");
