import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLProgressElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLProgressElement, "HTMLProgressElement");

function createHTMLProgressElement(tagName, ownerDocument) {
  const element = Object.create(HTMLProgressElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLProgressElementConstructor() {
  Object.setPrototypeOf(HTMLProgressElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLProgressElement, HTMLElement);
  delete HTMLProgressElement.prototype.constructor;
  defineGlobalConstructor("HTMLProgressElement", HTMLProgressElement);
  registerHTMLElementFactory("progress", createHTMLProgressElement);
}
