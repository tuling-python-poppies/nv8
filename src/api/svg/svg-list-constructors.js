import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function SVGLengthList() { throw new TypeError("Illegal constructor"); }
export function SVGNumberList() { throw new TypeError("Illegal constructor"); }
export function SVGPointList() { throw new TypeError("Illegal constructor"); }
export function SVGStringList() { throw new TypeError("Illegal constructor"); }
export function SVGTransformList() { throw new TypeError("Illegal constructor"); }

for (const constructor of [
  SVGLengthList,
  SVGNumberList,
  SVGPointList,
  SVGStringList,
  SVGTransformList,
]) {
  registerNativeFunction(constructor, constructor.name);
}

export function installSVGListConstructors() {
  for (const constructor of [
    SVGLengthList,
    SVGNumberList,
    SVGPointList,
    SVGStringList,
    SVGTransformList,
  ]) {
    delete constructor.prototype.constructor;
    defineGlobalConstructor(constructor.name, constructor);
  }
}
