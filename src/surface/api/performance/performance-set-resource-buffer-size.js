import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformance } from "./performance-state.js";

const setResourceTimingBufferSize = {
  setResourceTimingBufferSize(maxSize) {
  const state = requirePerformance(this);
  const number = Number(maxSize);
  const normalized = Number.isFinite(number)
    ? Math.max(0, Math.min(0xffffffff, Math.trunc(number)))
    : 0;
  state.resourceTimingBufferSize = normalized;
  traceCall(
    "window.Performance.prototype.setResourceTimingBufferSize",
    "Performance",
    [normalized],
    undefined,
  );

  },
}.setResourceTimingBufferSize;

registerNativeFunction(
  setResourceTimingBufferSize,
  "setResourceTimingBufferSize",
);

export function installPerformanceSetResourceTimingBufferSize() {
  definePrototypeMethod(
    Performance.prototype,
    "setResourceTimingBufferSize",
    setResourceTimingBufferSize,
  );
}
