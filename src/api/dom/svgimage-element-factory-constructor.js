import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGGraphicsElement } from "./svg-graphics-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGImageElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGImageElement, "SVGImageElement");

export function createSVGImageElement(localName, ownerDocument) {
  const element = Object.create(SVGImageElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGImageElementFactory() {
  Object.setPrototypeOf(SVGImageElement.prototype, SVGGraphicsElement.prototype);
  Object.setPrototypeOf(SVGImageElement, SVGGraphicsElement);
  delete SVGImageElement.prototype.constructor;
  defineGlobalConstructor("SVGImageElement", SVGImageElement);
  defineConstructorBacklink(SVGImageElement.prototype, SVGImageElement);
  defineToStringTag(SVGImageElement.prototype, "SVGImageElement");
  registerSVGElementFactory("image", createSVGImageElement);
}
