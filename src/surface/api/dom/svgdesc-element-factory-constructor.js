import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGDescElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGDescElement, "SVGDescElement");

export function createSVGDescElement(localName, ownerDocument) {
  const element = Object.create(SVGDescElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGDescElementFactory() {
  Object.setPrototypeOf(SVGDescElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGDescElement, SVGElement);
  delete SVGDescElement.prototype.constructor;
  defineGlobalConstructor("SVGDescElement", SVGDescElement);
  defineConstructorBacklink(SVGDescElement.prototype, SVGDescElement);
  defineToStringTag(SVGDescElement.prototype, "SVGDescElement");
  registerSVGElementFactory("desc", createSVGDescElement);
}
