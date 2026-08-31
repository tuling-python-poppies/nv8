import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireOutput } from "./html-output-element-state.js";

export const type = Object.getOwnPropertyDescriptor({
  get type() {
    requireOutput(this);
    const result = "output";
    traceGetter("window.HTMLOutputElement.prototype.type", "HTMLOutputElement", result);
    return result;
  },
}, "type").get;
registerNativeGetter(type, "type");
