import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { meterHigh, setMeterNumber } from "./html-meter-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get high() {
    requireElement(this);
    const result = meterHigh(this);
    traceGetter("window.HTMLMeterElement.prototype.high", "HTMLMeterElement", result);
    return result;
  },
  set high(value) {
    requireElement(this);
    setMeterNumber(this, "high", value);
  },
}, "high");
export const high = descriptor.get;
export const setHigh = descriptor.set;
registerNativeGetter(high, "high");
registerNativeFunction(setHigh, "set high");
