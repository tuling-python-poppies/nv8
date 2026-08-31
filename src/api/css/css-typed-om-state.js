import { initializeCSSStyleValue, requireCSSStyleValue } from "./css-style-value-state.js";
import {
  CSSKeywordValue,
  CSSMathClamp,
  CSSMathInvert,
  CSSMathMax,
  CSSMathMin,
  CSSMathNegate,
  CSSMathProduct,
  CSSMathSum,
  CSSNumericArray,
  CSSUnitValue,
  CSSVariableReferenceValue,
} from "./css-typed-om-constructors.js";

const numericState = new WeakMap();
const keywordState = new WeakMap();
const variableState = new WeakMap();
const unparsedState = new WeakMap();
const numericArrayState = new WeakMap();
const mathState = new WeakMap();

const dimensions = new Map([
  ["number", ["number", 1]],
  ["percent", ["percent", 1]],
  ["px", ["length", 1]],
  ["cm", ["length", 96 / 2.54]],
  ["mm", ["length", 96 / 25.4]],
  ["q", ["length", 96 / 101.6]],
  ["in", ["length", 96]],
  ["pc", ["length", 16]],
  ["pt", ["length", 96 / 72]],
  ["em", ["length-relative", 1]],
  ["rem", ["length-relative", 1]],
  ["cap", ["length-relative", 1]],
  ["ch", ["length-relative", 1]],
  ["cqb", ["length-relative", 1]],
  ["cqh", ["length-relative", 1]],
  ["cqi", ["length-relative", 1]],
  ["cqmax", ["length-relative", 1]],
  ["cqmin", ["length-relative", 1]],
  ["cqw", ["length-relative", 1]],
  ["dvb", ["length-relative", 1]],
  ["dvh", ["length-relative", 1]],
  ["dvi", ["length-relative", 1]],
  ["dvmax", ["length-relative", 1]],
  ["dvmin", ["length-relative", 1]],
  ["dvw", ["length-relative", 1]],
  ["ex", ["length-relative", 1]],
  ["ic", ["length-relative", 1]],
  ["lh", ["length-relative", 1]],
  ["lvb", ["length-relative", 1]],
  ["lvh", ["length-relative", 1]],
  ["lvi", ["length-relative", 1]],
  ["lvmax", ["length-relative", 1]],
  ["lvmin", ["length-relative", 1]],
  ["lvw", ["length-relative", 1]],
  ["rcap", ["length-relative", 1]],
  ["rch", ["length-relative", 1]],
  ["rex", ["length-relative", 1]],
  ["ric", ["length-relative", 1]],
  ["rlh", ["length-relative", 1]],
  ["svb", ["length-relative", 1]],
  ["svh", ["length-relative", 1]],
  ["svi", ["length-relative", 1]],
  ["svmax", ["length-relative", 1]],
  ["svmin", ["length-relative", 1]],
  ["svw", ["length-relative", 1]],
  ["vb", ["length-relative", 1]],
  ["vi", ["length-relative", 1]],
  ["vw", ["length-relative", 1]],
  ["vh", ["length-relative", 1]],
  ["vmin", ["length-relative", 1]],
  ["vmax", ["length-relative", 1]],
  ["deg", ["angle", 1]],
  ["grad", ["angle", 0.9]],
  ["rad", ["angle", 180 / Math.PI]],
  ["turn", ["angle", 360]],
  ["s", ["time", 1]],
  ["ms", ["time", 0.001]],
  ["hz", ["frequency", 1]],
  ["khz", ["frequency", 1000]],
  ["dpi", ["resolution", 1 / 96]],
  ["dpcm", ["resolution", 2.54 / 96]],
  ["dppx", ["resolution", 1]],
  ["x", ["resolution", 1]],
  ["fr", ["flex", 1]],
]);

export function initializeCSSNumericValue(value, record, serialize) {
  numericState.set(value, record);
  initializeCSSStyleValue(value, serialize);
  return value;
}

