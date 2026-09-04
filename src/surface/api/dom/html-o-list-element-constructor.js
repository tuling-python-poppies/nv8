import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLOListElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLOListElement, "HTMLOListElement");

function createHTMLOListElement(tagName, ownerDocument) {
  const element = Object.create(HTMLOListElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLOListElementConstructor() {
  Object.setPrototypeOf(HTMLOListElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLOListElement, HTMLElement);
  delete HTMLOListElement.prototype.constructor;
  defineGlobalConstructor("HTMLOListElement", HTMLOListElement);
  registerHTMLElementFactory("ol", createHTMLOListElement);
}
