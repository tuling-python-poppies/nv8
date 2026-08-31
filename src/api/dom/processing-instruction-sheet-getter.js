import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import {
  requireProcessingInstruction,
} from "./processing-instruction-constructor.js";

export const sheet = Object.getOwnPropertyDescriptor({
  get sheet() {
    requireProcessingInstruction(this);
    const result = null;
    traceGetter(
      "window.ProcessingInstruction.prototype.sheet",
      "ProcessingInstruction",
      result,
    );
    return result;
  },
}, "sheet").get;
registerNativeGetter(sheet, "sheet");
