import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";

const state = new WeakMap();

export function SVGAnimatedAngle() { throw new TypeError("Illegal constructor"); }
export function SVGAnimatedBoolean() { throw new TypeError("Illegal constructor"); }
export function SVGAnimatedEnumeration() { throw new TypeError("Illegal constructor"); }
export function SVGAnimatedInteger() { throw new TypeError("Illegal constructor"); }
export function SVGAnimatedLength() { throw new TypeError("Illegal constructor"); }
export function SVGAnimatedLengthList() { throw new TypeError("Illegal constructor"); }
export function SVGAnimatedNumber() { throw new TypeError("Illegal constructor"); }
export function SVGAnimatedNumberList() { throw new TypeError("Illegal constructor"); }
export function SVGAnimatedPreserveAspectRatio() { throw new TypeError("Illegal constructor"); }
export function SVGAnimatedRect() { throw new TypeError("Illegal constructor"); }
export function SVGAnimatedString() { throw new TypeError("Illegal constructor"); }
export function SVGAnimatedTransformList() { throw new TypeError("Illegal constructor"); }

export const animatedConstructors = [
  SVGAnimatedAngle,
  SVGAnimatedBoolean,
  SVGAnimatedEnumeration,
  SVGAnimatedInteger,
  SVGAnimatedLength,
  SVGAnimatedLengthList,
  SVGAnimatedNumber,
  SVGAnimatedNumberList,
  SVGAnimatedPreserveAspectRatio,
  SVGAnimatedRect,
  SVGAnimatedString,
  SVGAnimatedTransformList,
];

for (const constructor of animatedConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

export function createSVGAnimatedValue(constructor, baseVal, animVal = baseVal) {
  if (!animatedConstructors.includes(constructor)) {
    throw new TypeError("Unknown animated SVG value constructor");
  }
  const value = Object.create(constructor.prototype);
  state.set(value, { baseVal, animVal });
  return value;
}

export function requireSVGAnimatedValue(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function createAnimatedGetter(interfaceName, name) {
  const getter = function () {
    return requireSVGAnimatedValue(this)[name];
  };
  registerNativeGetter(getter, name);
  return getter;
}

export function installSVGAnimatedValueConstructors() {
  for (const constructor of animatedConstructors) {
    delete constructor.prototype.constructor;
    defineGlobalConstructor(constructor.name, constructor);
  }
}
