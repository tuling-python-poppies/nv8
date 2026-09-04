import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGGraphicsElement } from "./svg-graphics-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGGElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGGElement, "SVGGElement");

export function createSVGGElement(localName, ownerDocument) {
  const element = Object.create(SVGGElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGGElementFactory() {
  Object.setPrototypeOf(SVGGElement.prototype, SVGGraphicsElement.prototype);
  Object.setPrototypeOf(SVGGElement, SVGGraphicsElement);
  delete SVGGElement.prototype.constructor;
  defineGlobalConstructor("SVGGElement", SVGGElement);
  defineConstructorBacklink(SVGGElement.prototype, SVGGElement);
  defineToStringTag(SVGGElement.prototype, "SVGGElement");
  registerSVGElementFactory("g", createSVGGElement);
}
