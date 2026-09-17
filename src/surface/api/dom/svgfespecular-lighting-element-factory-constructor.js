import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFESpecularLightingElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFESpecularLightingElement, "SVGFESpecularLightingElement");

function createSVGFESpecularLightingElement(localName, ownerDocument) {
  const element = Object.create(SVGFESpecularLightingElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFESpecularLightingElementFactory() {
  Object.setPrototypeOf(SVGFESpecularLightingElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFESpecularLightingElement, SVGElement);
  delete SVGFESpecularLightingElement.prototype.constructor;
  defineGlobalConstructor("SVGFESpecularLightingElement", SVGFESpecularLightingElement);
  defineConstructorBacklink(SVGFESpecularLightingElement.prototype, SVGFESpecularLightingElement);
  defineToStringTag(SVGFESpecularLightingElement.prototype, "SVGFESpecularLightingElement");
  registerSVGElementFactory("feSpecularLighting", createSVGFESpecularLightingElement);
}
