import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFilterElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFilterElement, "SVGFilterElement");

function createSVGFilterElement(localName, ownerDocument) {
  const element = Object.create(SVGFilterElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFilterElementFactory() {
  Object.setPrototypeOf(SVGFilterElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFilterElement, SVGElement);
  delete SVGFilterElement.prototype.constructor;
  defineGlobalConstructor("SVGFilterElement", SVGFilterElement);
  defineConstructorBacklink(SVGFilterElement.prototype, SVGFilterElement);
  defineToStringTag(SVGFilterElement.prototype, "SVGFilterElement");
  registerSVGElementFactory("filter", createSVGFilterElement);
}
