import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLOptGroupElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLOptGroupElement, "HTMLOptGroupElement");

function createHTMLOptGroupElement(tagName, ownerDocument) {
  const element = Object.create(HTMLOptGroupElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLOptGroupElementConstructor() {
  Object.setPrototypeOf(HTMLOptGroupElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLOptGroupElement, HTMLElement);
  delete HTMLOptGroupElement.prototype.constructor;
  defineGlobalConstructor("HTMLOptGroupElement", HTMLOptGroupElement);
  registerHTMLElementFactory("optgroup", createHTMLOptGroupElement);
}
