import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeSelect } from "./html-select-element-state.js";

export function HTMLSelectElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLSelectElement, "HTMLSelectElement");

function createHTMLSelectElement(tagName, ownerDocument) {
  const element = Object.create(HTMLSelectElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeSelect(element);
  return element;
}

export function installHTMLSelectElementConstructor() {
  Object.setPrototypeOf(HTMLSelectElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLSelectElement, HTMLElement);
  delete HTMLSelectElement.prototype.constructor;
  defineGlobalConstructor("HTMLSelectElement", HTMLSelectElement);
  registerHTMLElementFactory("select", createHTMLSelectElement);
}
