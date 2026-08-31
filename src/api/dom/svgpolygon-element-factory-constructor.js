import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGGeometryElement } from "./svg-geometry-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGPolygonElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGPolygonElement, "SVGPolygonElement");

export function createSVGPolygonElement(localName, ownerDocument) {
  const element = Object.create(SVGPolygonElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGPolygonElementFactory() {
  Object.setPrototypeOf(SVGPolygonElement.prototype, SVGGeometryElement.prototype);
  Object.setPrototypeOf(SVGPolygonElement, SVGGeometryElement);
  delete SVGPolygonElement.prototype.constructor;
  defineGlobalConstructor("SVGPolygonElement", SVGPolygonElement);
  defineConstructorBacklink(SVGPolygonElement.prototype, SVGPolygonElement);
  defineToStringTag(SVGPolygonElement.prototype, "SVGPolygonElement");
  registerSVGElementFactory("polygon", createSVGPolygonElement);
}
