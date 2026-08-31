import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGMPathElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGMPathElement, "SVGMPathElement");

export function createSVGMPathElement(localName, ownerDocument) {
  const element = Object.create(SVGMPathElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGMPathElementFactory() {
  Object.setPrototypeOf(SVGMPathElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGMPathElement, SVGElement);
  delete SVGMPathElement.prototype.constructor;
  defineGlobalConstructor("SVGMPathElement", SVGMPathElement);
  defineConstructorBacklink(SVGMPathElement.prototype, SVGMPathElement);
  defineToStringTag(SVGMPathElement.prototype, "SVGMPathElement");
  registerSVGElementFactory("mpath", createSVGMPathElement);
}
