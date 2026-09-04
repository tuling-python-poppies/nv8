import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLAreaElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLAreaElement, "HTMLAreaElement");

function createHTMLAreaElement(tagName, ownerDocument) {
  const element = Object.create(HTMLAreaElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLAreaElementConstructor() {
  Object.setPrototypeOf(HTMLAreaElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLAreaElement, HTMLElement);
  delete HTMLAreaElement.prototype.constructor;
  defineGlobalConstructor("HTMLAreaElement", HTMLAreaElement);
  registerHTMLElementFactory("area", createHTMLAreaElement);
}
