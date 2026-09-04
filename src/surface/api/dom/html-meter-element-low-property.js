import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { meterLow, setMeterNumber } from "./html-meter-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get low() {
    requireElement(this);
    const result = meterLow(this);
    traceGetter("window.HTMLMeterElement.prototype.low", "HTMLMeterElement", result);
    return result;
  },
  set low(value) {
    requireElement(this);
    setMeterNumber(this, "low", value);
  },
}, "low");
export const low = descriptor.get;
export const setLow = descriptor.set;
registerNativeGetter(low, "low");
registerNativeFunction(setLow, "set low");
