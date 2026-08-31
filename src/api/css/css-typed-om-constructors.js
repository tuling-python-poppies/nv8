import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { CSSStyleValue } from "./css-style-value-constructor.js";
import {
  initializeCSSKeywordValue,
  initializeCSSMathClamp,
  initializeCSSMathInvert,
  initializeCSSMathList,
  initializeCSSMathNegate,
  initializeCSSUnitValue,
  initializeCSSUnparsedValue,
  initializeCSSVariableReferenceValue,
} from "./css-typed-om-state.js";

export function CSSNumericValue() {
  throw new TypeError("Illegal constructor");
}
export function CSSUnitValue(value, unit) {
  if (new.target === undefined) throw new TypeError("CSSUnitValue must be constructed");
  initializeCSSUnitValue(this, value, unit);
}
export function CSSKeywordValue(value) {
  if (new.target === undefined) throw new TypeError("CSSKeywordValue must be constructed");
  initializeCSSKeywordValue(this, value);
}
export function CSSVariableReferenceValue(variable, fallback = null) {
  if (new.target === undefined) {
    throw new TypeError("CSSVariableReferenceValue must be constructed");
  }
  initializeCSSVariableReferenceValue(this, variable, fallback);
}
export function CSSUnparsedValue(members) {
  if (new.target === undefined) throw new TypeError("CSSUnparsedValue must be constructed");
  initializeCSSUnparsedValue(this, members);
}
export function CSSNumericArray() {
  throw new TypeError("Illegal constructor");
}
export function CSSMathValue() {
  throw new TypeError("Illegal constructor");
}
export function CSSMathSum(...values) {
  if (new.target === undefined) throw new TypeError("CSSMathSum must be constructed");
  initializeCSSMathList(this, "sum", values);
}
export function CSSMathProduct(...values) {
  if (new.target === undefined) throw new TypeError("CSSMathProduct must be constructed");
  initializeCSSMathList(this, "product", values);
}
export function CSSMathNegate(value) {
  if (new.target === undefined) throw new TypeError("CSSMathNegate must be constructed");
  initializeCSSMathNegate(this, value);
}
export function CSSMathMin(...values) {
  if (new.target === undefined) throw new TypeError("CSSMathMin must be constructed");
  initializeCSSMathList(this, "min", values);
}
export function CSSMathMax(...values) {
  if (new.target === undefined) throw new TypeError("CSSMathMax must be constructed");
  initializeCSSMathList(this, "max", values);
}
export function CSSMathInvert(value) {
  if (new.target === undefined) throw new TypeError("CSSMathInvert must be constructed");
  initializeCSSMathInvert(this, value);
}
export function CSSMathClamp(lower, value, upper) {
  if (new.target === undefined) throw new TypeError("CSSMathClamp must be constructed");
  initializeCSSMathClamp(this, lower, value, upper);
}

for (const constructor of [
  CSSNumericValue,
  CSSUnitValue,
  CSSKeywordValue,
  CSSVariableReferenceValue,
  CSSUnparsedValue,
  CSSNumericArray,
  CSSMathValue,
  CSSMathSum,
  CSSMathProduct,
  CSSMathNegate,
  CSSMathMin,
  CSSMathMax,
  CSSMathInvert,
  CSSMathClamp,
]) {
  registerNativeFunction(constructor, constructor.name);
}

export function installCSSTypedOMConstructors() {
  inherit(CSSNumericValue, CSSStyleValue);
  inherit(CSSUnitValue, CSSNumericValue);
  inherit(CSSKeywordValue, CSSStyleValue);
  inherit(CSSUnparsedValue, CSSStyleValue);
  inherit(CSSMathValue, CSSNumericValue);
  for (const constructor of [
    CSSMathSum,
    CSSMathProduct,
    CSSMathNegate,
    CSSMathMin,
    CSSMathMax,
    CSSMathInvert,
    CSSMathClamp,
  ]) {
    inherit(constructor, CSSMathValue);
  }
  for (const constructor of [
    CSSNumericValue,
    CSSUnitValue,
    CSSKeywordValue,
    CSSVariableReferenceValue,
    CSSUnparsedValue,
    CSSNumericArray,
    CSSMathValue,
    CSSMathSum,
    CSSMathProduct,
    CSSMathNegate,
    CSSMathMin,
    CSSMathMax,
    CSSMathInvert,
    CSSMathClamp,
  ]) {
    delete constructor.prototype.constructor;
    defineGlobalConstructor(constructor.name, constructor);
  }
}

function inherit(constructor, parent) {
  Object.setPrototypeOf(constructor.prototype, parent.prototype);
  Object.setPrototypeOf(constructor, parent);
}
