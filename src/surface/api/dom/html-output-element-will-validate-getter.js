import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireOutput } from "./html-output-element-state.js";

export const willValidate = Object.getOwnPropertyDescriptor({
  get willValidate() {
    requireOutput(this);
    const result = false;
    traceGetter("window.HTMLOutputElement.prototype.willValidate", "HTMLOutputElement", result);
    return result;
  },
}, "willValidate").get;
registerNativeGetter(willValidate, "willValidate");
