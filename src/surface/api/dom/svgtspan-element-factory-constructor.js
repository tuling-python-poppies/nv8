import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGTextPositioningElement } from "./svgtext-positioning-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGTSpanElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGTSpanElement, "SVGTSpanElement");

function createSVGTSpanElement(localName, ownerDocument) {
  const element = Object.create(SVGTSpanElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGTSpanElementFactory() {
  Object.setPrototypeOf(SVGTSpanElement.prototype, SVGTextPositioningElement.prototype);
  Object.setPrototypeOf(SVGTSpanElement, SVGTextPositioningElement);
  delete SVGTSpanElement.prototype.constructor;
  defineGlobalConstructor("SVGTSpanElement", SVGTSpanElement);
  defineConstructorBacklink(SVGTSpanElement.prototype, SVGTSpanElement);
  defineToStringTag(SVGTSpanElement.prototype, "SVGTSpanElement");
  registerSVGElementFactory("tspan", createSVGTSpanElement);
}
