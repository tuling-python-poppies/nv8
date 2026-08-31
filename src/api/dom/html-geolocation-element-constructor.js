import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { HTMLElement, registerHTMLElementFactory } from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeGeolocationElement } from "./html-geolocation-element-state.js";

export function HTMLGeolocationElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLGeolocationElement, "HTMLGeolocationElement");

function createHTMLGeolocationElement(tagName, ownerDocument) {
  const element = Object.create(HTMLGeolocationElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeGeolocationElement(element);
  return element;
}

export function installHTMLGeolocationElementConstructor() {
  Object.setPrototypeOf(HTMLGeolocationElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLGeolocationElement, HTMLElement);
  delete HTMLGeolocationElement.prototype.constructor;
  defineGlobalConstructor("HTMLGeolocationElement", HTMLGeolocationElement);
  registerHTMLElementFactory("geolocation", createHTMLGeolocationElement);
}
