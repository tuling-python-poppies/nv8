import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGGeometryElement } from "./svg-geometry-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGEllipseElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGEllipseElement, "SVGEllipseElement");

export function createSVGEllipseElement(localName, ownerDocument) {
  const element = Object.create(SVGEllipseElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGEllipseElementFactory() {
  Object.setPrototypeOf(SVGEllipseElement.prototype, SVGGeometryElement.prototype);
  Object.setPrototypeOf(SVGEllipseElement, SVGGeometryElement);
  delete SVGEllipseElement.prototype.constructor;
  defineGlobalConstructor("SVGEllipseElement", SVGEllipseElement);
  defineConstructorBacklink(SVGEllipseElement.prototype, SVGEllipseElement);
  defineToStringTag(SVGEllipseElement.prototype, "SVGEllipseElement");
  registerSVGElementFactory("ellipse", createSVGEllipseElement);
}
