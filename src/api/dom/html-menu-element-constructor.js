import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLMenuElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLMenuElement, "HTMLMenuElement");

function createHTMLMenuElement(tagName, ownerDocument) {
  const element = Object.create(HTMLMenuElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLMenuElementConstructor() {
  Object.setPrototypeOf(HTMLMenuElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLMenuElement, HTMLElement);
  delete HTMLMenuElement.prototype.constructor;
  defineGlobalConstructor("HTMLMenuElement", HTMLMenuElement);
  registerHTMLElementFactory("menu", createHTMLMenuElement);
}
