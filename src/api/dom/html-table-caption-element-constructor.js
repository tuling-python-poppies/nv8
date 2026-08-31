import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLTableCaptionElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLTableCaptionElement, "HTMLTableCaptionElement");

function createHTMLTableCaptionElement(tagName, ownerDocument) {
  const element = Object.create(HTMLTableCaptionElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLTableCaptionElementConstructor() {
  Object.setPrototypeOf(
    HTMLTableCaptionElement.prototype,
    HTMLElement.prototype,
  );
  Object.setPrototypeOf(HTMLTableCaptionElement, HTMLElement);
  delete HTMLTableCaptionElement.prototype.constructor;
  defineGlobalConstructor(
    "HTMLTableCaptionElement",
    HTMLTableCaptionElement,
  );
  registerHTMLElementFactory("caption", createHTMLTableCaptionElement);
}
