import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  requireDOMImplementation,
} from "./dom-implementation-constructor.js";
import {
  createDetachedHTMLDocument,
} from "./document-record.js";

export const createHTMLDocument = {
  createHTMLDocument() {
    requireDOMImplementation(this);
    const result = createDetachedHTMLDocument(
      arguments[0],
      arguments.length > 0,
    );
    traceCall(
      "window.DOMImplementation.prototype.createHTMLDocument",
      "DOMImplementation",
      [arguments[0]],
      result,
    );
    return result;
  },
}.createHTMLDocument;
registerNativeFunction(createHTMLDocument, "createHTMLDocument");
