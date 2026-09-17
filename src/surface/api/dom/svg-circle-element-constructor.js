import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { SVGGeometryElement } from "./svg-geometry-element-constructor.js";

export function SVGCircleElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGCircleElement, "SVGCircleElement");

function createSVGCircleElement(qualifiedName, ownerDocument) {
  const element = Object.create(SVGCircleElement.prototype);
  initializeElement(element, qualifiedName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGCircleElementConstructor() {
  Object.setPrototypeOf(
    SVGCircleElement.prototype,
    SVGGeometryElement.prototype,
  );
  Object.setPrototypeOf(SVGCircleElement, SVGGeometryElement);
  delete SVGCircleElement.prototype.constructor;
  defineGlobalConstructor("SVGCircleElement", SVGCircleElement);
  registerSVGElementFactory("circle", createSVGCircleElement);
}

export function finishSVGCircleElementConstructor() {
  defineConstructorBacklink(SVGCircleElement.prototype, SVGCircleElement);
  defineToStringTag(SVGCircleElement.prototype, "SVGCircleElement");
}
