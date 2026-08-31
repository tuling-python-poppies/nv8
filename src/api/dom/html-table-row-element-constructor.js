import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLTableRowElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLTableRowElement, "HTMLTableRowElement");

function createHTMLTableRowElement(tagName, ownerDocument) {
  const element = Object.create(HTMLTableRowElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLTableRowElementConstructor() {
  Object.setPrototypeOf(HTMLTableRowElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLTableRowElement, HTMLElement);
  delete HTMLTableRowElement.prototype.constructor;
  defineGlobalConstructor("HTMLTableRowElement", HTMLTableRowElement);
  registerHTMLElementFactory("tr", createHTMLTableRowElement);
}
