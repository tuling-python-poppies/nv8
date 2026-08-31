import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGGraphicsElement } from "./svg-graphics-element-constructor.js";

export function SVGGeometryElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGGeometryElement, "SVGGeometryElement");

export function installSVGGeometryElementConstructor() {
  Object.setPrototypeOf(
    SVGGeometryElement.prototype,
    SVGGraphicsElement.prototype,
  );
  Object.setPrototypeOf(SVGGeometryElement, SVGGraphicsElement);
  delete SVGGeometryElement.prototype.constructor;
  defineGlobalConstructor("SVGGeometryElement", SVGGeometryElement);
}

export function finishSVGGeometryElementConstructor() {
  defineConstructorBacklink(
    SVGGeometryElement.prototype,
    SVGGeometryElement,
  );
  defineToStringTag(SVGGeometryElement.prototype, "SVGGeometryElement");
}
