import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { createDocumentFragment } from "./document-fragment-constructor.js";
import { requireDocument } from "./document-record.js";

export const createDocumentFragmentCallback = {
  createDocumentFragment() {
    requireDocument(this);
    const result = createDocumentFragment(this);
    traceCall(
      "window.Document.prototype.createDocumentFragment",
      "Document",
      [],
      result,
    );
    return result;
  },
}.createDocumentFragment;
registerNativeFunction(createDocumentFragmentCallback, "createDocumentFragment");
export function installDocumentCreateDocumentFragment() {
  definePrototypeMethod(
    Document.prototype,
    "createDocumentFragment",
    createDocumentFragmentCallback,
  );
}
