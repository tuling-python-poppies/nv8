import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLSourceElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLSourceElement, "HTMLSourceElement");

function createHTMLSourceElement(tagName, ownerDocument) {
  const element = Object.create(HTMLSourceElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLSourceElementConstructor() {
  Object.setPrototypeOf(HTMLSourceElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLSourceElement, HTMLElement);
  delete HTMLSourceElement.prototype.constructor;
  defineGlobalConstructor("HTMLSourceElement", HTMLSourceElement);
  registerHTMLElementFactory("source", createHTMLSourceElement);
}
