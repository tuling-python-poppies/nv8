import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeButton } from "./html-button-element-state.js";

export function HTMLButtonElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLButtonElement, "HTMLButtonElement");

function createHTMLButtonElement(tagName, ownerDocument) {
  const element = Object.create(HTMLButtonElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeButton(element);
  return element;
}

export function installHTMLButtonElementConstructor() {
  Object.setPrototypeOf(HTMLButtonElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLButtonElement, HTMLElement);
  delete HTMLButtonElement.prototype.constructor;
  defineGlobalConstructor("HTMLButtonElement", HTMLButtonElement);
  registerHTMLElementFactory("button", createHTMLButtonElement);
}
