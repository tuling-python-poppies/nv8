import {
  DOCUMENT_TYPE_NODE,
  initializeNode,
} from "./node-state.js";
import { DocumentType } from "./document-type-constructor.js";

const documentTypeState = new WeakMap();

export function createDocumentType(
  name,
  ownerDocument,
  publicId = "",
  systemId = "",
) {
  const doctype = Object.create(DocumentType.prototype);
  initializeNode(doctype, DOCUMENT_TYPE_NODE, name, null, ownerDocument);
  documentTypeState.set(doctype, {
    name,
    publicId,
    systemId,
  });
  return doctype;
}

export function requireDocumentType(value) {
  const state = documentTypeState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}
