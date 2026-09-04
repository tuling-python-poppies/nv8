import { traceCall } from "../../../infra/trace/trace-function.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import { getAttributeValue, requireElement } from "../dom/element-state.js";
import { descendants, requireNode } from "../dom/node-state.js";
import {
  SVGAnimatedLength,
  SVGAnimatedPreserveAspectRatio,
  SVGAnimatedRect,
  createSVGAnimatedValue,
} from "./svg-animated-values.js";
import {
  createSVGLength,
  createSVGPoint,
  createSVGPreserveAspectRatio,
  createSVGRect,
} from "./svg-value-state.js";

const state = new WeakMap();
let nextRedrawHandle = 1;

export const x = getter("x", value => record(value).x);
export const y = getter("y", value => record(value).y);
export const width = getter("width", value => record(value).width);
export const height = getter("height", value => record(value).height);
export const currentScale = getter("currentScale", value => record(value).currentScale);
export const currentTranslate = getter(
  "currentTranslate",
  value => record(value).currentTranslate,
);
export const viewBox = getter("viewBox", value => record(value).viewBox);
export const preserveAspectRatio = getter(
  "preserveAspectRatio",
  value => record(value).preserveAspectRatio,
);
export const zoomAndPan = getter("zoomAndPan", value => record(value).zoomAndPan);

export const animationsPaused = method(
  "animationsPaused",
  0,
  value => record(value).animationsPaused,
);
export const checkEnclosure = method("checkEnclosure", 2, (_value, args) =>
  checkRect(args[0], args[1]));
export const checkIntersection = method("checkIntersection", 2, (_value, args) =>
  checkRect(args[0], args[1]));
export const deselectAll = method("deselectAll", 0, () => undefined);
export const forceRedraw = method("forceRedraw", 0, () => undefined);
export const getCurrentTime = method("getCurrentTime", 0, value => record(value).currentTime);
export const getElementById = method("getElementById", 1, (value, args) => {
  const id = `${args[0]}`;
  for (const node of descendants(value)) {
    try {
      if (getAttributeValue(node, "id") === id) return node;
    } catch {
      // Non-elements cannot match an id selector.
    }
  }
  return null;
});
export const getEnclosureList = method("getEnclosureList", 2, () => []);
export const getIntersectionList = method("getIntersectionList", 2, () => []);
export const pauseAnimations = method("pauseAnimations", 0, value => {
  record(value).animationsPaused = true;
});
export const setCurrentTime = method("setCurrentTime", 1, (value, args) => {
  const time = Number(args[0]);
  record(value).currentTime = Number.isFinite(time) ? Math.max(0, time) : 0;
});
export const suspendRedraw = method("suspendRedraw", 1, () => {
  const handle = nextRedrawHandle;
  nextRedrawHandle += 1;
  return handle;
});
export const unpauseAnimations = method("unpauseAnimations", 0, value => {
  record(value).animationsPaused = false;
});
export const unsuspendRedraw = method("unsuspendRedraw", 1, () => undefined);
export const unsuspendRedrawAll = method("unsuspendRedrawAll", 0, () => undefined);

function record(value) {
  const element = requireElement(value);
  if (element.localName !== "svg") throw new TypeError("Illegal invocation");
  let result = state.get(value);
  if (result === undefined) {
    result = {
      x: animatedLength(value, "x", 0),
      y: animatedLength(value, "y", 0),
      width: animatedLength(value, "width", 300),
      height: animatedLength(value, "height", 150),
      currentScale: 1,
      currentTranslate: createSVGPoint(),
      viewBox: animatedRect(value),
      preserveAspectRatio: animatedAspectRatio(),
      zoomAndPan: 2,
      animationsPaused: false,
      currentTime: 0,
    };
    state.set(value, result);
  }
  return result;
}

function animatedLength(element, name, fallback) {
  const length = parseLength(getAttributeValue(element, name), fallback);
  return createSVGAnimatedValue(SVGAnimatedLength, length, length);
}

function animatedRect(element) {
  const values = (getAttributeValue(element, "viewBox") ?? "")
    .match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/giu)?.map(Number) ?? [];
  const rect = values.length === 4 ? createSVGRect(...values) : createSVGRect();
  return createSVGAnimatedValue(SVGAnimatedRect, rect, rect);
}

function animatedAspectRatio() {
  const aspectRatio = createSVGPreserveAspectRatio();
  return createSVGAnimatedValue(
    SVGAnimatedPreserveAspectRatio,
    aspectRatio,
    aspectRatio,
  );
}

function parseLength(source, fallback) {
  if (source === null || source.trim() === "") return createSVGLength(fallback, 1);
  const match = /^([-+]?(?:\d*\.)?\d+)(%|em|ex|px|cm|mm|in|pt|pc)?$/iu.exec(source.trim());
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
  return createSVGLength(Number(match[1]), units[match[2]?.toLowerCase()] ?? 1);
}

function checkRect(element, rect) {
  requireElement(element);
  if (rect === null || typeof rect !== "object") return false;
  return Number(rect.x) <= 0 && Number(rect.y) <= 0
    && Number(rect.width) >= 0 && Number(rect.height) >= 0;
}

function getter(name, read) {
  const callback = function () {
    const result = read(this);
    traceCall(`window.SVGSVGElement.prototype.${name}`, "SVGSVGElement", [], result);
    return result;
  };
  registerNativeGetter(callback, name);
  return callback;
}

function method(name, arity, operation) {
  const callback = {
    [name](...args) {
      const element = requireElement(this);
      if (element.localName !== "svg") throw new TypeError("Illegal invocation");
      const result = operation(this, args);
      traceCall(`window.SVGSVGElement.prototype.${name}`, "SVGSVGElement", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}
