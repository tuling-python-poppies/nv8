import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeInput } from "./html-input-element-state.js";

export function HTMLInputElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLInputElement, "HTMLInputElement");

function createHTMLInputElement(tagName, ownerDocument) {
  const element = Object.create(HTMLInputElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeInput(element);
  return element;
}

export function installHTMLInputElementConstructor() {
  Object.setPrototypeOf(HTMLInputElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLInputElement, HTMLElement);
  delete HTMLInputElement.prototype.constructor;
  defineGlobalConstructor("HTMLInputElement", HTMLInputElement);
  registerHTMLElementFactory("input", createHTMLInputElement);
}
