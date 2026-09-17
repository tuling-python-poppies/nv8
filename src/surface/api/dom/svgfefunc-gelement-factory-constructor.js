import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGComponentTransferFunctionElement } from "./svgcomponent-transfer-function-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEFuncGElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEFuncGElement, "SVGFEFuncGElement");

function createSVGFEFuncGElement(localName, ownerDocument) {
  const element = Object.create(SVGFEFuncGElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEFuncGElementFactory() {
  Object.setPrototypeOf(SVGFEFuncGElement.prototype, SVGComponentTransferFunctionElement.prototype);
  Object.setPrototypeOf(SVGFEFuncGElement, SVGComponentTransferFunctionElement);
  delete SVGFEFuncGElement.prototype.constructor;
  defineGlobalConstructor("SVGFEFuncGElement", SVGFEFuncGElement);
  defineConstructorBacklink(SVGFEFuncGElement.prototype, SVGFEFuncGElement);
  defineToStringTag(SVGFEFuncGElement.prototype, "SVGFEFuncGElement");
  registerSVGElementFactory("feFuncG", createSVGFEFuncGElement);
}
