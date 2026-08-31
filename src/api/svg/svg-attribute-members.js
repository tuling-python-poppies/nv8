import { traceCall } from "../../trace/trace-function.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { getAttributeValue, requireElement } from "../dom/element-state.js";
import {
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
  createSVGAnimatedValue,
} from "./svg-animated-values.js";
import { createSVGList } from "./svg-list-state.js";
import {
  createSVGLength,
  createSVGAngle,
  createSVGNumber,
  createSVGPreserveAspectRatio,
  createSVGRect,
} from "./svg-value-state.js";

const state = new WeakMap();

export function createSVGAttributeGetter(
  interfaceName,
  propertyName,
  kind,
  attributeName = propertyName,
  fallback = 0,
) {
  const getter = function () {
    requireElement(this);
    let values = state.get(this);
    if (values === undefined) {
      values = new Map();
      state.set(this, values);
    }
    let result = values.get(propertyName);
    if (result === undefined) {
      result = createAttributeValue(
        this,
        attributeName,
        kind,
        fallback,
      );
      values.set(propertyName, result);
    }
    traceCall(
      `window.${interfaceName}.prototype.${propertyName}`,
      interfaceName,
      [],
      result,
    );
    return result;
  };
  registerNativeGetter(getter, propertyName);
  return getter;
}

function createAttributeValue(element, name, kind, fallback) {
  const source = getAttributeValue(element, name);
  if (kind === "length") {
    const value = parseLength(source, fallback);
    return createSVGAnimatedValue(SVGAnimatedLength, value, value);
  }
  if (kind === "number") {
    const value = finiteAttribute(source, fallback);
    return createSVGAnimatedValue(SVGAnimatedNumber, value, value);
  }
  if (kind === "plainNumber") return finiteAttribute(source, fallback);
  if (kind === "plainString") return source ?? `${fallback ?? ""}`;
  if (kind === "plainNullableString") return source;
  if (kind === "plainNull") return null;
  if (kind === "integer") {
    const value = Math.trunc(finiteAttribute(source, fallback));
    return createSVGAnimatedValue(SVGAnimatedInteger, value, value);
  }
  if (kind === "boolean") {
    const value = source === null ? Boolean(fallback) : source !== "false";
    return createSVGAnimatedValue(SVGAnimatedBoolean, value, value);
  }
  if (kind === "angle") {
    const value = createSVGAngle(finiteAttribute(source, fallback));
    return createSVGAnimatedValue(SVGAnimatedAngle, value, value);
  }
  if (kind === "numberFirst" || kind === "numberSecond") {
    const numbers = (source ?? "")
      .match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/giu)?.map(Number) ?? [];
    const index = kind === "numberFirst" ? 0 : Math.min(1, numbers.length - 1);
    const value = numbers[index] ?? (Number(fallback) || 0);
    return createSVGAnimatedValue(SVGAnimatedNumber, value, value);
  }
  if (kind === "enumeration") {
    const value = Math.max(0, finiteAttribute(source, fallback)) >>> 0;
    return createSVGAnimatedValue(SVGAnimatedEnumeration, value, value);
  }
  if (kind === "string") {
    const value = source ?? `${fallback ?? ""}`;
    return createSVGAnimatedValue(SVGAnimatedString, value, value);
  }
  if (kind === "transform") {
    const value = createSVGList("transform");
    return createSVGAnimatedValue(SVGAnimatedTransformList, value, value);
  }
  if (kind === "numberList") {
    const numbers = (source ?? "")
      .match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/giu)?.map(Number) ?? [];
    const value = createSVGList("number", numbers.map(createSVGNumber));
    return createSVGAnimatedValue(SVGAnimatedNumberList, value, value);
  }
  if (kind === "lengthList") {
    const numbers = (source ?? "")
      .match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/giu)?.map(Number) ?? [];
    const value = createSVGList("length", numbers.map(createSVGLength));
    return createSVGAnimatedValue(SVGAnimatedLengthList, value, value);
  }
  if (kind === "stringList") {
    return createSVGList("string", (source ?? "").trim().split(/\s+/u).filter(Boolean));
  }
  if (kind === "rect") {
    const numbers = (source ?? "")
      .match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/giu)?.map(Number) ?? [];
    const value = numbers.length === 4 ? createSVGRect(...numbers) : createSVGRect();
    return createSVGAnimatedValue(SVGAnimatedRect, value, value);
  }
  if (kind === "aspectRatio") {
    const value = createSVGPreserveAspectRatio();
    return createSVGAnimatedValue(
      SVGAnimatedPreserveAspectRatio,
      value,
      value,
    );
  }
  throw new TypeError(`Unsupported SVG attribute value kind: ${kind}`);
}

function parseLength(source, fallback) {
  if (source === null || source.trim() === "") return createSVGLength(fallback, 1);
  const match = /^([-+]?(?:\d*\.)?\d+)(%|em|ex|px|cm|mm|in|pt|pc)?$/iu
    .exec(source.trim());
  if (match === null) return createSVGLength(fallback, 1);
  const units = {
    "%": 2,
    em: 3,
    ex: 4,
    px: 5,
    cm: 6,
    mm: 7,
    in: 8,
    pt: 9,
    pc: 10,
  };
  return createSVGLength(Number(match[1]), units[match[2]] ?? 1);
}

function finiteAttribute(source, fallback) {
  const value = source === null ? Number(fallback) : Number(source);
  return Number.isFinite(value) ? value : Number(fallback) || 0;
}
