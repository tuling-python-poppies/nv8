import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";

export function SVGComponentTransferFunctionElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGComponentTransferFunctionElement, "SVGComponentTransferFunctionElement");

export function installSVGComponentTransferFunctionElementFactory() {
  Object.setPrototypeOf(SVGComponentTransferFunctionElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGComponentTransferFunctionElement, SVGElement);
  delete SVGComponentTransferFunctionElement.prototype.constructor;
  defineGlobalConstructor("SVGComponentTransferFunctionElement", SVGComponentTransferFunctionElement);
  defineConstructorBacklink(SVGComponentTransferFunctionElement.prototype, SVGComponentTransferFunctionElement);
  defineToStringTag(SVGComponentTransferFunctionElement.prototype, "SVGComponentTransferFunctionElement");
}
