import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { createDocumentFragment } from "./document-fragment-constructor.js";
import { requireDocument } from "./document-record.js";

const createDocumentFragmentCallback = {
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
