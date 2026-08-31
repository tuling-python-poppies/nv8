import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { meterMaximum, setMeterNumber } from "./html-meter-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get max() {
    requireElement(this);
    const result = meterMaximum(this);
    traceGetter("window.HTMLMeterElement.prototype.max", "HTMLMeterElement", result);
    return result;
  },
  set max(value) {
    requireElement(this);
    setMeterNumber(this, "max", value);
  },
}, "max");
export const max = descriptor.get;
export const setMax = descriptor.set;
registerNativeGetter(max, "max");
registerNativeFunction(setMax, "set max");
