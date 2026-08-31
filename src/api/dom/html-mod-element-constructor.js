import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLModElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLModElement, "HTMLModElement");

function createHTMLModElement(tagName, ownerDocument) {
  const element = Object.create(HTMLModElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLModElementConstructor() {
  Object.setPrototypeOf(HTMLModElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLModElement, HTMLElement);
  delete HTMLModElement.prototype.constructor;
  defineGlobalConstructor("HTMLModElement", HTMLModElement);
  registerHTMLElementFactory("del", createHTMLModElement);
  registerHTMLElementFactory("ins", createHTMLModElement);
}
