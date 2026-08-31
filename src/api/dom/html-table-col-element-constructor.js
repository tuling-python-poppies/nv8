import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLTableColElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLTableColElement, "HTMLTableColElement");

function createHTMLTableColElement(tagName, ownerDocument) {
  const element = Object.create(HTMLTableColElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLTableColElementConstructor() {
  Object.setPrototypeOf(HTMLTableColElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLTableColElement, HTMLElement);
  delete HTMLTableColElement.prototype.constructor;
  defineGlobalConstructor("HTMLTableColElement", HTMLTableColElement);
  registerHTMLElementFactory("col", createHTMLTableColElement);
  registerHTMLElementFactory("colgroup", createHTMLTableColElement);
}
