import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";

const values = new WeakMap();
const descriptor = Object.getOwnPropertyDescriptor({
  get interestForElement() {
    requireElement(this);
    const result = values.get(this) ?? null;
    traceGetter(
      "window.HTMLAnchorElement.prototype.interestForElement",
      "HTMLAnchorElement",
      result,
    );
    return result;
  },
  set interestForElement(value) {
    requireElement(this);
    values.set(this, value === null ? null : value);
  },
}, "interestForElement");
export const interestForElement = descriptor.get;
export const setInterestForElement = descriptor.set;
registerNativeGetter(interestForElement, "interestForElement");
registerNativeFunction(
  setInterestForElement,
  "set interestForElement",
);
