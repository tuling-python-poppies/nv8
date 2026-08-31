import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGGraphicsElement } from "./svg-graphics-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGUseElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGUseElement, "SVGUseElement");

export function createSVGUseElement(localName, ownerDocument) {
  const element = Object.create(SVGUseElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGUseElementFactory() {
  Object.setPrototypeOf(SVGUseElement.prototype, SVGGraphicsElement.prototype);
  Object.setPrototypeOf(SVGUseElement, SVGGraphicsElement);
  delete SVGUseElement.prototype.constructor;
  defineGlobalConstructor("SVGUseElement", SVGUseElement);
  defineConstructorBacklink(SVGUseElement.prototype, SVGUseElement);
  defineToStringTag(SVGUseElement.prototype, "SVGUseElement");
  registerSVGElementFactory("use", createSVGUseElement);
}
