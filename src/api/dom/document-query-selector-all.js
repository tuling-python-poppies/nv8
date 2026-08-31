import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { querySelectorAllAlgorithm } from "./selector-engine.js";

export const querySelectorAll = {
  querySelectorAll(selector) {
    const result = querySelectorAllAlgorithm(this, selector);
    traceCall(
      "window.Document.prototype.querySelectorAll",
      "Document",
      [selector],
      result,
    );
    return result;
  },
}.querySelectorAll;
registerNativeFunction(querySelectorAll, "querySelectorAll");
export function installDocumentQuerySelectorAll() {
  definePrototypeMethod(Document.prototype, "querySelectorAll", querySelectorAll);
}
