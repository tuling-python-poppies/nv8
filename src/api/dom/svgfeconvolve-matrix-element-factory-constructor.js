import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEConvolveMatrixElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEConvolveMatrixElement, "SVGFEConvolveMatrixElement");

export function createSVGFEConvolveMatrixElement(localName, ownerDocument) {
  const element = Object.create(SVGFEConvolveMatrixElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEConvolveMatrixElementFactory() {
  Object.setPrototypeOf(SVGFEConvolveMatrixElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEConvolveMatrixElement, SVGElement);
  delete SVGFEConvolveMatrixElement.prototype.constructor;
  defineGlobalConstructor("SVGFEConvolveMatrixElement", SVGFEConvolveMatrixElement);
  defineConstructorBacklink(SVGFEConvolveMatrixElement.prototype, SVGFEConvolveMatrixElement);
  defineToStringTag(SVGFEConvolveMatrixElement.prototype, "SVGFEConvolveMatrixElement");
  registerSVGElementFactory("feConvolveMatrix", createSVGFEConvolveMatrixElement);
}
