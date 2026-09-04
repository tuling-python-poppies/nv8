import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGAnimationElement } from "./svganimation-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGSetElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGSetElement, "SVGSetElement");

export function createSVGSetElement(localName, ownerDocument) {
  const element = Object.create(SVGSetElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGSetElementFactory() {
  Object.setPrototypeOf(SVGSetElement.prototype, SVGAnimationElement.prototype);
  Object.setPrototypeOf(SVGSetElement, SVGAnimationElement);
  delete SVGSetElement.prototype.constructor;
  defineGlobalConstructor("SVGSetElement", SVGSetElement);
  defineConstructorBacklink(SVGSetElement.prototype, SVGSetElement);
  defineToStringTag(SVGSetElement.prototype, "SVGSetElement");
  registerSVGElementFactory("set", createSVGSetElement);
}
