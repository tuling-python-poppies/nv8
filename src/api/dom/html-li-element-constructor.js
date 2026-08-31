import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLLIElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLLIElement, "HTMLLIElement");

function createHTMLLIElement(tagName, ownerDocument) {
  const element = Object.create(HTMLLIElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLLIElementConstructor() {
  Object.setPrototypeOf(HTMLLIElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLLIElement, HTMLElement);
  delete HTMLLIElement.prototype.constructor;
  defineGlobalConstructor("HTMLLIElement", HTMLLIElement);
  registerHTMLElementFactory("li", createHTMLLIElement);
}
