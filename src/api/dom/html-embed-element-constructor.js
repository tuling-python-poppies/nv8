import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLEmbedElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLEmbedElement, "HTMLEmbedElement");

function createHTMLEmbedElement(tagName, ownerDocument) {
  const element = Object.create(HTMLEmbedElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLEmbedElementConstructor() {
  Object.setPrototypeOf(HTMLEmbedElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLEmbedElement, HTMLElement);
  delete HTMLEmbedElement.prototype.constructor;
  defineGlobalConstructor("HTMLEmbedElement", HTMLEmbedElement);
  registerHTMLElementFactory("embed", createHTMLEmbedElement);
}
