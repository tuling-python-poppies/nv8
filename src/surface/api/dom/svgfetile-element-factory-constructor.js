import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFETileElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFETileElement, "SVGFETileElement");

function createSVGFETileElement(localName, ownerDocument) {
  const element = Object.create(SVGFETileElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFETileElementFactory() {
  Object.setPrototypeOf(SVGFETileElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFETileElement, SVGElement);
  delete SVGFETileElement.prototype.constructor;
  defineGlobalConstructor("SVGFETileElement", SVGFETileElement);
  defineConstructorBacklink(SVGFETileElement.prototype, SVGFETileElement);
  defineToStringTag(SVGFETileElement.prototype, "SVGFETileElement");
  registerSVGElementFactory("feTile", createSVGFETileElement);
}
