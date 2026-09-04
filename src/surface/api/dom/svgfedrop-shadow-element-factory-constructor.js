import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEDropShadowElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEDropShadowElement, "SVGFEDropShadowElement");

export function createSVGFEDropShadowElement(localName, ownerDocument) {
  const element = Object.create(SVGFEDropShadowElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEDropShadowElementFactory() {
  Object.setPrototypeOf(SVGFEDropShadowElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEDropShadowElement, SVGElement);
  delete SVGFEDropShadowElement.prototype.constructor;
  defineGlobalConstructor("SVGFEDropShadowElement", SVGFEDropShadowElement);
  defineConstructorBacklink(SVGFEDropShadowElement.prototype, SVGFEDropShadowElement);
  defineToStringTag(SVGFEDropShadowElement.prototype, "SVGFEDropShadowElement");
  registerSVGElementFactory("feDropShadow", createSVGFEDropShadowElement);
}
