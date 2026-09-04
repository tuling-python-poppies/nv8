import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLBRElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLBRElement, "HTMLBRElement");

function createHTMLBRElement(tagName, ownerDocument) {
  const element = Object.create(HTMLBRElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLBRElementConstructor() {
  Object.setPrototypeOf(HTMLBRElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLBRElement, HTMLElement);
  delete HTMLBRElement.prototype.constructor;
  defineGlobalConstructor("HTMLBRElement", HTMLBRElement);
  registerHTMLElementFactory("br", createHTMLBRElement);
}
