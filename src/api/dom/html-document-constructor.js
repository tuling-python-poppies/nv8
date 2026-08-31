import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";

export function HTMLDocument() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLDocument, "HTMLDocument");

export function installHTMLDocumentConstructor() {
  Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype);
  Object.setPrototypeOf(HTMLDocument, Document);
  delete HTMLDocument.prototype.constructor;
  defineGlobalConstructor("HTMLDocument", HTMLDocument);
  defineConstructorBacklink(HTMLDocument.prototype, HTMLDocument);
  defineToStringTag(HTMLDocument.prototype, "HTMLDocument");
}
