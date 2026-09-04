import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGGradientElement } from "./svggradient-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGLinearGradientElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGLinearGradientElement, "SVGLinearGradientElement");

export function createSVGLinearGradientElement(localName, ownerDocument) {
  const element = Object.create(SVGLinearGradientElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGLinearGradientElementFactory() {
  Object.setPrototypeOf(SVGLinearGradientElement.prototype, SVGGradientElement.prototype);
  Object.setPrototypeOf(SVGLinearGradientElement, SVGGradientElement);
  delete SVGLinearGradientElement.prototype.constructor;
  defineGlobalConstructor("SVGLinearGradientElement", SVGLinearGradientElement);
  defineConstructorBacklink(SVGLinearGradientElement.prototype, SVGLinearGradientElement);
  defineToStringTag(SVGLinearGradientElement.prototype, "SVGLinearGradientElement");
  registerSVGElementFactory("linearGradient", createSVGLinearGradientElement);
}
