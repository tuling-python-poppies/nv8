import { traceGetter } from "../../trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import { normalizeEnctype } from "./html-form-element-enctype-property.js";
import {
  normalizedEnctype,
  requireForm,
} from "./html-form-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get encoding() {
    const result = normalizedEnctype(this);
    traceGetter("window.HTMLFormElement.prototype.encoding", "HTMLFormElement", result);
    return result;
  },
  set encoding(value) {
    requireForm(this);
    this.setAttribute("enctype", normalizeEnctype(value));
  },
}, "encoding");
export const encoding = descriptor.get;
export const setEncoding = descriptor.set;
registerNativeGetter(encoding, "encoding");
registerNativeFunction(setEncoding, "set encoding");
