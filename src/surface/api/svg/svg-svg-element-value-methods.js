import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireElement } from "../dom/element-state.js";
import {
  createSVGAngle,
  createSVGLength,
  createSVGMatrix,
  createSVGNumber,
  createSVGPoint,
  createSVGRect,
  createSVGTransform,
} from "./svg-value-state.js";

export const createSVGAngleMethod = factoryMethod("createSVGAngle", 0, () =>
  createSVGAngle());
export const createSVGLengthMethod = factoryMethod("createSVGLength", 0, () =>
  createSVGLength());
export const createSVGMatrixMethod = factoryMethod("createSVGMatrix", 0, () =>
  createSVGMatrix());
export const createSVGNumberMethod = factoryMethod("createSVGNumber", 0, () =>
  createSVGNumber());
export const createSVGPointMethod = factoryMethod("createSVGPoint", 0, () =>
  createSVGPoint());
export const createSVGRectMethod = factoryMethod("createSVGRect", 0, () =>
  createSVGRect());
export const createSVGTransformMethod = factoryMethod("createSVGTransform", 0, () =>
  createSVGTransform());
export const createSVGTransformFromMatrixMethod = factoryMethod(
  "createSVGTransformFromMatrix",
  1,
  args => createSVGTransform(args[0]),
);

function factoryMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      const element = requireElement(this);
      if (element.localName !== "svg") throw new TypeError("Illegal invocation");
      const result = operation(args);
      traceCall(`window.SVGSVGElement.prototype.${name}`, "SVGSVGElement", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}
