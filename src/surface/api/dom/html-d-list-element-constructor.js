import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLDListElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLDListElement, "HTMLDListElement");

function createHTMLDListElement(tagName, ownerDocument) {
  const element = Object.create(HTMLDListElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLDListElementConstructor() {
  Object.setPrototypeOf(HTMLDListElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLDListElement, HTMLElement);
  delete HTMLDListElement.prototype.constructor;
  defineGlobalConstructor("HTMLDListElement", HTMLDListElement);
  registerHTMLElementFactory("dl", createHTMLDListElement);
}
