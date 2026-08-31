import { createDOMMatrix } from "../geometry/dom-matrix-constructor.js";
import { identityMatrix } from "../geometry/dom-matrix-state.js";
import { createDOMRect } from "../geometry/dom-rect-constructor.js";
import { traceCall } from "../../trace/trace-function.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import { getAttributeValue, requireElement } from "../dom/element-state.js";
import { requireNode } from "../dom/node-state.js";
import {
  SVGAnimatedTransformList,
  createSVGAnimatedValue,
} from "./svg-animated-values.js";
import { createSVGList } from "./svg-list-state.js";

const state = new WeakMap();

export const transform = getter("transform", value => record(value).transform);
export const nearestViewportElement = getter(
  "nearestViewportElement",
  value => viewportElements(value).at(0) ?? null,
);
export const farthestViewportElement = getter(
  "farthestViewportElement",
  value => viewportElements(value).at(-1) ?? null,
);
export const requiredExtensions = getter(
  "requiredExtensions",
  value => record(value).requiredExtensions,
);
export const systemLanguage = getter(
  "systemLanguage",
  value => record(value).systemLanguage,
);
export const getBBox = method("getBBox", 0, () => createDOMRect(0, 0, 0, 0));
export const getCTM = method("getCTM", 0, () => createDOMMatrix(identityMatrix()));
export const getScreenCTM = method(
  "getScreenCTM",
  0,
  () => createDOMMatrix(identityMatrix()),
);

function record(value) {
  requireElement(value);
  let result = state.get(value);
  if (result === undefined) {
    const transforms = createSVGList("transform");
    result = {
      transform: createSVGAnimatedValue(
        SVGAnimatedTransformList,
        transforms,
        transforms,
      ),
      requiredExtensions: createSVGList(
        "string",
        splitList(getAttributeValue(value, "requiredExtensions")),
      ),
      systemLanguage: createSVGList(
        "string",
        splitList(getAttributeValue(value, "systemLanguage")),
      ),
    };
    state.set(value, result);
  }
  return result;
}

function viewportElements(value) {
  requireElement(value);
  const result = [];
  let parent = requireNode(value).parent;
  while (parent !== null) {
    try {
      const element = requireElement(parent);
      if (element.namespaceURI === "http://www.w3.org/2000/svg"
        && element.localName === "svg") result.push(parent);
    } catch {
      // Non-element ancestors are skipped.
    }
    parent = requireNode(parent).parent;
  }
  return result;
}

function splitList(value) {
  return value === null ? [] : value.split(/[\s,]+/u).filter(Boolean);
}

function getter(name, read) {
  const callback = function () {
    const result = read(this);
    traceCall(`window.SVGGraphicsElement.prototype.${name}`, "SVGGraphicsElement", [], result);
    return result;
  };
  registerNativeGetter(callback, name);
  return callback;
}

function method(name, arity, operation) {
  const callback = {
    [name](...args) {
      requireElement(this);
      const result = operation(this, args);
      traceCall(`window.SVGGraphicsElement.prototype.${name}`, "SVGGraphicsElement", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}
