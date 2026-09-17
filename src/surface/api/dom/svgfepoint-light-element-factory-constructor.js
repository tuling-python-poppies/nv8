import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEPointLightElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEPointLightElement, "SVGFEPointLightElement");

function createSVGFEPointLightElement(localName, ownerDocument) {
  const element = Object.create(SVGFEPointLightElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEPointLightElementFactory() {
  Object.setPrototypeOf(SVGFEPointLightElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEPointLightElement, SVGElement);
  delete SVGFEPointLightElement.prototype.constructor;
  defineGlobalConstructor("SVGFEPointLightElement", SVGFEPointLightElement);
  defineConstructorBacklink(SVGFEPointLightElement.prototype, SVGFEPointLightElement);
  defineToStringTag(SVGFEPointLightElement.prototype, "SVGFEPointLightElement");
  registerSVGElementFactory("fePointLight", createSVGFEPointLightElement);
}
