import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGGeometryElement } from "./svg-geometry-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGPolylineElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGPolylineElement, "SVGPolylineElement");

export function createSVGPolylineElement(localName, ownerDocument) {
  const element = Object.create(SVGPolylineElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGPolylineElementFactory() {
  Object.setPrototypeOf(SVGPolylineElement.prototype, SVGGeometryElement.prototype);
  Object.setPrototypeOf(SVGPolylineElement, SVGGeometryElement);
  delete SVGPolylineElement.prototype.constructor;
  defineGlobalConstructor("SVGPolylineElement", SVGPolylineElement);
  defineConstructorBacklink(SVGPolylineElement.prototype, SVGPolylineElement);
  defineToStringTag(SVGPolylineElement.prototype, "SVGPolylineElement");
  registerSVGElementFactory("polyline", createSVGPolylineElement);
}
