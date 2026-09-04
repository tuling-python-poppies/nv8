import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLTableSectionElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLTableSectionElement, "HTMLTableSectionElement");

function createHTMLTableSectionElement(tagName, ownerDocument) {
  const element = Object.create(HTMLTableSectionElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLTableSectionElementConstructor() {
  Object.setPrototypeOf(HTMLTableSectionElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLTableSectionElement, HTMLElement);
  delete HTMLTableSectionElement.prototype.constructor;
  defineGlobalConstructor("HTMLTableSectionElement", HTMLTableSectionElement);
  registerHTMLElementFactory("thead", createHTMLTableSectionElement);
  registerHTMLElementFactory("tbody", createHTMLTableSectionElement);
  registerHTMLElementFactory("tfoot", createHTMLTableSectionElement);
}
