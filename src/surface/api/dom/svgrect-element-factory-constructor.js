import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGGeometryElement } from "./svg-geometry-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGRectElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGRectElement, "SVGRectElement");

export function createSVGRectElement(localName, ownerDocument) {
  const element = Object.create(SVGRectElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGRectElementFactory() {
  Object.setPrototypeOf(SVGRectElement.prototype, SVGGeometryElement.prototype);
  Object.setPrototypeOf(SVGRectElement, SVGGeometryElement);
  delete SVGRectElement.prototype.constructor;
  defineGlobalConstructor("SVGRectElement", SVGRectElement);
  defineConstructorBacklink(SVGRectElement.prototype, SVGRectElement);
  defineToStringTag(SVGRectElement.prototype, "SVGRectElement");
  registerSVGElementFactory("rect", createSVGRectElement);
}
