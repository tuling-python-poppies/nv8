import { traceGetter } from "../../trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";

const disabledElements = new WeakSet();
const descriptor = Object.getOwnPropertyDescriptor({
  get disabled() {
    requireElement(this);
    const result = disabledElements.has(this);
    traceGetter(
      "window.HTMLStyleElement.prototype.disabled",
      "HTMLStyleElement",
      result,
    );
    return result;
  },
  set disabled(value) {
    requireElement(this);
    if (Boolean(value)) {
      disabledElements.add(this);
    } else {
      disabledElements.delete(this);
    }
  },
}, "disabled");

export const disabled = descriptor.get;
export const setDisabled = descriptor.set;
registerNativeGetter(disabled, "disabled");
registerNativeFunction(setDisabled, "set disabled");
