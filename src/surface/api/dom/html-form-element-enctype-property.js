import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import {
  normalizedEnctype,
  requireForm,
} from "./html-form-element-state.js";

export function normalizeEnctype(value) {
  const normalized = `${value}`.toLowerCase();
  return normalized === "multipart/form-data" || normalized === "text/plain"
    ? normalized
    : "application/x-www-form-urlencoded";
}

const descriptor = Object.getOwnPropertyDescriptor({
  get enctype() {
    const result = normalizedEnctype(this);
    traceGetter("window.HTMLFormElement.prototype.enctype", "HTMLFormElement", result);
    return result;
  },
  set enctype(value) {
    requireForm(this);
    this.setAttribute("enctype", normalizeEnctype(value));
  },
}, "enctype");
export const enctype = descriptor.get;
export const setEnctype = descriptor.set;
registerNativeGetter(enctype, "enctype");
registerNativeFunction(setEnctype, "set enctype");
