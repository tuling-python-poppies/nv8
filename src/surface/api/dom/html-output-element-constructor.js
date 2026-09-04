import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeOutput } from "./html-output-element-state.js";

export function HTMLOutputElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLOutputElement, "HTMLOutputElement");

function createHTMLOutputElement(tagName, ownerDocument) {
  const element = Object.create(HTMLOutputElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeOutput(element);
  return element;
}

export function installHTMLOutputElementConstructor() {
  Object.setPrototypeOf(HTMLOutputElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLOutputElement, HTMLElement);
  delete HTMLOutputElement.prototype.constructor;
  defineGlobalConstructor("HTMLOutputElement", HTMLOutputElement);
  registerHTMLElementFactory("output", createHTMLOutputElement);
}
