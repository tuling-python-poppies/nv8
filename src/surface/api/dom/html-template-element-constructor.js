import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeTemplate } from "./html-template-element-state.js";

export function HTMLTemplateElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLTemplateElement, "HTMLTemplateElement");

function createHTMLTemplateElement(tagName, ownerDocument) {
  const element = Object.create(HTMLTemplateElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeTemplate(element, ownerDocument);
  return element;
}

export function installHTMLTemplateElementConstructor() {
  Object.setPrototypeOf(HTMLTemplateElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLTemplateElement, HTMLElement);
  delete HTMLTemplateElement.prototype.constructor;
  defineGlobalConstructor("HTMLTemplateElement", HTMLTemplateElement);
  registerHTMLElementFactory("template", createHTMLTemplateElement);
}
