import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformance } from "./performance-state.js";

export const toJSON = {
  toJSON() {
  const result = {
    timeOrigin: requirePerformance(this).timeOrigin,
  };
  traceCall(
    "window.Performance.prototype.toJSON",
    "Performance",
    [],
    result,
  );
  return result;

  },
}.toJSON;

registerNativeFunction(toJSON, "toJSON");

export function installPerformanceToJSON() {
  definePrototypeMethod(Performance.prototype, "toJSON", toJSON);
}
