import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGFEFloodElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGFEFloodElement, "SVGFEFloodElement");

function createSVGFEFloodElement(localName, ownerDocument) {
  const element = Object.create(SVGFEFloodElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGFEFloodElementFactory() {
  Object.setPrototypeOf(SVGFEFloodElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGFEFloodElement, SVGElement);
  delete SVGFEFloodElement.prototype.constructor;
  defineGlobalConstructor("SVGFEFloodElement", SVGFEFloodElement);
  defineConstructorBacklink(SVGFEFloodElement.prototype, SVGFEFloodElement);
  defineToStringTag(SVGFEFloodElement.prototype, "SVGFEFloodElement");
  registerSVGElementFactory("feFlood", createSVGFEFloodElement);
}
