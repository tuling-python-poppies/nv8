import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLMapElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLMapElement, "HTMLMapElement");

function createHTMLMapElement(tagName, ownerDocument) {
  const element = Object.create(HTMLMapElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLMapElementConstructor() {
  Object.setPrototypeOf(HTMLMapElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLMapElement, HTMLElement);
  delete HTMLMapElement.prototype.constructor;
  defineGlobalConstructor("HTMLMapElement", HTMLMapElement);
  registerHTMLElementFactory("map", createHTMLMapElement);
}
