import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLQuoteElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLQuoteElement, "HTMLQuoteElement");

function createHTMLQuoteElement(tagName, ownerDocument) {
  const element = Object.create(HTMLQuoteElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLQuoteElementConstructor() {
  Object.setPrototypeOf(HTMLQuoteElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLQuoteElement, HTMLElement);
  delete HTMLQuoteElement.prototype.constructor;
  defineGlobalConstructor("HTMLQuoteElement", HTMLQuoteElement);
  registerHTMLElementFactory("blockquote", createHTMLQuoteElement);
  registerHTMLElementFactory("q", createHTMLQuoteElement);
}
