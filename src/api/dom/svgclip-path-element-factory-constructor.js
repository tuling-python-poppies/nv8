import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGClipPathElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGClipPathElement, "SVGClipPathElement");

export function createSVGClipPathElement(localName, ownerDocument) {
  const element = Object.create(SVGClipPathElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGClipPathElementFactory() {
  Object.setPrototypeOf(SVGClipPathElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGClipPathElement, SVGElement);
  delete SVGClipPathElement.prototype.constructor;
  defineGlobalConstructor("SVGClipPathElement", SVGClipPathElement);
  defineConstructorBacklink(SVGClipPathElement.prototype, SVGClipPathElement);
  defineToStringTag(SVGClipPathElement.prototype, "SVGClipPathElement");
  registerSVGElementFactory("clipPath", createSVGClipPathElement);
}
