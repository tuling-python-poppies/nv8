import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGComponentTransferFunctionElement } from "./svgcomponent-transfer-function-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEFuncRElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEFuncRElement, "SVGFEFuncRElement");

export function createSVGFEFuncRElement(localName, ownerDocument) {
  const element = Object.create(SVGFEFuncRElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEFuncRElementFactory() {
  Object.setPrototypeOf(SVGFEFuncRElement.prototype, SVGComponentTransferFunctionElement.prototype);
  Object.setPrototypeOf(SVGFEFuncRElement, SVGComponentTransferFunctionElement);
  delete SVGFEFuncRElement.prototype.constructor;
  defineGlobalConstructor("SVGFEFuncRElement", SVGFEFuncRElement);
  defineConstructorBacklink(SVGFEFuncRElement.prototype, SVGFEFuncRElement);
  defineToStringTag(SVGFEFuncRElement.prototype, "SVGFEFuncRElement");
  registerSVGElementFactory("feFuncR", createSVGFEFuncRElement);
}
