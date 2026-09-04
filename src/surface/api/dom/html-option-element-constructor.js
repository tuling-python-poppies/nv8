import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeOption } from "./html-option-element-state.js";

export function HTMLOptionElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLOptionElement, "HTMLOptionElement");

export function createHTMLOptionElement(tagName, ownerDocument) {
  const element = Object.create(HTMLOptionElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeOption(element);
  return element;
}

export function installHTMLOptionElementConstructor() {
  Object.setPrototypeOf(HTMLOptionElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLOptionElement, HTMLElement);
  delete HTMLOptionElement.prototype.constructor;
  defineGlobalConstructor("HTMLOptionElement", HTMLOptionElement);
  registerHTMLElementFactory("option", createHTMLOptionElement);
}
