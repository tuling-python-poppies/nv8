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

export function HTMLHeadElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLHeadElement, "HTMLHeadElement");

export function createHTMLHeadElement(tagName, ownerDocument) {
  const element = Object.create(HTMLHeadElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLHeadElementConstructor() {
  Object.setPrototypeOf(HTMLHeadElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLHeadElement, HTMLElement);
  delete HTMLHeadElement.prototype.constructor;
  defineGlobalConstructor("HTMLHeadElement", HTMLHeadElement);
  registerHTMLElementFactory("head", createHTMLHeadElement);
}

export function finishHTMLHeadElementConstructor() {
  defineConstructorBacklink(HTMLHeadElement.prototype, HTMLHeadElement);
  defineToStringTag(HTMLHeadElement.prototype, "HTMLHeadElement");
}
