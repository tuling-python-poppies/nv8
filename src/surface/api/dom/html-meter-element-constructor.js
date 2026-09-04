import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLMeterElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLMeterElement, "HTMLMeterElement");

function createHTMLMeterElement(tagName, ownerDocument) {
  const element = Object.create(HTMLMeterElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLMeterElementConstructor() {
  Object.setPrototypeOf(HTMLMeterElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLMeterElement, HTMLElement);
  delete HTMLMeterElement.prototype.constructor;
  defineGlobalConstructor("HTMLMeterElement", HTMLMeterElement);
  registerHTMLElementFactory("meter", createHTMLMeterElement);
}
