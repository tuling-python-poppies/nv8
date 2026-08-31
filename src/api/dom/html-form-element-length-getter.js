import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { formControls } from "./html-form-element-state.js";

export const length = Object.getOwnPropertyDescriptor({
  get length() {
    const result = formControls(this).length;
    traceGetter("window.HTMLFormElement.prototype.length", "HTMLFormElement", result);
    return result;
  },
}, "length").get;
registerNativeGetter(length, "length");
