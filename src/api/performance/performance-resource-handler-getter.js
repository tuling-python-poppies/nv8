import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requirePerformance } from "./performance-state.js";

export const performanceResourceHandler = {
  performanceResourceHandler() {
  const value = requirePerformance(this).onresourcetimingbufferfull;
  traceGetter(
    "window.Performance.prototype.onresourcetimingbufferfull",
    "Performance",
    value,
  );
  return value;

  },
}.performanceResourceHandler;

registerNativeGetter(
  performanceResourceHandler,
  "onresourcetimingbufferfull",
);
