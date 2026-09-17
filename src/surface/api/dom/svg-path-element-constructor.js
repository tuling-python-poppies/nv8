import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { SVGGeometryElement } from "./svg-geometry-element-constructor.js";

export function SVGPathElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGPathElement, "SVGPathElement");

function createSVGPathElement(qualifiedName, ownerDocument) {
  const element = Object.create(SVGPathElement.prototype);
  initializeElement(element, qualifiedName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGPathElementConstructor() {
  Object.setPrototypeOf(
    SVGPathElement.prototype,
    SVGGeometryElement.prototype,
  );
  Object.setPrototypeOf(SVGPathElement, SVGGeometryElement);
  delete SVGPathElement.prototype.constructor;
  defineGlobalConstructor("SVGPathElement", SVGPathElement);
  registerSVGElementFactory("path", createSVGPathElement);
}

export function finishSVGPathElementConstructor() {
  defineConstructorBacklink(SVGPathElement.prototype, SVGPathElement);
  defineToStringTag(SVGPathElement.prototype, "SVGPathElement");
}
