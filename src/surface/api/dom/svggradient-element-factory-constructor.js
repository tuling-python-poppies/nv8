import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";

export function SVGGradientElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGGradientElement, "SVGGradientElement");

export function installSVGGradientElementFactory() {
  Object.setPrototypeOf(SVGGradientElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGGradientElement, SVGElement);
  delete SVGGradientElement.prototype.constructor;
  defineGlobalConstructor("SVGGradientElement", SVGGradientElement);
  defineConstructorBacklink(SVGGradientElement.prototype, SVGGradientElement);
  defineToStringTag(SVGGradientElement.prototype, "SVGGradientElement");
}
