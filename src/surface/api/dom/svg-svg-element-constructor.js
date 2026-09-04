import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { SVGGraphicsElement } from "./svg-graphics-element-constructor.js";

export function SVGSVGElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGSVGElement, "SVGSVGElement");

export function createSVGSVGElement(qualifiedName, ownerDocument) {
  const element = Object.create(SVGSVGElement.prototype);
  initializeElement(element, qualifiedName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGSVGElementConstructor() {
  Object.setPrototypeOf(
    SVGSVGElement.prototype,
    SVGGraphicsElement.prototype,
  );
  Object.setPrototypeOf(SVGSVGElement, SVGGraphicsElement);
  delete SVGSVGElement.prototype.constructor;
  defineGlobalConstructor("SVGSVGElement", SVGSVGElement);
  registerSVGElementFactory("svg", createSVGSVGElement);
}

export function finishSVGSVGElementConstructor() {
  defineConstructorBacklink(SVGSVGElement.prototype, SVGSVGElement);
  defineToStringTag(SVGSVGElement.prototype, "SVGSVGElement");
}
