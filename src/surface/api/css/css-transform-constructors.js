import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { CSSStyleValue } from "./css-style-value-constructor.js";
import {
  initializeCSSMatrixComponent,
  initializeCSSPerspective,
  initializeCSSPositionValue,
  initializeCSSRotate,
  initializeCSSScale,
  initializeCSSSkew,
  initializeCSSTransformValue,
  initializeCSSTranslate,
} from "./css-transform-state.js";

export function CSSTransformComponent() {
  throw new TypeError("Illegal constructor");
}
export function CSSMatrixComponent(matrix) {
  if (new.target === undefined) throw new TypeError("CSSMatrixComponent must be constructed");
  initializeCSSMatrixComponent(this, matrix);
}
export function CSSPerspective(length) {
  if (new.target === undefined) throw new TypeError("CSSPerspective must be constructed");
  initializeCSSPerspective(this, length);
}
export function CSSRotate(angle) {
  if (new.target === undefined) throw new TypeError("CSSRotate must be constructed");
  initializeCSSRotate(this, [...arguments]);
}
export function CSSScale(x, y) {
  if (new.target === undefined) throw new TypeError("CSSScale must be constructed");
  initializeCSSScale(this, x, y, arguments[2]);
}
export function CSSSkew(ax, ay) {
  if (new.target === undefined) throw new TypeError("CSSSkew must be constructed");
  initializeCSSSkew(this, "skew", ax, ay);
}
export function CSSSkewX(ax) {
  if (new.target === undefined) throw new TypeError("CSSSkewX must be constructed");
  initializeCSSSkew(this, "skewX", ax);
}
export function CSSSkewY(ay) {
  if (new.target === undefined) throw new TypeError("CSSSkewY must be constructed");
  initializeCSSSkew(this, "skewY", ay);
}
export function CSSTranslate(x, y) {
  if (new.target === undefined) throw new TypeError("CSSTranslate must be constructed");
  initializeCSSTranslate(this, x, y, arguments[2]);
}
export function CSSTransformValue(components) {
  if (new.target === undefined) throw new TypeError("CSSTransformValue must be constructed");
  initializeCSSTransformValue(this, components);
}
export function CSSPositionValue(x, y) {
  if (new.target === undefined) throw new TypeError("CSSPositionValue must be constructed");
  initializeCSSPositionValue(this, x, y);
}

for (const constructor of [
  CSSTransformComponent,
  CSSMatrixComponent,
  CSSPerspective,
  CSSRotate,
  CSSScale,
  CSSSkew,
  CSSSkewX,
  CSSSkewY,
  CSSTranslate,
  CSSTransformValue,
  CSSPositionValue,
]) {
  registerNativeFunction(constructor, constructor.name);
}

export function installCSSTransformConstructors() {
  for (const constructor of [
    CSSMatrixComponent,
    CSSPerspective,
    CSSRotate,
    CSSScale,
    CSSSkew,
    CSSSkewX,
    CSSSkewY,
    CSSTranslate,
  ]) {
    inherit(constructor, CSSTransformComponent);
  }
  inherit(CSSTransformValue, CSSStyleValue);
  inherit(CSSPositionValue, CSSStyleValue);
  for (const constructor of [
    CSSTransformComponent,
    CSSMatrixComponent,
    CSSPerspective,
    CSSRotate,
    CSSScale,
    CSSSkew,
    CSSSkewX,
    CSSSkewY,
    CSSTranslate,
    CSSTransformValue,
    CSSPositionValue,
  ]) {
    delete constructor.prototype.constructor;
    defineGlobalConstructor(constructor.name, constructor);
  }
}

function inherit(constructor, parent) {
  Object.setPrototypeOf(constructor.prototype, parent.prototype);
  Object.setPrototypeOf(constructor, parent);
}
