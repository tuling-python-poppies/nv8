import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { meterValue, setMeterNumber } from "./html-meter-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get value() {
    requireElement(this);
    const result = meterValue(this);
    traceGetter("window.HTMLMeterElement.prototype.value", "HTMLMeterElement", result);
    return result;
  },
  set value(value) {
    requireElement(this);
    setMeterNumber(this, "value", value);
  },
}, "value");
export const value = descriptor.get;
export const setValue = descriptor.set;
registerNativeGetter(value, "value");
registerNativeFunction(setValue, "set value");
