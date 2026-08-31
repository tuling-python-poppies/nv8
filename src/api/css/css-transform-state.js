import { createDOMMatrix } from "../geometry/dom-matrix-constructor.js";
import {
  identityMatrix,
  is2DMatrix,
  matrixFromValue,
  multiplyMatrices,
} from "../geometry/dom-matrix-state.js";
import { initializeCSSStyleValue, requireCSSStyleValue } from "./css-style-value-state.js";
import {
  convertCSSUnitValue,
  normalizeNumericValue,
  requireCSSNumericValue,
  requireCSSUnitValue,
} from "./css-typed-om-state.js";
import { CSSUnitValue } from "./css-typed-om-constructors.js";
import { CSSTransformComponent } from "./css-transform-constructors.js";

const componentState = new WeakMap();
const transformValueState = new WeakMap();
const positionState = new WeakMap();

export function initializeCSSMatrixComponent(value, matrix) {
  const values = matrixFromValue(matrix);
  return initializeComponent(value, {
    type: "matrix",
    matrix: createDOMMatrix(values),
    matrixValues: values,
  });
}

export function initializeCSSPerspective(value, length) {
  const normalized = numericWithDimension(length, ["length"]);
  return initializeComponent(value, { type: "perspective", length: normalized });
}

export function initializeCSSRotate(value, args) {
  let x;
  let y;
  let z;
  let angle;
  if (args.length <= 1) {
    x = new CSSUnitValue(0, "number");
    y = new CSSUnitValue(0, "number");
    z = new CSSUnitValue(1, "number");
    angle = numericWithDimension(args[0], ["angle"]);
  } else {
    x = numericWithDimension(args[0], ["number"]);
    y = numericWithDimension(args[1], ["number"]);
    z = numericWithDimension(args[2], ["number"]);
    angle = numericWithDimension(args[3], ["angle"]);
  }
  return initializeComponent(value, { type: "rotate", x, y, z, angle });
}

export function initializeCSSScale(value, x, y, z) {
  return initializeComponent(value, {
    type: "scale",
    x: numericWithDimension(x, ["number", "percent"]),
    y: numericWithDimension(y, ["number", "percent"]),
    z: numericWithDimension(z === undefined ? 1 : z, ["number", "percent"]),
  });
}

export function initializeCSSSkew(value, type, ax, ay) {
  const record = {
    type,
    ax: numericWithDimension(ax, ["angle"]),
  };
  if (type === "skew") record.ay = numericWithDimension(ay, ["angle"]);
  else if (type === "skewY") {
    record.ay = record.ax;
    delete record.ax;
  }
  return initializeComponent(value, record);
}

export function initializeCSSTranslate(value, x, y, z) {
  return initializeComponent(value, {
    type: "translate",
    x: numericWithDimension(x, ["length", "percent"]),
    y: numericWithDimension(y, ["length", "percent"]),
    z: numericWithDimension(z === undefined ? new CSSUnitValue(0, "px") : z, ["length"]),
  });
}

