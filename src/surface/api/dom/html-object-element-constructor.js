import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { HTMLElement, registerHTMLElementFactory } from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeObjectElement } from "./html-object-element-state.js";

export function HTMLObjectElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLObjectElement, "HTMLObjectElement");

function createHTMLObjectElement(tagName, ownerDocument) {
  const element = Object.create(HTMLObjectElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeObjectElement(element);
  return element;
}

export function installHTMLObjectElementConstructor() {
  Object.setPrototypeOf(HTMLObjectElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLObjectElement, HTMLElement);
  delete HTMLObjectElement.prototype.constructor;
  defineGlobalConstructor("HTMLObjectElement", HTMLObjectElement);
  registerHTMLElementFactory("object", createHTMLObjectElement);
}
