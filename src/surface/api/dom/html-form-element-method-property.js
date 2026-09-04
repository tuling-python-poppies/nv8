import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import {
  normalizedMethod,
  requireForm,
} from "./html-form-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get method() {
    const result = normalizedMethod(this);
    traceGetter("window.HTMLFormElement.prototype.method", "HTMLFormElement", result);
    return result;
  },
  set method(value) {
    requireForm(this);
    const normalized = `${value}`.toLowerCase();
    this.setAttribute(
      "method",
      normalized === "post" || normalized === "dialog" ? normalized : "get",
    );
  },
}, "method");
export const method = descriptor.get;
export const setMethod = descriptor.set;
registerNativeGetter(method, "method");
registerNativeFunction(setMethod, "set method");
