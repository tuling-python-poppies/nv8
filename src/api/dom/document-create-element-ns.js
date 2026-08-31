import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import { Element } from "./element-constructor.js";
import {
  HTML_NAMESPACE,
  initializeElement,
  MATHML_NAMESPACE,
  SVG_NAMESPACE,
  validateName,
} from "./element-state.js";
import { createHTMLElement } from "./html-element-constructor.js";
import { createMathMLElement } from "./math-ml-element-constructor.js";
import { createSVGElement } from "./svg-element-constructor.js";

export const createElementNS = {
  createElementNS(namespace, qualifiedName) {
    requireDocument(this);
    const name = `${qualifiedName}`;
    validateName(name);
    const normalizedNamespace = namespace === null || `${namespace}` === ""
      ? null
      : `${namespace}`;
    let result;
    if (normalizedNamespace === HTML_NAMESPACE) {
      result = createHTMLElement(name, this);
    } else if (normalizedNamespace === SVG_NAMESPACE) {
      result = createSVGElement(name, this);
    } else if (normalizedNamespace === MATHML_NAMESPACE) {
      result = createMathMLElement(name, this);
    } else {
      result = Object.create(Element.prototype);
      initializeElement(result, name, this, normalizedNamespace);
    }
    traceCall(
      "window.Document.prototype.createElementNS",
      "Document",
      [namespace, qualifiedName],
      result,
    );
    return result;
  },
}.createElementNS;
registerNativeFunction(createElementNS, "createElementNS");
export function installDocumentCreateElementNS() {
  definePrototypeMethod(Document.prototype, "createElementNS", createElementNS);
}
