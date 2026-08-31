import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGAnimationElement } from "./svganimation-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGAnimateTransformElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGAnimateTransformElement, "SVGAnimateTransformElement");

export function createSVGAnimateTransformElement(localName, ownerDocument) {
  const element = Object.create(SVGAnimateTransformElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGAnimateTransformElementFactory() {
  Object.setPrototypeOf(SVGAnimateTransformElement.prototype, SVGAnimationElement.prototype);
  Object.setPrototypeOf(SVGAnimateTransformElement, SVGAnimationElement);
  delete SVGAnimateTransformElement.prototype.constructor;
  defineGlobalConstructor("SVGAnimateTransformElement", SVGAnimateTransformElement);
  defineConstructorBacklink(SVGAnimateTransformElement.prototype, SVGAnimateTransformElement);
  defineToStringTag(SVGAnimateTransformElement.prototype, "SVGAnimateTransformElement");
  registerSVGElementFactory("animateTransform", createSVGAnimateTransformElement);
}
