import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGTextContentElement } from "./svgtext-content-element-factory-constructor.js";

export function SVGTextPositioningElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGTextPositioningElement, "SVGTextPositioningElement");

export function installSVGTextPositioningElementFactory() {
  Object.setPrototypeOf(SVGTextPositioningElement.prototype, SVGTextContentElement.prototype);
  Object.setPrototypeOf(SVGTextPositioningElement, SVGTextContentElement);
  delete SVGTextPositioningElement.prototype.constructor;
  defineGlobalConstructor("SVGTextPositioningElement", SVGTextPositioningElement);
  defineConstructorBacklink(SVGTextPositioningElement.prototype, SVGTextPositioningElement);
  defineToStringTag(SVGTextPositioningElement.prototype, "SVGTextPositioningElement");
}
