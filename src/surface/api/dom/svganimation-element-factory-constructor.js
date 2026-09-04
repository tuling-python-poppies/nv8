import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";

export function SVGAnimationElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGAnimationElement, "SVGAnimationElement");

export function installSVGAnimationElementFactory() {
  Object.setPrototypeOf(SVGAnimationElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGAnimationElement, SVGElement);
  delete SVGAnimationElement.prototype.constructor;
  defineGlobalConstructor("SVGAnimationElement", SVGAnimationElement);
  defineConstructorBacklink(SVGAnimationElement.prototype, SVGAnimationElement);
  defineToStringTag(SVGAnimationElement.prototype, "SVGAnimationElement");
}
