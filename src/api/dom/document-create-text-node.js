import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import { createText } from "./text-constructor.js";

export const createTextNode = {
  createTextNode(data) {
    requireDocument(this);
    const result = createText(`${data}`, this);
    traceCall("window.Document.prototype.createTextNode", "Document", [data], result);
    return result;
  },
}.createTextNode;
registerNativeFunction(createTextNode, "createTextNode");
export function installDocumentCreateTextNode() {
  definePrototypeMethod(Document.prototype, "createTextNode", createTextNode);
}
