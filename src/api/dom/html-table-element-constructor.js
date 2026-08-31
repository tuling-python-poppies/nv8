import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLTableElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLTableElement, "HTMLTableElement");

function createHTMLTableElement(tagName, ownerDocument) {
  const element = Object.create(HTMLTableElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLTableElementConstructor() {
  Object.setPrototypeOf(HTMLTableElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLTableElement, HTMLElement);
  delete HTMLTableElement.prototype.constructor;
  defineGlobalConstructor("HTMLTableElement", HTMLTableElement);
  registerHTMLElementFactory("table", createHTMLTableElement);
}
