import { traceCall } from "../../trace/trace-function.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import { requireCSSStyleValue } from "./css-style-value-state.js";
import {
  convertCSSUnitValue,
  createCSSMath,
  normalizeNumericValue,
  normalizeNumericValues,
  readUnparsedValues,
  requireCSSKeywordValue,
  requireCSSMathValue,
  requireCSSNumericArray,
  requireCSSNumericValue,
  requireCSSUnitValue,
  requireCSSUnparsedValue,
  requireCSSVariableReferenceValue,
} from "./css-typed-om-state.js";
import { CSSMathSum, CSSUnitValue } from "./css-typed-om-constructors.js";

export const numericAdd = numericMethod("add", 0, (self, args) => {
  const values = [self, ...normalizeNumericValues(args)];
  const units = values.map(value => requireCSSNumericValue(value));
  if (units.every(record => record.kind === "unit" && record.unit === units[0].unit)) {
    return new CSSUnitValue(
      units.reduce((sum, record) => sum + record.value, 0),
      units[0].unit,
    );
  }
  return createCSSMath("sum", values);
});
export const numericSub = numericMethod("sub", 0, (self, args) => {
  const values = [self, ...normalizeNumericValues(args).map(value =>
    createCSSMath("negate", [value]))];
  return createCSSMath("sum", values);
});
export const numericMul = numericMethod("mul", 0, (self, args) => {
  const values = [self, ...normalizeNumericValues(args)];
  const records = values.map(value => requireCSSNumericValue(value));
  const nonNumbers = records.filter(record =>
    record.kind !== "unit" || record.unit !== "number");
  if (nonNumbers.length <= 1 && records.every(record => record.kind === "unit")) {
    const unit = nonNumbers[0]?.unit ?? "number";
    return new CSSUnitValue(
      records.reduce((product, record) => product * record.value, 1),
      unit,
    );
  }
  return createCSSMath("product", values);
});
export const numericDiv = numericMethod("div", 0, (self, args) =>
  createCSSMath("product", [
    self,
    ...normalizeNumericValues(args).map(value => createCSSMath("invert", [value])),
  ]));
export const numericMin = numericMethod("min", 0, (self, args) =>
  createCSSMath("min", [self, ...normalizeNumericValues(args)]));
export const numericMax = numericMethod("max", 0, (self, args) =>
  createCSSMath("max", [self, ...normalizeNumericValues(args)]));
export const numericEquals = numericMethod("equals", 0, (self, args) => {
  const source = requireCSSStyleValue(self);
  return normalizeNumericValues(args).every(value => requireCSSStyleValue(value) === source);
});
export const numericTo = numericMethod("to", 1, (self, args) =>
  convertCSSUnitValue(self, args[0]));
export const numericToSum = numericMethod("toSum", 0, (self, args) => {
  if (args.length > 0) return new CSSMathSum(convertCSSUnitValue(self, args[0]));
  return new CSSMathSum(self);
});
export const numericType = numericMethod("type", 0, self => {
  const record = requireCSSNumericValue(self);
  if (record.kind !== "unit") return {};
  const dimension = unitDimension(record.unit);
  return dimension === "number" ? {} : { [dimension]: 1 };
});

