import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Node } from "./node-constructor.js";

export function DocumentType() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(DocumentType, "DocumentType");

export function installDocumentTypeConstructor() {
  Object.setPrototypeOf(DocumentType.prototype, Node.prototype);
  Object.setPrototypeOf(DocumentType, Node);
  delete DocumentType.prototype.constructor;
  defineGlobalConstructor("DocumentType", DocumentType);
}

export function finishDocumentTypeConstructor() {
  defineConstructorBacklink(DocumentType.prototype, DocumentType);
  defineToStringTag(DocumentType.prototype, "DocumentType");
  Object.defineProperty(DocumentType.prototype, Symbol.unscopables, {
    value: Object.freeze({
      after: true,
      before: true,
      remove: true,
      replaceWith: true,
    }),
    writable: false,
    enumerable: false,
    configurable: true,
  });
}
