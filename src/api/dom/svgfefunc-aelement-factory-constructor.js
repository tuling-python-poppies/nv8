import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGComponentTransferFunctionElement } from "./svgcomponent-transfer-function-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEFuncAElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEFuncAElement, "SVGFEFuncAElement");

export function createSVGFEFuncAElement(localName, ownerDocument) {
  const element = Object.create(SVGFEFuncAElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEFuncAElementFactory() {
  Object.setPrototypeOf(SVGFEFuncAElement.prototype, SVGComponentTransferFunctionElement.prototype);
  Object.setPrototypeOf(SVGFEFuncAElement, SVGComponentTransferFunctionElement);
  delete SVGFEFuncAElement.prototype.constructor;
  defineGlobalConstructor("SVGFEFuncAElement", SVGFEFuncAElement);
  defineConstructorBacklink(SVGFEFuncAElement.prototype, SVGFEFuncAElement);
  defineToStringTag(SVGFEFuncAElement.prototype, "SVGFEFuncAElement");
  registerSVGElementFactory("feFuncA", createSVGFEFuncAElement);
}
