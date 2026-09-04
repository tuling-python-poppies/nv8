import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Document } from "./document-constructor.js";

export function XMLDocument() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(XMLDocument, "XMLDocument");

export function installXMLDocumentConstructor() {
  Object.setPrototypeOf(XMLDocument.prototype, Document.prototype);
  Object.setPrototypeOf(XMLDocument, Document);
  delete XMLDocument.prototype.constructor;
  defineGlobalConstructor("XMLDocument", XMLDocument);
}

export function finishXMLDocumentConstructor() {
  defineConstructorBacklink(XMLDocument.prototype, XMLDocument);
  defineToStringTag(XMLDocument.prototype, "XMLDocument");
}
