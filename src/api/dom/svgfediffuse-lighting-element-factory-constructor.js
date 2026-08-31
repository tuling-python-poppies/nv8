import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEDiffuseLightingElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEDiffuseLightingElement, "SVGFEDiffuseLightingElement");

export function createSVGFEDiffuseLightingElement(localName, ownerDocument) {
  const element = Object.create(SVGFEDiffuseLightingElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEDiffuseLightingElementFactory() {
  Object.setPrototypeOf(SVGFEDiffuseLightingElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEDiffuseLightingElement, SVGElement);
  delete SVGFEDiffuseLightingElement.prototype.constructor;
  defineGlobalConstructor("SVGFEDiffuseLightingElement", SVGFEDiffuseLightingElement);
  defineConstructorBacklink(SVGFEDiffuseLightingElement.prototype, SVGFEDiffuseLightingElement);
  defineToStringTag(SVGFEDiffuseLightingElement.prototype, "SVGFEDiffuseLightingElement");
  registerSVGElementFactory("feDiffuseLighting", createSVGFEDiffuseLightingElement);
}
