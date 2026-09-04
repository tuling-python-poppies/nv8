import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGGraphicsElement } from "./svg-graphics-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGForeignObjectElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGForeignObjectElement, "SVGForeignObjectElement");

export function createSVGForeignObjectElement(localName, ownerDocument) {
  const element = Object.create(SVGForeignObjectElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGForeignObjectElementFactory() {
  Object.setPrototypeOf(SVGForeignObjectElement.prototype, SVGGraphicsElement.prototype);
  Object.setPrototypeOf(SVGForeignObjectElement, SVGGraphicsElement);
  delete SVGForeignObjectElement.prototype.constructor;
  defineGlobalConstructor("SVGForeignObjectElement", SVGForeignObjectElement);
  defineConstructorBacklink(SVGForeignObjectElement.prototype, SVGForeignObjectElement);
  defineToStringTag(SVGForeignObjectElement.prototype, "SVGForeignObjectElement");
  registerSVGElementFactory("foreignObject", createSVGForeignObjectElement);
}
