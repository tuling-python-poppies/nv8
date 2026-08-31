import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLTimeElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLTimeElement, "HTMLTimeElement");

function createHTMLTimeElement(tagName, ownerDocument) {
  const element = Object.create(HTMLTimeElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLTimeElementConstructor() {
  Object.setPrototypeOf(HTMLTimeElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLTimeElement, HTMLElement);
  delete HTMLTimeElement.prototype.constructor;
  defineGlobalConstructor("HTMLTimeElement", HTMLTimeElement);
  registerHTMLElementFactory("time", createHTMLTimeElement);
}
