import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { meterMinimum, setMeterNumber } from "./html-meter-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get min() {
    requireElement(this);
    const result = meterMinimum(this);
    traceGetter("window.HTMLMeterElement.prototype.min", "HTMLMeterElement", result);
    return result;
  },
  set min(value) {
    requireElement(this);
    setMeterNumber(this, "min", value);
  },
}, "min");
export const min = descriptor.get;
export const setMin = descriptor.set;
registerNativeGetter(min, "min");
registerNativeFunction(setMin, "set min");
