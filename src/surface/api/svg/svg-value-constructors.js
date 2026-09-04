import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function SVGNumber() { throw new TypeError("Illegal constructor"); }
export function SVGPoint() { throw new TypeError("Illegal constructor"); }
export function SVGRect() { throw new TypeError("Illegal constructor"); }
export function SVGLength() { throw new TypeError("Illegal constructor"); }
export function SVGAngle() { throw new TypeError("Illegal constructor"); }
export function SVGMatrix() { throw new TypeError("Illegal constructor"); }
export function SVGTransform() { throw new TypeError("Illegal constructor"); }
export function SVGPreserveAspectRatio() { throw new TypeError("Illegal constructor"); }

for (const constructor of [
  SVGNumber,
  SVGPoint,
  SVGRect,
  SVGLength,
  SVGAngle,
  SVGMatrix,
  SVGTransform,
  SVGPreserveAspectRatio,
]) {
  registerNativeFunction(constructor, constructor.name);
}

export function installSVGValueConstructors() {
  for (const constructor of [
    SVGNumber,
    SVGPoint,
    SVGRect,
    SVGLength,
    SVGAngle,
    SVGMatrix,
    SVGTransform,
    SVGPreserveAspectRatio,
  ]) {
    delete constructor.prototype.constructor;
    defineGlobalConstructor(constructor.name, constructor);
  }
}
