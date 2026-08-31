import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGGraphicsElement } from "./svg-graphics-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGAElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGAElement, "SVGAElement");

export function createSVGAElement(localName, ownerDocument) {
  const element = Object.create(SVGAElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGAElementFactory() {
  Object.setPrototypeOf(SVGAElement.prototype, SVGGraphicsElement.prototype);
  Object.setPrototypeOf(SVGAElement, SVGGraphicsElement);
  delete SVGAElement.prototype.constructor;
  defineGlobalConstructor("SVGAElement", SVGAElement);
  defineConstructorBacklink(SVGAElement.prototype, SVGAElement);
  defineToStringTag(SVGAElement.prototype, "SVGAElement");
  registerSVGElementFactory("a", createSVGAElement);
}
