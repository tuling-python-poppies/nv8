import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireDOMMatrix } from "./dom-matrix-state.js";

export function matrixSelfOperation(methodName, operation) {
  const callback = {
    [methodName](...args) {
      const matrix = requireDOMMatrix(this);
      const result = operation([...matrix], args);
      matrix.splice(0, matrix.length, ...result);
      traceCall(
        `window.DOMMatrix.prototype.${methodName}`,
        "DOMMatrix",
        args,
        this,
      );
      return this;
    },
  }[methodName];
  registerNativeFunction(callback, methodName);
  return callback;
}

export function optionalNumber(args, index, fallback) {
  return args[index] === undefined ? fallback : Number(args[index]);
}
