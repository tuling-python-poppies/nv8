import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
export const decode = {
  decode() {
    requireElement(this);
    const result = Promise.resolve();
    traceCall("window.HTMLImageElement.prototype.decode", "HTMLImageElement", [], result);
    return result;
  },
}.decode;
registerNativeFunction(decode, "decode");
