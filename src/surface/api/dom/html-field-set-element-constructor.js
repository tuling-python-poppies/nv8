import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeFieldSet } from "./html-field-set-element-state.js";

export function HTMLFieldSetElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLFieldSetElement, "HTMLFieldSetElement");

function createHTMLFieldSetElement(tagName, ownerDocument) {
  const element = Object.create(HTMLFieldSetElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeFieldSet(element);
  return element;
}

export function installHTMLFieldSetElementConstructor() {
  Object.setPrototypeOf(HTMLFieldSetElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLFieldSetElement, HTMLElement);
  delete HTMLFieldSetElement.prototype.constructor;
  defineGlobalConstructor("HTMLFieldSetElement", HTMLFieldSetElement);
  registerHTMLElementFactory("fieldset", createHTMLFieldSetElement);
}
