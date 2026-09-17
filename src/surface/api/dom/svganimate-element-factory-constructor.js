import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGAnimationElement } from "./svganimation-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGAnimateElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGAnimateElement, "SVGAnimateElement");

function createSVGAnimateElement(localName, ownerDocument) {
  const element = Object.create(SVGAnimateElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGAnimateElementFactory() {
  Object.setPrototypeOf(SVGAnimateElement.prototype, SVGAnimationElement.prototype);
  Object.setPrototypeOf(SVGAnimateElement, SVGAnimationElement);
  delete SVGAnimateElement.prototype.constructor;
  defineGlobalConstructor("SVGAnimateElement", SVGAnimateElement);
  defineConstructorBacklink(SVGAnimateElement.prototype, SVGAnimateElement);
  defineToStringTag(SVGAnimateElement.prototype, "SVGAnimateElement");
  registerSVGElementFactory("animate", createSVGAnimateElement);
}
