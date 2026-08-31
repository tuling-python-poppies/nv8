import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";

export function SVGGraphicsElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGGraphicsElement, "SVGGraphicsElement");

export function installSVGGraphicsElementConstructor() {
  Object.setPrototypeOf(
    SVGGraphicsElement.prototype,
    SVGElement.prototype,
  );
  Object.setPrototypeOf(SVGGraphicsElement, SVGElement);
  delete SVGGraphicsElement.prototype.constructor;
  defineGlobalConstructor("SVGGraphicsElement", SVGGraphicsElement);
}

export function finishSVGGraphicsElementConstructor() {
  defineConstructorBacklink(
    SVGGraphicsElement.prototype,
    SVGGraphicsElement,
  );
  defineToStringTag(SVGGraphicsElement.prototype, "SVGGraphicsElement");
}
