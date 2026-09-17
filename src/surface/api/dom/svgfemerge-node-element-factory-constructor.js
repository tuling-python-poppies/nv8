import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEMergeNodeElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEMergeNodeElement, "SVGFEMergeNodeElement");

function createSVGFEMergeNodeElement(localName, ownerDocument) {
  const element = Object.create(SVGFEMergeNodeElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEMergeNodeElementFactory() {
  Object.setPrototypeOf(SVGFEMergeNodeElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEMergeNodeElement, SVGElement);
  delete SVGFEMergeNodeElement.prototype.constructor;
  defineGlobalConstructor("SVGFEMergeNodeElement", SVGFEMergeNodeElement);
  defineConstructorBacklink(SVGFEMergeNodeElement.prototype, SVGFEMergeNodeElement);
  defineToStringTag(SVGFEMergeNodeElement.prototype, "SVGFEMergeNodeElement");
  registerSVGElementFactory("feMergeNode", createSVGFEMergeNodeElement);
}
