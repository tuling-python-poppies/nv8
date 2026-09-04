import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLMetaElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLMetaElement, "HTMLMetaElement");

function createHTMLMetaElement(tagName, ownerDocument) {
  const element = Object.create(HTMLMetaElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLMetaElementConstructor() {
  Object.setPrototypeOf(HTMLMetaElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLMetaElement, HTMLElement);
  delete HTMLMetaElement.prototype.constructor;
  defineGlobalConstructor("HTMLMetaElement", HTMLMetaElement);
  registerHTMLElementFactory("meta", createHTMLMetaElement);
}
