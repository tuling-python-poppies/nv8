import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import { createTreeWalker } from "./tree-walker-state.js";

export const createTreeWalkerCallback = {
  createTreeWalker(root, whatToShow = 0xFFFFFFFF, filter = null) {
    requireDocument(this);
    const result = createTreeWalker(root, whatToShow, filter);
    traceCall(
      "window.Document.prototype.createTreeWalker",
      "Document",
      [root, whatToShow, filter],
      result,
    );
    return result;
  },
}.createTreeWalker;
registerNativeFunction(createTreeWalkerCallback, "createTreeWalker");

export function installDocumentCreateTreeWalker() {
  definePrototypeMethod(
    Document.prototype,
    "createTreeWalker",
    createTreeWalkerCallback,
  );
}
