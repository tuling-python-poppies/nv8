import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGStopElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGStopElement, "SVGStopElement");

function createSVGStopElement(localName, ownerDocument) {
  const element = Object.create(SVGStopElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGStopElementFactory() {
  Object.setPrototypeOf(SVGStopElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGStopElement, SVGElement);
  delete SVGStopElement.prototype.constructor;
  defineGlobalConstructor("SVGStopElement", SVGStopElement);
  defineConstructorBacklink(SVGStopElement.prototype, SVGStopElement);
  defineToStringTag(SVGStopElement.prototype, "SVGStopElement");
  registerSVGElementFactory("stop", createSVGStopElement);
}
