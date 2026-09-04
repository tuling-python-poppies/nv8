import { traceCall } from "../../../infra/trace/trace-function.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import {
  convertSpecifiedUnits,
  createSVGMatrix,
  inverseSVGMatrix,
  matrixValues,
  multiplySVGMatrix,
  requireSVGValue,
  setSpecifiedUnits,
  specifiedValue,
  specifiedValueAsString,
  transformSVGPoint,
  transformedSVGMatrix,
  setSVGTransform,
} from "./svg-value-state.js";

export const numberValue = getter("SVGNumber", "value", value =>
  requireSVGValue(value, "number").value);
export const pointX = getter("SVGPoint", "x", value => requireSVGValue(value, "point").x);
export const pointY = getter("SVGPoint", "y", value => requireSVGValue(value, "point").y);
export const pointMatrixTransform = method(
  "SVGPoint",
  "matrixTransform",
  1,
  (value, args) => transformSVGPoint(value, args[0]),
);
export const rectX = getter("SVGRect", "x", value => requireSVGValue(value, "rect").x);
export const rectY = getter("SVGRect", "y", value => requireSVGValue(value, "rect").y);
export const rectWidth = getter(
  "SVGRect",
  "width",
  value => requireSVGValue(value, "rect").width,
);
export const rectHeight = getter(
  "SVGRect",
  "height",
  value => requireSVGValue(value, "rect").height,
);

export const lengthUnitType = specifiedGetter("SVGLength", "unitType", "length", record =>
  record.unitType);
export const lengthValue = specifiedGetter("SVGLength", "value", "length", (_record, value) =>
  specifiedValue(value, "length"));
export const lengthValueInSpecifiedUnits = specifiedGetter(
  "SVGLength",
  "valueInSpecifiedUnits",
  "length",
  record => record.valueInSpecifiedUnits,
);
export const lengthValueAsString = specifiedGetter(
  "SVGLength",
  "valueAsString",
  "length",
  (_record, value) => specifiedValueAsString(value, "length"),
);
export const lengthConvert = method(
  "SVGLength",
  "convertToSpecifiedUnits",
  1,
  (value, args) => convertSpecifiedUnits(value, "length", args[0]),
);
export const lengthNewValue = method(
  "SVGLength",
  "newValueSpecifiedUnits",
  2,
  (value, args) => setSpecifiedUnits(value, "length", args[0], args[1]),
);

export const angleUnitType = specifiedGetter("SVGAngle", "unitType", "angle", record =>
  record.unitType);
export const angleValue = specifiedGetter("SVGAngle", "value", "angle", (_record, value) =>
  specifiedValue(value, "angle"));
export const angleValueInSpecifiedUnits = specifiedGetter(
  "SVGAngle",
  "valueInSpecifiedUnits",
  "angle",
  record => record.valueInSpecifiedUnits,
);
export const angleValueAsString = specifiedGetter(
  "SVGAngle",
  "valueAsString",
  "angle",
  (_record, value) => specifiedValueAsString(value, "angle"),
);
export const angleConvert = method(
  "SVGAngle",
  "convertToSpecifiedUnits",
  1,
  (value, args) => convertSpecifiedUnits(value, "angle", args[0]),
);
export const angleNewValue = method(
  "SVGAngle",
  "newValueSpecifiedUnits",
  2,
  (value, args) => setSpecifiedUnits(value, "angle", args[0], args[1]),
);

export const matrixGetters = ["a", "b", "c", "d", "e", "f"].map((name, index) => [
  name,
  getter("SVGMatrix", name, value => matrixValues(value)[index]),
]);
export const matrixFlipX = matrixMethod("flipX", 0, value =>
  multiplySVGMatrix(value, createSVGMatrix([-1, 0, 0, 1, 0, 0])));
export const matrixFlipY = matrixMethod("flipY", 0, value =>
  multiplySVGMatrix(value, createSVGMatrix([1, 0, 0, -1, 0, 0])));
export const matrixInverse = matrixMethod("inverse", 0, value => inverseSVGMatrix(value));
export const matrixMultiply = matrixMethod(
  "multiply",
  1,
  (value, args) => multiplySVGMatrix(value, args[0]),
);
export const matrixRotate = transformMethod("rotate", 1);
export const matrixRotateFromVector = transformMethod("rotateFromVector", 2);
export const matrixScale = transformMethod("scale", 1);
export const matrixScaleNonUniform = transformMethod("scaleNonUniform", 2);
export const matrixSkewX = transformMethod("skewX", 1);
export const matrixSkewY = transformMethod("skewY", 1);
export const matrixTranslate = transformMethod("translate", 2);

export const transformType = getter(
  "SVGTransform",
  "type",
  value => requireSVGValue(value, "transform").type,
);
export const transformMatrix = getter(
  "SVGTransform",
  "matrix",
  value => requireSVGValue(value, "transform").matrix,
);
export const transformAngle = getter(
  "SVGTransform",
  "angle",
  value => requireSVGValue(value, "transform").angle,
);
export const transformSetMatrix = svgTransformMethod("setMatrix", 1);
export const transformSetRotate = svgTransformMethod("setRotate", 3);
export const transformSetScale = svgTransformMethod("setScale", 2);
export const transformSetSkewX = svgTransformMethod("setSkewX", 1);
export const transformSetSkewY = svgTransformMethod("setSkewY", 1);
export const transformSetTranslate = svgTransformMethod("setTranslate", 2);
export const preserveAspectRatioAlign = getter(
  "SVGPreserveAspectRatio",
  "align",
  value => requireSVGValue(value, "preserveAspectRatio").align,
);
export const preserveAspectRatioMeetOrSlice = getter(
  "SVGPreserveAspectRatio",
  "meetOrSlice",
  value => requireSVGValue(value, "preserveAspectRatio").meetOrSlice,
);

function specifiedGetter(interfaceName, name, kind, read) {
  return getter(interfaceName, name, value => read(requireSVGValue(value, kind), value));
}

function matrixMethod(name, arity, operation) {
  return method("SVGMatrix", name, arity, operation);
}

function transformMethod(name, arity) {
  return matrixMethod(name, arity, (value, args) =>
    transformedSVGMatrix(value, name, args));
}

function svgTransformMethod(name, arity) {
  return method("SVGTransform", name, arity, (value, args) =>
    setSVGTransform(value, name, args));
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
