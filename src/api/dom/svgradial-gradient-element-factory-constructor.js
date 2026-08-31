import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGGradientElement } from "./svggradient-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGRadialGradientElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGRadialGradientElement, "SVGRadialGradientElement");

export function createSVGRadialGradientElement(localName, ownerDocument) {
  const element = Object.create(SVGRadialGradientElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGRadialGradientElementFactory() {
  Object.setPrototypeOf(SVGRadialGradientElement.prototype, SVGGradientElement.prototype);
  Object.setPrototypeOf(SVGRadialGradientElement, SVGGradientElement);
  delete SVGRadialGradientElement.prototype.constructor;
  defineGlobalConstructor("SVGRadialGradientElement", SVGRadialGradientElement);
  defineConstructorBacklink(SVGRadialGradientElement.prototype, SVGRadialGradientElement);
  defineToStringTag(SVGRadialGradientElement.prototype, "SVGRadialGradientElement");
  registerSVGElementFactory("radialGradient", createSVGRadialGradientElement);
}
