import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGAnimationElement } from "./svganimation-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGAnimateMotionElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGAnimateMotionElement, "SVGAnimateMotionElement");

export function createSVGAnimateMotionElement(localName, ownerDocument) {
  const element = Object.create(SVGAnimateMotionElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGAnimateMotionElementFactory() {
  Object.setPrototypeOf(SVGAnimateMotionElement.prototype, SVGAnimationElement.prototype);
  Object.setPrototypeOf(SVGAnimateMotionElement, SVGAnimationElement);
  delete SVGAnimateMotionElement.prototype.constructor;
  defineGlobalConstructor("SVGAnimateMotionElement", SVGAnimateMotionElement);
  defineConstructorBacklink(SVGAnimateMotionElement.prototype, SVGAnimateMotionElement);
  defineToStringTag(SVGAnimateMotionElement.prototype, "SVGAnimateMotionElement");
  registerSVGElementFactory("animateMotion", createSVGAnimateMotionElement);
}
