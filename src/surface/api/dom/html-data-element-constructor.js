import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLDataElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLDataElement, "HTMLDataElement");

function createHTMLDataElement(tagName, ownerDocument) {
  const element = Object.create(HTMLDataElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLDataElementConstructor() {
  Object.setPrototypeOf(HTMLDataElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLDataElement, HTMLElement);
  delete HTMLDataElement.prototype.constructor;
  defineGlobalConstructor("HTMLDataElement", HTMLDataElement);
  registerHTMLElementFactory("data", createHTMLDataElement);
}
