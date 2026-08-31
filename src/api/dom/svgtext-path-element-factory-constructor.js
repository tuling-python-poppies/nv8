import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGTextContentElement } from "./svgtext-content-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGTextPathElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGTextPathElement, "SVGTextPathElement");

export function createSVGTextPathElement(localName, ownerDocument) {
  const element = Object.create(SVGTextPathElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGTextPathElementFactory() {
  Object.setPrototypeOf(SVGTextPathElement.prototype, SVGTextContentElement.prototype);
  Object.setPrototypeOf(SVGTextPathElement, SVGTextContentElement);
  delete SVGTextPathElement.prototype.constructor;
  defineGlobalConstructor("SVGTextPathElement", SVGTextPathElement);
  defineConstructorBacklink(SVGTextPathElement.prototype, SVGTextPathElement);
  defineToStringTag(SVGTextPathElement.prototype, "SVGTextPathElement");
  registerSVGElementFactory("textPath", createSVGTextPathElement);
}
