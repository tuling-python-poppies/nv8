import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLDetailsElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLDetailsElement, "HTMLDetailsElement");

function createHTMLDetailsElement(tagName, ownerDocument) {
  const element = Object.create(HTMLDetailsElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLDetailsElementConstructor() {
  Object.setPrototypeOf(HTMLDetailsElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLDetailsElement, HTMLElement);
  delete HTMLDetailsElement.prototype.constructor;
  defineGlobalConstructor("HTMLDetailsElement", HTMLDetailsElement);
  registerHTMLElementFactory("details", createHTMLDetailsElement);
}
