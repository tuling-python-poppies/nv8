import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { DOMMatrixReadOnly } from "./dom-matrix-read-only-constructor.js";
import {
  initializeDOMMatrix,
  matrixFromValue,
} from "./dom-matrix-state.js";

export function DOMMatrix() {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'DOMMatrix': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  initializeDOMMatrix(this, matrixFromValue(arguments[0]));
  traceConstruct(
    "window.DOMMatrix",
    arguments[0] === undefined ? [] : [arguments[0]],
    "DOMMatrix",
  );
}
registerNativeFunction(DOMMatrix, "DOMMatrix");

export function createDOMMatrix(values) {
  const matrix = Object.create(DOMMatrix.prototype);
  initializeDOMMatrix(matrix, values);
  return matrix;
}

export function installDOMMatrixConstructor() {
  Object.setPrototypeOf(DOMMatrix.prototype, DOMMatrixReadOnly.prototype);
  Object.setPrototypeOf(DOMMatrix, DOMMatrixReadOnly);
  delete DOMMatrix.prototype.constructor;
  defineGlobalConstructor("DOMMatrix", DOMMatrix);
}
