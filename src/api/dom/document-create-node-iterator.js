import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import { createNodeIterator } from "./node-iterator-state.js";

export const createNodeIteratorCallback = {
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
