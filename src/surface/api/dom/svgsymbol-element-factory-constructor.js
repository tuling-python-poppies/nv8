import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGGraphicsElement } from "./svg-graphics-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGSymbolElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGSymbolElement, "SVGSymbolElement");

function createSVGSymbolElement(localName, ownerDocument) {
  const element = Object.create(SVGSymbolElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGSymbolElementFactory() {
  Object.setPrototypeOf(SVGSymbolElement.prototype, SVGGraphicsElement.prototype);
  Object.setPrototypeOf(SVGSymbolElement, SVGGraphicsElement);
  delete SVGSymbolElement.prototype.constructor;
  defineGlobalConstructor("SVGSymbolElement", SVGSymbolElement);
  defineConstructorBacklink(SVGSymbolElement.prototype, SVGSymbolElement);
  defineToStringTag(SVGSymbolElement.prototype, "SVGSymbolElement");
  registerSVGElementFactory("symbol", createSVGSymbolElement);
}
