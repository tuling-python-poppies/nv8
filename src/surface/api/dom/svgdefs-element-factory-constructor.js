import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGGraphicsElement } from "./svg-graphics-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGDefsElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGDefsElement, "SVGDefsElement");

function createSVGDefsElement(localName, ownerDocument) {
  const element = Object.create(SVGDefsElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGDefsElementFactory() {
  Object.setPrototypeOf(SVGDefsElement.prototype, SVGGraphicsElement.prototype);
  Object.setPrototypeOf(SVGDefsElement, SVGGraphicsElement);
  delete SVGDefsElement.prototype.constructor;
  defineGlobalConstructor("SVGDefsElement", SVGDefsElement);
  defineConstructorBacklink(SVGDefsElement.prototype, SVGDefsElement);
  defineToStringTag(SVGDefsElement.prototype, "SVGDefsElement");
  registerSVGElementFactory("defs", createSVGDefsElement);
}
