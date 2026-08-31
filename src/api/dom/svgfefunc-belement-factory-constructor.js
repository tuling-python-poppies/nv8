import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGComponentTransferFunctionElement } from "./svgcomponent-transfer-function-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEFuncBElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEFuncBElement, "SVGFEFuncBElement");

export function createSVGFEFuncBElement(localName, ownerDocument) {
  const element = Object.create(SVGFEFuncBElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEFuncBElementFactory() {
  Object.setPrototypeOf(SVGFEFuncBElement.prototype, SVGComponentTransferFunctionElement.prototype);
  Object.setPrototypeOf(SVGFEFuncBElement, SVGComponentTransferFunctionElement);
  delete SVGFEFuncBElement.prototype.constructor;
  defineGlobalConstructor("SVGFEFuncBElement", SVGFEFuncBElement);
  defineConstructorBacklink(SVGFEFuncBElement.prototype, SVGFEFuncBElement);
  defineToStringTag(SVGFEFuncBElement.prototype, "SVGFEFuncBElement");
  registerSVGElementFactory("feFuncB", createSVGFEFuncBElement);
}
