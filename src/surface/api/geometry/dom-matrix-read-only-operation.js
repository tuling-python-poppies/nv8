import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createDOMMatrix } from "./dom-matrix-constructor.js";
import { requireDOMMatrix } from "./dom-matrix-state.js";

export function readonlyMatrixOperation(methodName, operation) {
  const callback = {
    [methodName](...args) {
      const result = createDOMMatrix(operation([...requireDOMMatrix(this)], args));
      traceCall(
        `window.DOMMatrixReadOnly.prototype.${methodName}`,
        "DOMMatrixReadOnly",
        args,
        result,
      );
      return result;
    },
  }[methodName];
  registerNativeFunction(callback, methodName);
  return callback;
}

export function readonlyMatrixValueOperation(methodName, operation) {
  const callback = {
    [methodName](...args) {
      const result = operation([...requireDOMMatrix(this)], args);
      traceCall(
        `window.DOMMatrixReadOnly.prototype.${methodName}`,
        "DOMMatrixReadOnly",
        args,
        result,
      );
      return result;
    },
  }[methodName];
  registerNativeFunction(callback, methodName);
  return callback;
}

export function optionalNumber(args, index, fallback) {
  return args[index] === undefined ? fallback : Number(args[index]);
}
