import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFETurbulenceElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFETurbulenceElement, "SVGFETurbulenceElement");

function createSVGFETurbulenceElement(localName, ownerDocument) {
  const element = Object.create(SVGFETurbulenceElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFETurbulenceElementFactory() {
  Object.setPrototypeOf(SVGFETurbulenceElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFETurbulenceElement, SVGElement);
  delete SVGFETurbulenceElement.prototype.constructor;
  defineGlobalConstructor("SVGFETurbulenceElement", SVGFETurbulenceElement);
  defineConstructorBacklink(SVGFETurbulenceElement.prototype, SVGFETurbulenceElement);
  defineToStringTag(SVGFETurbulenceElement.prototype, "SVGFETurbulenceElement");
  registerSVGElementFactory("feTurbulence", createSVGFETurbulenceElement);
}
