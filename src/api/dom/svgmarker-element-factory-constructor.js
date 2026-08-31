import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGMarkerElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGMarkerElement, "SVGMarkerElement");

export function createSVGMarkerElement(localName, ownerDocument) {
  const element = Object.create(SVGMarkerElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGMarkerElementFactory() {
  Object.setPrototypeOf(SVGMarkerElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGMarkerElement, SVGElement);
  delete SVGMarkerElement.prototype.constructor;
  defineGlobalConstructor("SVGMarkerElement", SVGMarkerElement);
  defineConstructorBacklink(SVGMarkerElement.prototype, SVGMarkerElement);
  defineToStringTag(SVGMarkerElement.prototype, "SVGMarkerElement");
  registerSVGElementFactory("marker", createSVGMarkerElement);
}
