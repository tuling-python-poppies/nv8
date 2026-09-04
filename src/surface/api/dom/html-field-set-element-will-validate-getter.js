import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireFieldSet } from "./html-field-set-element-state.js";

export const willValidate = Object.getOwnPropertyDescriptor({
  get willValidate() {
    requireFieldSet(this);
    const result = false;
    traceGetter("window.HTMLFieldSetElement.prototype.willValidate", "HTMLFieldSetElement", result);
    return result;
  },
}, "willValidate").get;
registerNativeGetter(willValidate, "willValidate");
