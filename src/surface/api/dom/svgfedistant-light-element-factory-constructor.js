import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEDistantLightElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEDistantLightElement, "SVGFEDistantLightElement");

export function createSVGFEDistantLightElement(localName, ownerDocument) {
  const element = Object.create(SVGFEDistantLightElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEDistantLightElementFactory() {
  Object.setPrototypeOf(SVGFEDistantLightElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEDistantLightElement, SVGElement);
  delete SVGFEDistantLightElement.prototype.constructor;
  defineGlobalConstructor("SVGFEDistantLightElement", SVGFEDistantLightElement);
  defineConstructorBacklink(SVGFEDistantLightElement.prototype, SVGFEDistantLightElement);
  defineToStringTag(SVGFEDistantLightElement.prototype, "SVGFEDistantLightElement");
  registerSVGElementFactory("feDistantLight", createSVGFEDistantLightElement);
}
