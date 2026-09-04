import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLDataListElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLDataListElement, "HTMLDataListElement");

function createHTMLDataListElement(tagName, ownerDocument) {
  const element = Object.create(HTMLDataListElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLDataListElementConstructor() {
  Object.setPrototypeOf(HTMLDataListElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLDataListElement, HTMLElement);
  delete HTMLDataListElement.prototype.constructor;
  defineGlobalConstructor("HTMLDataListElement", HTMLDataListElement);
  registerHTMLElementFactory("datalist", createHTMLDataListElement);
}