export const unitValue = typedGetter(
  "CSSUnitValue",
  "value",
  value => requireCSSUnitValue(value).value,
);
export const unit = typedGetter(
  "CSSUnitValue",
  "unit",
  value => requireCSSUnitValue(value).unit,
);
export const keywordValue = typedGetter(
  "CSSKeywordValue",
  "value",
  value => requireCSSKeywordValue(value).value,
);
export const variable = typedGetter(
  "CSSVariableReferenceValue",
  "variable",
  value => requireCSSVariableReferenceValue(value).variable,
);
export const fallback = typedGetter(
  "CSSVariableReferenceValue",
  "fallback",
  value => requireCSSVariableReferenceValue(value).fallback,
);
export const unparsedLength = typedGetter(
  "CSSUnparsedValue",
  "length",
  value => requireCSSUnparsedValue(value).length,
);
export const numericArrayLength = typedGetter(
  "CSSNumericArray",
  "length",
  value => requireCSSNumericArray(value).length,
);
export const mathOperator = typedGetter(
  "CSSMathValue",
  "operator",
  value => requireCSSMathValue(value).operator,
);
export const mathValues = typedGetter(
  "CSSMathValue",
  "values",
  value => requireCSSMathValue(value).values,
);
export const mathValue = typedGetter(
  "CSSMathValue",
  "value",
  value => requireCSSMathValue(value).value,
);
export const mathLower = typedGetter(
  "CSSMathClamp",
  "lower",
  value => requireCSSMathValue(value).lower,
);
export const mathUpper = typedGetter(
  "CSSMathClamp",
  "upper",
  value => requireCSSMathValue(value).upper,
);

export const unparsedEntries = collectionMethod(
  "CSSUnparsedValue",
  "entries",
  0,
  value => readUnparsedValues(value).entries(),
);
export const unparsedKeys = collectionMethod(
  "CSSUnparsedValue",
  "keys",
  0,
  value => readUnparsedValues(value).keys(),
);
export const unparsedValues = collectionMethod(
  "CSSUnparsedValue",
  "values",
  0,
  value => readUnparsedValues(value).values(),
);
export const unparsedForEach = collectionMethod(
  "CSSUnparsedValue",
  "forEach",
  1,
  (value, args) => {
    const callback = args[0];
    if (typeof callback !== "function") throw new TypeError("Callback must be callable");
    const thisArg = args[1];
    readUnparsedValues(value).forEach((member, index) => {
      Reflect.apply(callback, thisArg, [member, index, value]);
    });
  },
);
export const numericArrayEntries = collectionMethod(
  "CSSNumericArray",
  "entries",
  0,
  value => requireCSSNumericArray(value).entries(),
);
export const numericArrayKeys = collectionMethod(
  "CSSNumericArray",
  "keys",
  0,
  value => requireCSSNumericArray(value).keys(),
);
export const numericArrayValues = collectionMethod(
  "CSSNumericArray",
  "values",
  0,
  value => requireCSSNumericArray(value).values(),
);
export const numericArrayForEach = collectionMethod(
  "CSSNumericArray",
  "forEach",
  1,
  (value, args) => {
    const callback = args[0];
    if (typeof callback !== "function") throw new TypeError("Callback must be callable");
    const thisArg = args[1];
    requireCSSNumericArray(value).forEach((member, index) => {
      Reflect.apply(callback, thisArg, [member, index, value]);
    });
  },
);

function numericMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      requireCSSNumericValue(this);
      const result = operation(this, args);
      traceCall(`window.CSSNumericValue.prototype.${name}`, "CSSNumericValue", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

function typedGetter(interfaceName, name, read) {
  const getter = function () {
    const result = read(this);
    traceCall(`window.${interfaceName}.prototype.${name}`, interfaceName, [], result);
    return result;
  };
  registerNativeGetter(getter, name);
  return getter;
}

function collectionMethod(interfaceName, name, arity, operation) {
  const callback = {
    [name](...args) {
      const result = operation(this, args);
      traceCall(`window.${interfaceName}.prototype.${name}`, interfaceName, args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

function unitDimension(unitName) {
  if (["px", "cm", "mm", "q", "in", "pc", "pt"].includes(unitName)) return "length";
  if (["em", "rem", "vw", "vh", "vmin", "vmax"].includes(unitName)) return "length";
  if (["deg", "grad", "rad", "turn"].includes(unitName)) return "angle";
  if (["s", "ms"].includes(unitName)) return "time";
  if (["hz", "khz"].includes(unitName)) return "frequency";
  if (["dpi", "dpcm", "dppx"].includes(unitName)) return "resolution";
  if (unitName === "percent") return "percent";
  if (unitName === "fr") return "flex";
  return "number";
}
