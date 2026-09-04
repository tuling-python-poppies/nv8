import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import {
  detachNode,
  DOCUMENT_NODE,
  isNode,
  requireNode,
  setOwnerDocumentDeep,
} from "./node-state.js";

export const adoptNode = {
  adoptNode(node) {
    requireDocument(this);
    if (!isNode(node)) {
      throw new TypeError("The provided value is not a Node.");
    }
    const record = requireNode(node);
    if (record.nodeType === DOCUMENT_NODE || record.host !== undefined) {
      throw new DOMException(
        "This node type may not be adopted.",
        "NotSupportedError",
      );
    }
    detachNode(node);
    setOwnerDocumentDeep(node, this);
    traceCall(
      "window.Document.prototype.adoptNode",
      "Document",
      [node],
      node,
    );
    return node;
  },
}.adoptNode;
registerNativeFunction(adoptNode, "adoptNode");

export function installDocumentAdoptNode() {
  definePrototypeMethod(Document.prototype, "adoptNode", adoptNode);
}
