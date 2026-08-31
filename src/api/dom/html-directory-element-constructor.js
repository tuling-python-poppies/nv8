import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLDirectoryElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLDirectoryElement, "HTMLDirectoryElement");

function createHTMLDirectoryElement(tagName, ownerDocument) {
  const element = Object.create(HTMLDirectoryElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLDirectoryElementConstructor() {
  Object.setPrototypeOf(HTMLDirectoryElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLDirectoryElement, HTMLElement);
  delete HTMLDirectoryElement.prototype.constructor;
  defineGlobalConstructor("HTMLDirectoryElement", HTMLDirectoryElement);
  registerHTMLElementFactory("dir", createHTMLDirectoryElement);
}
