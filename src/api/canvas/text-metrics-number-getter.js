import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextMetrics } from "./text-metrics-state.js";

export function textMetricsNumberGetter(propertyName) {
  const getter = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireTextMetrics(this)[propertyName];
      traceGetter(
        `window.TextMetrics.prototype.${propertyName}`,
        "TextMetrics",
        result,
      );
      return result;
    },
  }, propertyName).get;
  registerNativeGetter(getter, propertyName);
  return getter;
}
