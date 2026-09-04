import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import {
  progressMaximum,
  setProgressNumber,
} from "./html-progress-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get max() {
    requireElement(this);
    const result = progressMaximum(this);
    traceGetter(
      "window.HTMLProgressElement.prototype.max",
      "HTMLProgressElement",
      result,
    );
    return result;
  },
  set max(value) {
    requireElement(this);
    setProgressNumber(this, "max", value);
  },
}, "max");

export const max = descriptor.get;
export const setMax = descriptor.set;
registerNativeGetter(max, "max");
registerNativeFunction(setMax, "set max");
