import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { inputWillValidate } from "./html-input-element-state.js";
export const willValidate = Object.getOwnPropertyDescriptor({
  get willValidate() {
    const result = inputWillValidate(this);
    traceGetter("window.HTMLInputElement.prototype.willValidate", "HTMLInputElement", result);
    return result;
  },
}, "willValidate").get;
registerNativeGetter(willValidate, "willValidate");
