import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import { createNodeIterator } from "./node-iterator-state.js";

const createNodeIteratorCallback = {
  createNodeIterator(root, whatToShow = 0xFFFFFFFF, filter = null) {
    requireDocument(this);
    const result = createNodeIterator(root, whatToShow, filter);
    traceCall(
      "window.Document.prototype.createNodeIterator",
      "Document",
      [root, whatToShow, filter],
      result,
    );
    return result;
  },
}.createNodeIterator;
registerNativeFunction(createNodeIteratorCallback, "createNodeIterator");

export function installDocumentCreateNodeIterator() {
  definePrototypeMethod(
    Document.prototype,
    "createNodeIterator",
    createNodeIteratorCallback,
  );
}
