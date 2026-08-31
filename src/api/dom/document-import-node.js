import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cloneNodeAlgorithm } from "./node-algorithms.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import {
  DOCUMENT_NODE,
  isNode,
  requireNode,
  setOwnerDocumentDeep,
} from "./node-state.js";

export const importNode = {
  importNode(node) {
    requireDocument(this);
    if (!isNode(node)) {
      throw new TypeError("The provided value is not a Node.");
    }
    const record = requireNode(node);
    if (record.nodeType === DOCUMENT_NODE || record.host !== undefined) {
      throw new DOMException(
        "This node type may not be imported.",
        "NotSupportedError",
      );
    }
    const result = cloneNodeAlgorithm(node, Boolean(arguments[1]));
    setOwnerDocumentDeep(result, this);
    traceCall(
      "window.Document.prototype.importNode",
      "Document",
      [node, arguments[1]],
      result,
    );
    return result;
  },
}.importNode;
registerNativeFunction(importNode, "importNode");

export function installDocumentImportNode() {
  definePrototypeMethod(Document.prototype, "importNode", importNode);
}
