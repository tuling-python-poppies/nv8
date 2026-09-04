import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { meterOptimum, setMeterNumber } from "./html-meter-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get optimum() {
    requireElement(this);
    const result = meterOptimum(this);
    traceGetter("window.HTMLMeterElement.prototype.optimum", "HTMLMeterElement", result);
    return result;
  },
  set optimum(value) {
    requireElement(this);
    setMeterNumber(this, "optimum", value);
  },
}, "optimum");
export const optimum = descriptor.get;
export const setOptimum = descriptor.set;
registerNativeGetter(optimum, "optimum");
registerNativeFunction(setOptimum, "set optimum");
