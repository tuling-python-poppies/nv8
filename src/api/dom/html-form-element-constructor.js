import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeForm } from "./html-form-element-state.js";

export function HTMLFormElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLFormElement, "HTMLFormElement");

function createHTMLFormElement(tagName, ownerDocument) {
  const element = Object.create(HTMLFormElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeForm(element);
  return element;
}

export function installHTMLFormElementConstructor() {
  Object.setPrototypeOf(HTMLFormElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLFormElement, HTMLElement);
  delete HTMLFormElement.prototype.constructor;
  defineGlobalConstructor("HTMLFormElement", HTMLFormElement);
  registerHTMLElementFactory("form", createHTMLFormElement);
}
