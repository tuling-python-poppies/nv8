import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLHRElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLHRElement, "HTMLHRElement");

function createHTMLHRElement(tagName, ownerDocument) {
  const element = Object.create(HTMLHRElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLHRElementConstructor() {
  Object.setPrototypeOf(HTMLHRElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLHRElement, HTMLElement);
  delete HTMLHRElement.prototype.constructor;
  defineGlobalConstructor("HTMLHRElement", HTMLHRElement);
  registerHTMLElementFactory("hr", createHTMLHRElement);
}
