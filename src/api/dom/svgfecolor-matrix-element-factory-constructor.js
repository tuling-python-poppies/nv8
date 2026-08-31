import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEColorMatrixElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEColorMatrixElement, "SVGFEColorMatrixElement");

export function createSVGFEColorMatrixElement(localName, ownerDocument) {
  const element = Object.create(SVGFEColorMatrixElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEColorMatrixElementFactory() {
  Object.setPrototypeOf(SVGFEColorMatrixElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEColorMatrixElement, SVGElement);
  delete SVGFEColorMatrixElement.prototype.constructor;
  defineGlobalConstructor("SVGFEColorMatrixElement", SVGFEColorMatrixElement);
  defineConstructorBacklink(SVGFEColorMatrixElement.prototype, SVGFEColorMatrixElement);
  defineToStringTag(SVGFEColorMatrixElement.prototype, "SVGFEColorMatrixElement");
  registerSVGElementFactory("feColorMatrix", createSVGFEColorMatrixElement);
}
