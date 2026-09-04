import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGGraphicsElement } from "./svg-graphics-element-constructor.js";

export function SVGTextContentElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGTextContentElement, "SVGTextContentElement");

export function installSVGTextContentElementFactory() {
  Object.setPrototypeOf(SVGTextContentElement.prototype, SVGGraphicsElement.prototype);
  Object.setPrototypeOf(SVGTextContentElement, SVGGraphicsElement);
  delete SVGTextContentElement.prototype.constructor;
  defineGlobalConstructor("SVGTextContentElement", SVGTextContentElement);
  defineConstructorBacklink(SVGTextContentElement.prototype, SVGTextContentElement);
  defineToStringTag(SVGTextContentElement.prototype, "SVGTextContentElement");
}
