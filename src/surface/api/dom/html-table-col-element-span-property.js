import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import {
  getAttributeValue,
  requireElement,
  setAttributeValue,
} from "./element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get span() {
    requireElement(this);
    const parsed = Number.parseInt(getAttributeValue(this, "span") ?? "", 10);
    const result = Number.isFinite(parsed) && parsed >= 1 && parsed <= 1000
      ? parsed
      : 1;
    traceGetter(
      "window.HTMLTableColElement.prototype.span",
      "HTMLTableColElement",
      result,
    );
    return result;
  },
  set span(value) {
    requireElement(this);
    setAttributeValue(this, "span", `${Number(value) >>> 0}`);
  },
}, "span");

export const span = descriptor.get;
export const setSpan = descriptor.set;
registerNativeGetter(span, "span");
registerNativeFunction(setSpan, "set span");
