import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEMorphologyElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEMorphologyElement, "SVGFEMorphologyElement");

function createSVGFEMorphologyElement(localName, ownerDocument) {
  const element = Object.create(SVGFEMorphologyElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEMorphologyElementFactory() {
  Object.setPrototypeOf(SVGFEMorphologyElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEMorphologyElement, SVGElement);
  delete SVGFEMorphologyElement.prototype.constructor;
  defineGlobalConstructor("SVGFEMorphologyElement", SVGFEMorphologyElement);
  defineConstructorBacklink(SVGFEMorphologyElement.prototype, SVGFEMorphologyElement);
  defineToStringTag(SVGFEMorphologyElement.prototype, "SVGFEMorphologyElement");
  registerSVGElementFactory("feMorphology", createSVGFEMorphologyElement);
}
