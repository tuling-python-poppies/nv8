import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  processingInstructionAttributes,
} from "./processing-instruction-attributes.js";

export const hasAttributes = {
  hasAttributes() {
    const result = processingInstructionAttributes(this).size > 0;
    traceCall(
      "window.ProcessingInstruction.prototype.hasAttributes",
      "ProcessingInstruction",
      [],
      result,
    );
    return result;
  },
}.hasAttributes;
registerNativeFunction(hasAttributes, "hasAttributes");
