import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLTitleElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLTitleElement, "HTMLTitleElement");

function createHTMLTitleElement(tagName, ownerDocument) {
  const element = Object.create(HTMLTitleElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLTitleElementConstructor() {
  Object.setPrototypeOf(HTMLTitleElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLTitleElement, HTMLElement);
  delete HTMLTitleElement.prototype.constructor;
  defineGlobalConstructor("HTMLTitleElement", HTMLTitleElement);
  registerHTMLElementFactory("title", createHTMLTitleElement);
}
