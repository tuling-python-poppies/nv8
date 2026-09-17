import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEComponentTransferElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEComponentTransferElement, "SVGFEComponentTransferElement");

function createSVGFEComponentTransferElement(localName, ownerDocument) {
  const element = Object.create(SVGFEComponentTransferElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEComponentTransferElementFactory() {
  Object.setPrototypeOf(SVGFEComponentTransferElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEComponentTransferElement, SVGElement);
  delete SVGFEComponentTransferElement.prototype.constructor;
  defineGlobalConstructor("SVGFEComponentTransferElement", SVGFEComponentTransferElement);
  defineConstructorBacklink(SVGFEComponentTransferElement.prototype, SVGFEComponentTransferElement);
  defineToStringTag(SVGFEComponentTransferElement.prototype, "SVGFEComponentTransferElement");
  registerSVGElementFactory("feComponentTransfer", createSVGFEComponentTransferElement);
}
