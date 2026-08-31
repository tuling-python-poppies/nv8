import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEGaussianBlurElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEGaussianBlurElement, "SVGFEGaussianBlurElement");

export function createSVGFEGaussianBlurElement(localName, ownerDocument) {
  const element = Object.create(SVGFEGaussianBlurElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEGaussianBlurElementFactory() {
  Object.setPrototypeOf(SVGFEGaussianBlurElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEGaussianBlurElement, SVGElement);
  delete SVGFEGaussianBlurElement.prototype.constructor;
  defineGlobalConstructor("SVGFEGaussianBlurElement", SVGFEGaussianBlurElement);
  defineConstructorBacklink(SVGFEGaussianBlurElement.prototype, SVGFEGaussianBlurElement);
  defineToStringTag(SVGFEGaussianBlurElement.prototype, "SVGFEGaussianBlurElement");
  registerSVGElementFactory("feGaussianBlur", createSVGFEGaussianBlurElement);
}
