import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGPatternElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGPatternElement, "SVGPatternElement");

function createSVGPatternElement(localName, ownerDocument) {
  const element = Object.create(SVGPatternElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGPatternElementFactory() {
  Object.setPrototypeOf(SVGPatternElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGPatternElement, SVGElement);
  delete SVGPatternElement.prototype.constructor;
  defineGlobalConstructor("SVGPatternElement", SVGPatternElement);
  defineConstructorBacklink(SVGPatternElement.prototype, SVGPatternElement);
  defineToStringTag(SVGPatternElement.prototype, "SVGPatternElement");
  registerSVGElementFactory("pattern", createSVGPatternElement);
}
