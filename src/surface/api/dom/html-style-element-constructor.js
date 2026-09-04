import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLStyleElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLStyleElement, "HTMLStyleElement");

function createHTMLStyleElement(tagName, ownerDocument) {
  const element = Object.create(HTMLStyleElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLStyleElementConstructor() {
  Object.setPrototypeOf(HTMLStyleElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLStyleElement, HTMLElement);
  delete HTMLStyleElement.prototype.constructor;
  defineGlobalConstructor("HTMLStyleElement", HTMLStyleElement);
  registerHTMLElementFactory("style", createHTMLStyleElement);
}
