import { traceCall } from "../../trace/trace-function.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { getAttributeValue, requireElement } from "../dom/element-state.js";
import {
  SVGAnimatedLength,
  createSVGAnimatedValue,
} from "./svg-animated-values.js";
import { createSVGList } from "./svg-list-state.js";
import { createSVGLength, createSVGPoint } from "./svg-value-state.js";

const lengthState = new WeakMap();
const pointsState = new WeakMap();

export function createAnimatedLengthGetter(interfaceName, name, fallback = 0) {
  const getter = function () {
    requireElement(this);
    let values = lengthState.get(this);
    if (values === undefined) {
      values = new Map();
      lengthState.set(this, values);
    }
    let result = values.get(name);
    if (result === undefined) {
      const length = parseLength(getAttributeValue(this, name), fallback);
      result = createSVGAnimatedValue(SVGAnimatedLength, length, length);
      values.set(name, result);
    }
    traceCall(
      `window.${interfaceName}.prototype.${name}`,
      interfaceName,
      [],
      result,
    );
    return result;
  };
  registerNativeGetter(getter, name);
  return getter;
}

export function createPointsGetter(interfaceName, name) {
  const getter = function () {
    requireElement(this);
    let result = pointsState.get(this);
    if (result === undefined) {
      const numbers = (getAttributeValue(this, "points") ?? "")
        .match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/giu)?.map(Number) ?? [];
      const points = [];
      for (let index = 0; index + 1 < numbers.length; index += 2) {
        points.push(createSVGPoint(numbers[index], numbers[index + 1]));
      }
      result = createSVGList("point", points);
      pointsState.set(this, result);
    }
    traceCall(
      `window.${interfaceName}.prototype.${name}`,
      interfaceName,
      [],
      result,
    );
    return result;
  };
  registerNativeGetter(getter, name);
  return getter;
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
