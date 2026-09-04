import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import { requireOutput } from "./html-output-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get htmlFor() {
    const result = requireOutput(this).htmlFor;
    traceGetter("window.HTMLOutputElement.prototype.htmlFor", "HTMLOutputElement", result);
    return result;
  },
  set htmlFor(value) {
    requireOutput(this).htmlFor.value = `${value}`;
  },
}, "htmlFor");
export const htmlFor = descriptor.get;
export const setHtmlFor = descriptor.set;
registerNativeGetter(htmlFor, "htmlFor");
registerNativeFunction(setHtmlFor, "set htmlFor");
