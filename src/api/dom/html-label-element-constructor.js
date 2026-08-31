import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLLabelElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLLabelElement, "HTMLLabelElement");

function createHTMLLabelElement(tagName, ownerDocument) {
  const element = Object.create(HTMLLabelElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLLabelElementConstructor() {
  Object.setPrototypeOf(HTMLLabelElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLLabelElement, HTMLElement);
  delete HTMLLabelElement.prototype.constructor;
  defineGlobalConstructor("HTMLLabelElement", HTMLLabelElement);
  registerHTMLElementFactory("label", createHTMLLabelElement);
}
