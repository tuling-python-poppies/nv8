import { traceCall } from "../../../infra/trace/trace-function.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import {
  componentIs2D,
  createComponentDOMMatrix,
  createTransformDOMMatrix,
  readCSSTransformValue,
  requireCSSPositionValue,
  requireCSSTransformComponent,
  requireCSSTransformValue,
  serializeCSSTransformComponent,
  transformValueIs2D,
} from "./css-transform-state.js";

export const componentIs2DGetter = getter(
  "CSSTransformComponent",
  "is2D",
  value => componentIs2D(value),
);
export const componentToMatrix = method(
  "CSSTransformComponent",
  "toMatrix",
  0,
  value => createComponentDOMMatrix(value),
);
export const componentToString = method(
  "CSSTransformComponent",
  "toString",
  0,
  value => serializeCSSTransformComponent(value),
);

export const matrix = componentGetter("CSSMatrixComponent", "matrix", record => record.matrix);
export const perspectiveLength = componentGetter(
  "CSSPerspective",
  "length",
  record => record.length,
);
export const angle = componentGetter("CSSRotate", "angle", record => record.angle);
export const x = interfaceName => componentGetter(interfaceName, "x", record => record.x);
export const y = interfaceName => componentGetter(interfaceName, "y", record => record.y);
export const z = interfaceName => componentGetter(interfaceName, "z", record => record.z);
export const ax = interfaceName => componentGetter(interfaceName, "ax", record => record.ax);
export const ay = interfaceName => componentGetter(interfaceName, "ay", record => record.ay);

export const transformEntries = method(
  "CSSTransformValue",
  "entries",
  0,
  value => readCSSTransformValue(value).entries(),
);
export const transformKeys = method(
  "CSSTransformValue",
  "keys",
  0,
  value => readCSSTransformValue(value).keys(),
);
export const transformValues = method(
  "CSSTransformValue",
  "values",
  0,
  value => readCSSTransformValue(value).values(),
);
export const transformForEach = method(
  "CSSTransformValue",
  "forEach",
  1,
  (value, args) => {
    const callback = args[0];
    if (typeof callback !== "function") throw new TypeError("Callback must be callable");
    const thisArg = args[1];
    readCSSTransformValue(value).forEach((component, index) => {
      Reflect.apply(callback, thisArg, [component, index, value]);
    });
  },
);
export const transformLength = getter(
  "CSSTransformValue",
  "length",
  value => requireCSSTransformValue(value).length,
);
export const transformIs2D = getter(
  "CSSTransformValue",
  "is2D",
  value => transformValueIs2D(value),
);
export const transformToMatrix = method(
  "CSSTransformValue",
  "toMatrix",
  0,
  value => createTransformDOMMatrix(value),
);
export const positionX = getter(
  "CSSPositionValue",
  "x",
  value => requireCSSPositionValue(value).x,
);
export const positionY = getter(
  "CSSPositionValue",
  "y",
  value => requireCSSPositionValue(value).y,
);

function componentGetter(interfaceName, name, read) {
  return getter(interfaceName, name, value => read(requireCSSTransformComponent(value)));
}

function getter(interfaceName, name, read) {
  const callback = function () {
    const result = read(this);
    traceCall(`window.${interfaceName}.prototype.${name}`, interfaceName, [], result);
    return result;
  };
  registerNativeGetter(callback, name);
  return callback;
}

function method(interfaceName, name, arity, operation) {
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
