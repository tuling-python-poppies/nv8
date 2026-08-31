import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEBlendElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEBlendElement, "SVGFEBlendElement");

export function createSVGFEBlendElement(localName, ownerDocument) {
  const element = Object.create(SVGFEBlendElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEBlendElementFactory() {
  Object.setPrototypeOf(SVGFEBlendElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEBlendElement, SVGElement);
  delete SVGFEBlendElement.prototype.constructor;
  defineGlobalConstructor("SVGFEBlendElement", SVGFEBlendElement);
  defineConstructorBacklink(SVGFEBlendElement.prototype, SVGFEBlendElement);
  defineToStringTag(SVGFEBlendElement.prototype, "SVGFEBlendElement");
  registerSVGElementFactory("feBlend", createSVGFEBlendElement);
}
