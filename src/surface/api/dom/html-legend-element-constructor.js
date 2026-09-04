import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLLegendElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLLegendElement, "HTMLLegendElement");

function createHTMLLegendElement(tagName, ownerDocument) {
  const element = Object.create(HTMLLegendElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLLegendElementConstructor() {
  Object.setPrototypeOf(HTMLLegendElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLLegendElement, HTMLElement);
  delete HTMLLegendElement.prototype.constructor;
  defineGlobalConstructor("HTMLLegendElement", HTMLLegendElement);
  registerHTMLElementFactory("legend", createHTMLLegendElement);
}