export function initializeCSSTransformValue(value, components) {
  if (components === null || components === undefined
    || typeof components[Symbol.iterator] !== "function") {
    throw new TypeError("The components must be iterable");
  }
  const values = [];
  for (const component of components) {
    requireCSSTransformComponent(component);
    values.push(component);
  }
  transformValueState.set(value, values);
  for (let index = 0; index < values.length; index += 1) {
    Object.defineProperty(value, index, {
      value: values[index],
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
  initializeCSSStyleValue(value, () =>
    readCSSTransformValue(value).map(serializeCSSTransformComponent).join(" "));
  return value;
}

export function initializeCSSPositionValue(value, x, y) {
  const record = {
    x: numericWithDimension(x, ["length", "percent"]),
    y: numericWithDimension(y, ["length", "percent"]),
  };
  positionState.set(value, record);
  initializeCSSStyleValue(
    value,
    () => `${requireCSSStyleValue(record.x)} ${requireCSSStyleValue(record.y)}`,
  );
  return value;
}

export function requireCSSTransformComponent(value) {
  const record = componentState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function requireCSSTransformValue(value) {
  const values = transformValueState.get(value);
  if (values === undefined) throw new TypeError("Illegal invocation");
  return values;
}

export function readCSSTransformValue(value) {
  const values = requireCSSTransformValue(value);
  return values.map((_component, index) => {
    const component = value[index];
    requireCSSTransformComponent(component);
    return component;
  });
}

export function requireCSSPositionValue(value) {
  const record = positionState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function componentMatrix(value) {
  const record = requireCSSTransformComponent(value);
  if (record.type === "matrix") return [...record.matrixValues];
  if (record.type === "perspective") {
    const matrix = identityMatrix();
    matrix[11] = -1 / lengthInPixels(record.length);
    return matrix;
  }
  if (record.type === "translate") {
    const matrix = identityMatrix();
    matrix[12] = lengthInPixels(record.x);
    matrix[13] = lengthInPixels(record.y);
    matrix[14] = lengthInPixels(record.z);
    return matrix;
  }
  if (record.type === "scale") {
    const matrix = identityMatrix();
    matrix[0] = unitNumber(record.x);
    matrix[5] = unitNumber(record.y);
    matrix[10] = unitNumber(record.z);
    return matrix;
  }
  if (record.type === "rotate") {
    return axisAngleMatrix(
      unitNumber(record.x),
      unitNumber(record.y),
      unitNumber(record.z),
      angleInDegrees(record.angle),
    );
  }
  const matrix = identityMatrix();
  if (record.type === "skew" || record.type === "skewX") {
    matrix[4] = Math.tan(angleInDegrees(record.ax) * Math.PI / 180);
  }
  if (record.type === "skew" || record.type === "skewY") {
    matrix[1] = Math.tan(angleInDegrees(record.ay) * Math.PI / 180);
  }
  return matrix;
}

export function transformValueMatrix(value) {
  return readCSSTransformValue(value).reduce(
    (matrix, component) => multiplyMatrices(matrix, componentMatrix(component)),
    identityMatrix(),
  );
}

export function componentIs2D(value) {
  return is2DMatrix(componentMatrix(value));
}

export function transformValueIs2D(value) {
  return readCSSTransformValue(value).every(componentIs2D);
}

export function serializeCSSTransformComponent(value) {
  const record = requireCSSTransformComponent(value);
  if (record.type === "matrix") return record.matrix.toString();
  if (record.type === "perspective") return `perspective(${requireCSSStyleValue(record.length)})`;
  if (record.type === "translate") {
    const parts = [record.x, record.y, record.z].map(requireCSSStyleValue);
    return componentIs2D(value) && requireCSSUnitValue(record.z).value === 0
      ? `translate(${parts[0]}, ${parts[1]})`
      : `translate3d(${parts.join(", ")})`;
  }
  if (record.type === "scale") {
    const parts = [record.x, record.y, record.z].map(requireCSSStyleValue);
    return componentIs2D(value) && unitNumber(record.z) === 1
      ? `scale(${parts[0]}, ${parts[1]})`
      : `scale3d(${parts.join(", ")})`;
  }
  if (record.type === "rotate") {
    const angle = requireCSSStyleValue(record.angle);
    if (unitNumber(record.x) === 0 && unitNumber(record.y) === 0 && unitNumber(record.z) === 1) {
      return `rotate(${angle})`;
    }
    return `rotate3d(${unitNumber(record.x)}, ${unitNumber(record.y)}, ${unitNumber(record.z)}, ${angle})`;
  }
  if (record.type === "skew") {
    return `skew(${requireCSSStyleValue(record.ax)}, ${requireCSSStyleValue(record.ay)})`;
  }
  const field = record.type === "skewX" ? record.ax : record.ay;
  return `${record.type}(${requireCSSStyleValue(field)})`;
}

export function createComponentDOMMatrix(value) {
  return createDOMMatrix(componentMatrix(value));
}

export function createTransformDOMMatrix(value) {
  return createDOMMatrix(transformValueMatrix(value));
}

function initializeComponent(value, record) {
  if (!(value instanceof CSSTransformComponent)) throw new TypeError("Illegal receiver");
  componentState.set(value, record);
  return value;
}

function numericWithDimension(value, accepted) {
  const normalized = normalizeNumericValue(value);
  const record = requireCSSUnitValue(normalized);
  const dimension = unitDimension(record.unit);
  if (!accepted.includes(dimension)) throw new TypeError("Incompatible numeric value");
  return normalized;
}

function unitDimension(unit) {
  if (["px", "cm", "mm", "q", "in", "pc", "pt", "em", "rem", "vw", "vh", "vmin", "vmax"].includes(unit)) return "length";
  if (["deg", "grad", "rad", "turn"].includes(unit)) return "angle";
  if (unit === "percent") return "percent";
  return "number";
}

function lengthInPixels(value) {
  const record = requireCSSUnitValue(value);
  if (record.unit === "percent") return record.value;
  if (["em", "rem", "vw", "vh", "vmin", "vmax"].includes(record.unit)) return record.value;
  return convertCSSUnitValue(value, "px").value;
}

function angleInDegrees(value) {
  return convertCSSUnitValue(value, "deg").value;
}

function unitNumber(value) {
  const record = requireCSSUnitValue(value);
  return record.unit === "percent" ? record.value / 100 : record.value;
}

function axisAngleMatrix(x, y, z, degrees) {
  const length = Math.hypot(x, y, z);
  if (length === 0) return identityMatrix();
  x /= length;
  y /= length;
  z /= length;
  const radians = degrees * Math.PI / 180;
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  const t = 1 - cos;
  return [
    t * x * x + cos, t * x * y + sin * z, t * x * z - sin * y, 0,
    t * x * y - sin * z, t * y * y + cos, t * y * z + sin * x, 0,
    t * x * z + sin * y, t * y * z - sin * x, t * z * z + cos, 0,
    0, 0, 0, 1,
  ];
}
