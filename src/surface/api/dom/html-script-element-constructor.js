import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLScriptElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLScriptElement, "HTMLScriptElement");

export function createHTMLScriptElement(tagName, ownerDocument) {
  const element = Object.create(HTMLScriptElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLScriptElementConstructor() {
  Object.setPrototypeOf(HTMLScriptElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLScriptElement, HTMLElement);
  delete HTMLScriptElement.prototype.constructor;
  defineGlobalConstructor("HTMLScriptElement", HTMLScriptElement);
  registerHTMLElementFactory("script", createHTMLScriptElement);
}
