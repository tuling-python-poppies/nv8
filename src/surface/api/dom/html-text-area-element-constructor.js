import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeTextArea } from "./html-text-area-element-state.js";

export function HTMLTextAreaElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLTextAreaElement, "HTMLTextAreaElement");

function createHTMLTextAreaElement(tagName, ownerDocument) {
  const element = Object.create(HTMLTextAreaElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeTextArea(element);
  return element;
}

export function installHTMLTextAreaElementConstructor() {
  Object.setPrototypeOf(HTMLTextAreaElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLTextAreaElement, HTMLElement);
  delete HTMLTextAreaElement.prototype.constructor;
  defineGlobalConstructor("HTMLTextAreaElement", HTMLTextAreaElement);
  registerHTMLElementFactory("textarea", createHTMLTextAreaElement);
}
