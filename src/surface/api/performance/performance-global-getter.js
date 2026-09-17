import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { currentPerformance } from "./performance-state.js";

const globalPerformance = {
  globalPerformance() {
  const value = currentPerformance();
  traceGetter("window.performance", "Window", value);
  return value;

  },
}.globalPerformance;

registerNativeGetter(globalPerformance, "performance");

export function installGlobalPerformance() {
  currentPerformance();
  Object.defineProperty(globalThis, "performance", {
    get: globalPerformance,
    enumerable: true,
    configurable: true,
  });
}
