import { traceGetter } from "../../trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import {
  progressValue,
  setProgressNumber,
} from "./html-progress-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get value() {
    requireElement(this);
    const result = progressValue(this);
    traceGetter(
      "window.HTMLProgressElement.prototype.value",
      "HTMLProgressElement",
      result,
    );
    return result;
  },
  set value(value) {
    requireElement(this);
    setProgressNumber(this, "value", value);
  },
}, "value");

export const value = descriptor.get;
export const setValue = descriptor.set;
registerNativeGetter(value, "value");
registerNativeFunction(setValue, "set value");
