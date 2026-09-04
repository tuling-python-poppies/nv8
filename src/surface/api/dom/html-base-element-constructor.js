import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLBaseElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLBaseElement, "HTMLBaseElement");

function createHTMLBaseElement(tagName, ownerDocument) {
  const element = Object.create(HTMLBaseElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLBaseElementConstructor() {
  Object.setPrototypeOf(HTMLBaseElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLBaseElement, HTMLElement);
  delete HTMLBaseElement.prototype.constructor;
  defineGlobalConstructor("HTMLBaseElement", HTMLBaseElement);
  registerHTMLElementFactory("base", createHTMLBaseElement);
}
