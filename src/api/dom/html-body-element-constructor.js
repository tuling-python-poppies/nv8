import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLBodyElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLBodyElement, "HTMLBodyElement");

export function createHTMLBodyElement(tagName, ownerDocument) {
  const element = Object.create(HTMLBodyElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLBodyElementConstructor() {
  Object.setPrototypeOf(HTMLBodyElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLBodyElement, HTMLElement);
  delete HTMLBodyElement.prototype.constructor;
  defineGlobalConstructor("HTMLBodyElement", HTMLBodyElement);
  registerHTMLElementFactory("body", createHTMLBodyElement);
}

export function finishHTMLBodyElementConstructor() {
  defineConstructorBacklink(HTMLBodyElement.prototype, HTMLBodyElement);
  defineToStringTag(HTMLBodyElement.prototype, "HTMLBodyElement");
}
