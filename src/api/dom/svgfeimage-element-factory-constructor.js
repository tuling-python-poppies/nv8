import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEImageElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEImageElement, "SVGFEImageElement");

export function createSVGFEImageElement(localName, ownerDocument) {
  const element = Object.create(SVGFEImageElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEImageElementFactory() {
  Object.setPrototypeOf(SVGFEImageElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEImageElement, SVGElement);
  delete SVGFEImageElement.prototype.constructor;
  defineGlobalConstructor("SVGFEImageElement", SVGFEImageElement);
  defineConstructorBacklink(SVGFEImageElement.prototype, SVGFEImageElement);
  defineToStringTag(SVGFEImageElement.prototype, "SVGFEImageElement");
  registerSVGElementFactory("feImage", createSVGFEImageElement);
}
