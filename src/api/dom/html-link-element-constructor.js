import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLLinkElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLLinkElement, "HTMLLinkElement");

function createHTMLLinkElement(tagName, ownerDocument) {
  const element = Object.create(HTMLLinkElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLLinkElementConstructor() {
  Object.setPrototypeOf(HTMLLinkElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLLinkElement, HTMLElement);
  delete HTMLLinkElement.prototype.constructor;
  defineGlobalConstructor("HTMLLinkElement", HTMLLinkElement);
  registerHTMLElementFactory("link", createHTMLLinkElement);
}
