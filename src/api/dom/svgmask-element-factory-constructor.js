import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGMaskElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGMaskElement, "SVGMaskElement");

export function createSVGMaskElement(localName, ownerDocument) {
  const element = Object.create(SVGMaskElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGMaskElementFactory() {
  Object.setPrototypeOf(SVGMaskElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGMaskElement, SVGElement);
  delete SVGMaskElement.prototype.constructor;
  defineGlobalConstructor("SVGMaskElement", SVGMaskElement);
  defineConstructorBacklink(SVGMaskElement.prototype, SVGMaskElement);
  defineToStringTag(SVGMaskElement.prototype, "SVGMaskElement");
  registerSVGElementFactory("mask", createSVGMaskElement);
}
