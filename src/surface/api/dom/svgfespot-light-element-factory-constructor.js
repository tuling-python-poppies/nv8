import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFESpotLightElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFESpotLightElement, "SVGFESpotLightElement");

export function createSVGFESpotLightElement(localName, ownerDocument) {
  const element = Object.create(SVGFESpotLightElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFESpotLightElementFactory() {
  Object.setPrototypeOf(SVGFESpotLightElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFESpotLightElement, SVGElement);
  delete SVGFESpotLightElement.prototype.constructor;
  defineGlobalConstructor("SVGFESpotLightElement", SVGFESpotLightElement);
  defineConstructorBacklink(SVGFESpotLightElement.prototype, SVGFESpotLightElement);
  defineToStringTag(SVGFESpotLightElement.prototype, "SVGFESpotLightElement");
  registerSVGElementFactory("feSpotLight", createSVGFESpotLightElement);
}
