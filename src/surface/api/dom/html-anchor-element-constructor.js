import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLAnchorElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLAnchorElement, "HTMLAnchorElement");

function createHTMLAnchorElement(tagName, ownerDocument) {
  const element = Object.create(HTMLAnchorElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLAnchorElementConstructor() {
  Object.setPrototypeOf(
    HTMLAnchorElement.prototype,
    HTMLElement.prototype,
  );
  Object.setPrototypeOf(HTMLAnchorElement, HTMLElement);
  delete HTMLAnchorElement.prototype.constructor;
  defineGlobalConstructor("HTMLAnchorElement", HTMLAnchorElement);
  registerHTMLElementFactory("a", createHTMLAnchorElement);
}
