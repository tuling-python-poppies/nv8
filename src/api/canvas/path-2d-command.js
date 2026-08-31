import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { appendPathCommand } from "./path-2d-state.js";

export function pathCommand(methodName, arity, select) {
  const callback = {
    [methodName](...values) {
      const command = select(values);
      appendPathCommand(this, methodName, command);
      traceCall(
        `window.Path2D.prototype.${methodName}`,
        "Path2D",
        values,
        undefined,
      );
    },
  }[methodName];
  Object.defineProperty(callback, "length", {
    value: arity,
    configurable: true,
  });
  registerNativeFunction(callback, methodName);
  return callback;
}
