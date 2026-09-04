import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLTableCellElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLTableCellElement, "HTMLTableCellElement");

function createHTMLTableCellElement(tagName, ownerDocument) {
  const element = Object.create(HTMLTableCellElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLTableCellElementConstructor() {
  Object.setPrototypeOf(HTMLTableCellElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLTableCellElement, HTMLElement);
  delete HTMLTableCellElement.prototype.constructor;
  defineGlobalConstructor("HTMLTableCellElement", HTMLTableCellElement);
  registerHTMLElementFactory("td", createHTMLTableCellElement);
  registerHTMLElementFactory("th", createHTMLTableCellElement);
}
