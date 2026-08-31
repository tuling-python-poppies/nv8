import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { constructXMLDocument } from "./document-record.js";

export function Document() {
  // 真实浏览器**允许** `new Document()`，构造一个空的 XML 文档。
  // 迁移前这里直接抛 Illegal constructor。实测数据见 constructXMLDocument()。
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'Document': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  return constructXMLDocument();
}
registerNativeFunction(Document, "Document");

export function installDocumentConstructor() {
  Object.setPrototypeOf(Document.prototype, Node.prototype);
  Object.setPrototypeOf(Document, Node);
  delete Document.prototype.constructor;
  defineGlobalConstructor("Document", Document);
}

export function finishDocumentConstructor() {
  defineConstructorBacklink(Document.prototype, Document);
}

export function finishDocumentToStringTag() {
  defineToStringTag(Document.prototype, "Document");
}

export function finishDocumentUnscopables() {
  Object.defineProperty(Document.prototype, Symbol.unscopables, {
    value: Object.freeze({
      append: true,
      prepend: true,
      replaceChildren: true,
    }),
    writable: false,
    enumerable: false,
    configurable: true,
  });
}
