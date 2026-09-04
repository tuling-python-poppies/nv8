import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLFontElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLFontElement, "HTMLFontElement");

function createHTMLFontElement(tagName, ownerDocument) {
  const element = Object.create(HTMLFontElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLFontElementConstructor() {
  Object.setPrototypeOf(HTMLFontElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLFontElement, HTMLElement);
  delete HTMLFontElement.prototype.constructor;
  defineGlobalConstructor("HTMLFontElement", HTMLFontElement);
  registerHTMLElementFactory("font", createHTMLFontElement);
}
