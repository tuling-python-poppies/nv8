import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  requireDOMImplementation,
} from "./dom-implementation-constructor.js";
import { createXMLDocument } from "./document-record.js";
import {
  DOCUMENT_TYPE_NODE,
  isNode,
  requireNode,
} from "./node-state.js";

export const createDocument = {
  createDocument(namespace, qualifiedName) {
    requireDOMImplementation(this);
    const document = createXMLDocument();
    const doctype = arguments[2] ?? null;
    if (doctype !== null) {
      if (
        !isNode(doctype)
        || requireNode(doctype).nodeType !== DOCUMENT_TYPE_NODE
      ) {
        throw new TypeError("The provided doctype is not a DocumentType.");
      }
      if (requireNode(doctype).parent !== null) {
        throw new DOMException(
          "The doctype already has a parent.",
          "WrongDocumentError",
        );
      }
      document.appendChild(doctype);
    }
    if (`${qualifiedName}` !== "") {
      document.appendChild(
        document.createElementNS(namespace, qualifiedName),
      );
    }
    traceCall(
      "window.DOMImplementation.prototype.createDocument",
      "DOMImplementation",
      [namespace, qualifiedName, doctype],
      document,
    );
    return document;
  },
}.createDocument;
registerNativeFunction(createDocument, "createDocument");
