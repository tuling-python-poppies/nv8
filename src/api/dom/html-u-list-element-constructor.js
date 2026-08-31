import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLUListElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLUListElement, "HTMLUListElement");

function createHTMLUListElement(tagName, ownerDocument) {
  const element = Object.create(HTMLUListElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLUListElementConstructor() {
  Object.setPrototypeOf(HTMLUListElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLUListElement, HTMLElement);
  delete HTMLUListElement.prototype.constructor;
  defineGlobalConstructor("HTMLUListElement", HTMLUListElement);
  registerHTMLElementFactory("ul", createHTMLUListElement);
}
