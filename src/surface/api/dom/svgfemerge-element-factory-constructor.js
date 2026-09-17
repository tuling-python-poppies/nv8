import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEMergeElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEMergeElement, "SVGFEMergeElement");

function createSVGFEMergeElement(localName, ownerDocument) {
  const element = Object.create(SVGFEMergeElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEMergeElementFactory() {
  Object.setPrototypeOf(SVGFEMergeElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEMergeElement, SVGElement);
  delete SVGFEMergeElement.prototype.constructor;
  defineGlobalConstructor("SVGFEMergeElement", SVGFEMergeElement);
  defineConstructorBacklink(SVGFEMergeElement.prototype, SVGFEMergeElement);
  defineToStringTag(SVGFEMergeElement.prototype, "SVGFEMergeElement");
  registerSVGElementFactory("feMerge", createSVGFEMergeElement);
}
