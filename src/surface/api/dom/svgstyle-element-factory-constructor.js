import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGStyleElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGStyleElement, "SVGStyleElement");

function createSVGStyleElement(localName, ownerDocument) {
  const element = Object.create(SVGStyleElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGStyleElementFactory() {
  Object.setPrototypeOf(SVGStyleElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGStyleElement, SVGElement);
  delete SVGStyleElement.prototype.constructor;
  defineGlobalConstructor("SVGStyleElement", SVGStyleElement);
  defineConstructorBacklink(SVGStyleElement.prototype, SVGStyleElement);
  defineToStringTag(SVGStyleElement.prototype, "SVGStyleElement");
  registerSVGElementFactory("style", createSVGStyleElement);
}
