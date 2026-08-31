import { traceConstruct } from "../../trace/trace-function.js";
import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { initializeDOMMatrix, matrixFromValue } from "./dom-matrix-state.js";

export function DOMMatrixReadOnly() {
  if (new.target === undefined) {
    throw new TypeError("DOMMatrixReadOnly must be constructed with new");
  }
  const values = arguments[0] === undefined
    ? matrixFromValue(undefined)
    : matrixFromValue(arguments[0]);
  initializeDOMMatrix(this, values);
  traceConstruct(
    "window.DOMMatrixReadOnly",
    arguments[0] === undefined ? [] : [arguments[0]],
    "DOMMatrixReadOnly",
  );
}
registerNativeFunction(DOMMatrixReadOnly, "DOMMatrixReadOnly");

export function installDOMMatrixReadOnlyConstructor() {
  delete DOMMatrixReadOnly.prototype.constructor;
  defineGlobalConstructor("DOMMatrixReadOnly", DOMMatrixReadOnly);
}
