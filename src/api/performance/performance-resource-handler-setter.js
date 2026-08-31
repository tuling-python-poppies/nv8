import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requirePerformance } from "./performance-state.js";

export const performanceResourceHandler = {
  performanceResourceHandler(value) {
  const state = requirePerformance(this);
  state.onresourcetimingbufferfull = value === undefined || value === null
    ? null
    : value;
  traceCall(
    "window.Performance.prototype.onresourcetimingbufferfull",
    "Performance",
    [value],
    undefined,
  );

  },
}.performanceResourceHandler;

Object.defineProperty(performanceResourceHandler, "name", {
  value: "set onresourcetimingbufferfull",
  configurable: true,
});
registerNativeFunction(
  performanceResourceHandler,
  "set onresourcetimingbufferfull",
);
