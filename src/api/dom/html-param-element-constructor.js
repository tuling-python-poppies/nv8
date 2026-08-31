import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLParamElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLParamElement, "HTMLParamElement");

function createHTMLParamElement(tagName, ownerDocument) {
  const element = Object.create(HTMLParamElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLParamElementConstructor() {
  Object.setPrototypeOf(HTMLParamElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLParamElement, HTMLElement);
  delete HTMLParamElement.prototype.constructor;
  defineGlobalConstructor("HTMLParamElement", HTMLParamElement);
  registerHTMLElementFactory("param", createHTMLParamElement);
}
