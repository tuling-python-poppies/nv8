import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEDisplacementMapElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEDisplacementMapElement, "SVGFEDisplacementMapElement");

export function createSVGFEDisplacementMapElement(localName, ownerDocument) {
  const element = Object.create(SVGFEDisplacementMapElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEDisplacementMapElementFactory() {
  Object.setPrototypeOf(SVGFEDisplacementMapElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEDisplacementMapElement, SVGElement);
  delete SVGFEDisplacementMapElement.prototype.constructor;
  defineGlobalConstructor("SVGFEDisplacementMapElement", SVGFEDisplacementMapElement);
  defineConstructorBacklink(SVGFEDisplacementMapElement.prototype, SVGFEDisplacementMapElement);
  defineToStringTag(SVGFEDisplacementMapElement.prototype, "SVGFEDisplacementMapElement");
  registerSVGElementFactory("feDisplacementMap", createSVGFEDisplacementMapElement);
}
