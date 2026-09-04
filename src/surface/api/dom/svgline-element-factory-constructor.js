import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGGeometryElement } from "./svg-geometry-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGLineElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGLineElement, "SVGLineElement");

export function createSVGLineElement(localName, ownerDocument) {
  const element = Object.create(SVGLineElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGLineElementFactory() {
  Object.setPrototypeOf(SVGLineElement.prototype, SVGGeometryElement.prototype);
  Object.setPrototypeOf(SVGLineElement, SVGGeometryElement);
  delete SVGLineElement.prototype.constructor;
  defineGlobalConstructor("SVGLineElement", SVGLineElement);
  defineConstructorBacklink(SVGLineElement.prototype, SVGLineElement);
  defineToStringTag(SVGLineElement.prototype, "SVGLineElement");
  registerSVGElementFactory("line", createSVGLineElement);
}
