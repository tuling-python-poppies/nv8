import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFECompositeElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFECompositeElement, "SVGFECompositeElement");

export function createSVGFECompositeElement(localName, ownerDocument) {
  const element = Object.create(SVGFECompositeElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFECompositeElementFactory() {
  Object.setPrototypeOf(SVGFECompositeElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFECompositeElement, SVGElement);
  delete SVGFECompositeElement.prototype.constructor;
  defineGlobalConstructor("SVGFECompositeElement", SVGFECompositeElement);
  defineConstructorBacklink(SVGFECompositeElement.prototype, SVGFECompositeElement);
  defineToStringTag(SVGFECompositeElement.prototype, "SVGFECompositeElement");
  registerSVGElementFactory("feComposite", createSVGFECompositeElement);
}
