import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEOffsetElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEOffsetElement, "SVGFEOffsetElement");

export function createSVGFEOffsetElement(localName, ownerDocument) {
  const element = Object.create(SVGFEOffsetElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEOffsetElementFactory() {
  Object.setPrototypeOf(SVGFEOffsetElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEOffsetElement, SVGElement);
  delete SVGFEOffsetElement.prototype.constructor;
  defineGlobalConstructor("SVGFEOffsetElement", SVGFEOffsetElement);
  defineConstructorBacklink(SVGFEOffsetElement.prototype, SVGFEOffsetElement);
  defineToStringTag(SVGFEOffsetElement.prototype, "SVGFEOffsetElement");
  registerSVGElementFactory("feOffset", createSVGFEOffsetElement);
}
