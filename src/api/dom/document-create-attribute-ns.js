import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { createAttr } from "./attr-state.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import {
  parseQualifiedName,
  validateName,
} from "./element-state.js";

export const createAttributeNS = {
  createAttributeNS(namespace, qualifiedName) {
    requireDocument(this);
    const name = `${qualifiedName}`;
    validateName(name);
    const parsed = parseQualifiedName(name);
    const normalizedNamespace = namespace === null || `${namespace}` === ""
      ? null
      : `${namespace}`;
    const result = createAttr(
      name,
      this,
      normalizedNamespace,
      parsed.prefix,
      parsed.localName,
    );
    traceCall(
      "window.Document.prototype.createAttributeNS",
      "Document",
      [namespace, qualifiedName],
      result,
    );
    return result;
  },
}.createAttributeNS;
registerNativeFunction(createAttributeNS, "createAttributeNS");
export function installDocumentCreateAttributeNS() {
  definePrototypeMethod(Document.prototype, "createAttributeNS", createAttributeNS);
}