export function requireCSSNumericValue(value) {
  const record = numericState.get(value);
  if (record === undefined) throw new TypeError("Expected a CSSNumericValue");
  return record;
}

export function initializeCSSUnitValue(value, number, unit) {
  const normalizedUnit = normalizeUnit(unit);
  const normalizedValue = Number(number);
  if (!Number.isFinite(normalizedValue)) throw new TypeError("The value must be finite");
  return initializeCSSNumericValue(
    value,
    { kind: "unit", value: normalizedValue, unit: normalizedUnit },
    () => serializeUnitValue(value),
  );
}

export function requireCSSUnitValue(value) {
  const record = requireCSSNumericValue(value);
  if (record.kind !== "unit") throw new TypeError("Illegal invocation");
  return record;
}

export function initializeCSSKeywordValue(value, keyword) {
  const normalized = `${keyword}`;
  if (normalized === "") throw new TypeError("The value cannot be empty");
  keywordState.set(value, { value: normalized });
  initializeCSSStyleValue(value, () => requireCSSKeywordValue(value).value);
  return value;
}

export function requireCSSKeywordValue(value) {
  const record = keywordState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function initializeCSSVariableReferenceValue(value, variable, fallback) {
  const normalized = `${variable}`;
  if (!normalized.startsWith("--") || normalized.length < 3) {
    throw new TypeError("A custom property name is required");
  }
  if (fallback !== null && requireCSSUnparsedValue(fallback) === undefined) {
    throw new TypeError("The fallback must be a CSSUnparsedValue");
  }
  variableState.set(value, { variable: normalized, fallback });
  return value;
}

export function requireCSSVariableReferenceValue(value) {
  const record = variableState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function serializeCSSVariableReferenceValue(value) {
  const record = requireCSSVariableReferenceValue(value);
  return `var(${record.variable}${record.fallback === null ? "" : `, ${requireCSSStyleValue(record.fallback)}`})`;
}

export function initializeCSSUnparsedValue(value, members) {
  if (members === null || members === undefined || typeof members[Symbol.iterator] !== "function") {
    throw new TypeError("The value must be iterable");
  }
  const values = [];
  for (const member of members) {
    if (typeof member === "string") values.push(member);
    else {
      requireCSSVariableReferenceValue(member);
      values.push(member);
    }
  }
  unparsedState.set(value, values);
  for (let index = 0; index < values.length; index += 1) {
    Object.defineProperty(value, index, {
      value: values[index],
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
  initializeCSSStyleValue(value, () => readUnparsedValues(value).map(member =>
    typeof member === "string" ? member : serializeCSSVariableReferenceValue(member)).join(""));
  return value;
}

export function requireCSSUnparsedValue(value) {
  const values = unparsedState.get(value);
  if (values === undefined) throw new TypeError("Illegal invocation");
  return values;
}

export function readUnparsedValues(value) {
  const values = requireCSSUnparsedValue(value);
  return values.map((_member, index) => value[index]);
}

export function createCSSNumericArray(values) {
  const array = Object.create(CSSNumericArray.prototype);
  numericArrayState.set(array, values);
  for (let index = 0; index < values.length; index += 1) {
    Object.defineProperty(array, index, {
      value: values[index],
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }
  return array;
}

export function requireCSSNumericArray(value) {
  const values = numericArrayState.get(value);
  if (values === undefined) throw new TypeError("Illegal invocation");
  return values;
}

export function initializeCSSMathList(value, operator, inputValues) {
  const values = normalizeNumericValues(inputValues, true);
  mathState.set(value, { operator, values: createCSSNumericArray(values) });
  return initializeCSSNumericValue(
    value,
    { kind: "math", operator },
    () => serializeCSSMathValue(value),
  );
}

export function initializeCSSMathNegate(value, input) {
  const normalized = normalizeNumericValue(input);
  mathState.set(value, { operator: "negate", value: normalized });
  return initializeCSSNumericValue(
    value,
    { kind: "math", operator: "negate" },
    () => serializeCSSMathValue(value),
  );
}

export function initializeCSSMathInvert(value, input) {
  const normalized = normalizeNumericValue(input);
  mathState.set(value, { operator: "invert", value: normalized });
  return initializeCSSNumericValue(
    value,
    { kind: "math", operator: "invert" },
    () => serializeCSSMathValue(value),
  );
}

export function initializeCSSMathClamp(value, lower, center, upper) {
  const record = {
    operator: "clamp",
    lower: normalizeNumericValue(lower),
    value: normalizeNumericValue(center),
    upper: normalizeNumericValue(upper),
  };
  mathState.set(value, record);
  return initializeCSSNumericValue(
    value,
    { kind: "math", operator: "clamp" },
    () => serializeCSSMathValue(value),
  );
}

export function requireCSSMathValue(value) {
  requireCSSNumericValue(value);
  const record = mathState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function normalizeNumericValue(value) {
  if (typeof value === "number") return new CSSUnitValue(value, "number");
  requireCSSNumericValue(value);
  return value;
}

export function normalizeNumericValues(values, requireOne = false) {
  const normalized = [...values].map(normalizeNumericValue);
  if (requireOne && normalized.length === 0) throw new TypeError("At least one value is required");
  return normalized;
}

export function convertCSSUnitValue(value, targetUnit) {
  const source = requireCSSUnitValue(value);
  const target = normalizeUnit(targetUnit);
  const sourceDimension = dimensions.get(source.unit);
  const targetDimension = dimensions.get(target);
  if (sourceDimension[0] !== targetDimension[0]) {
    throw new TypeError("Incompatible units");
  }
  return new CSSUnitValue(
    source.value * sourceDimension[1] / targetDimension[1],
    target,
  );
}

export function createCSSMath(operator, values) {
  if (operator === "sum") return new CSSMathSum(...values);
  if (operator === "product") return new CSSMathProduct(...values);
  if (operator === "min") return new CSSMathMin(...values);
  if (operator === "max") return new CSSMathMax(...values);
  if (operator === "negate") return new CSSMathNegate(values[0]);
  if (operator === "invert") return new CSSMathInvert(values[0]);
  if (operator === "clamp") return new CSSMathClamp(...values);
  throw new TypeError("Unknown math operator");
}

export function serializeUnitValue(value) {
  const record = requireCSSUnitValue(value);
  const suffix = record.unit === "number" ? "" : record.unit === "percent" ? "%" : record.unit;
  return `${formatNumber(record.value)}${suffix}`;
}

export function serializeCSSMathValue(value) {
  const record = requireCSSMathValue(value);
  if (record.operator === "sum") {
    return `calc(${requireCSSNumericArray(record.values).map(requireCSSStyleValue).join(" + ")})`;
  }
  if (record.operator === "product") {
    return `calc(${requireCSSNumericArray(record.values).map(requireCSSStyleValue).join(" * ")})`;
  }
  if (record.operator === "min" || record.operator === "max") {
    return `${record.operator}(${requireCSSNumericArray(record.values).map(requireCSSStyleValue).join(", ")})`;
  }
  if (record.operator === "negate") return `calc(-1 * ${requireCSSStyleValue(record.value)})`;
  if (record.operator === "invert") return `calc(1 / ${requireCSSStyleValue(record.value)})`;
  return `clamp(${requireCSSStyleValue(record.lower)}, ${requireCSSStyleValue(record.value)}, ${requireCSSStyleValue(record.upper)})`;
}

function normalizeUnit(unit) {
  const normalized = `${unit}`.trim().toLowerCase();
  if (!dimensions.has(normalized)) throw new TypeError("Unknown unit");
  return normalized;
}

function formatNumber(value) {
  return Object.is(value, -0) ? "0" : `${value}`;
}
