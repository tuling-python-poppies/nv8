import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  processingInstructionAttributes,
} from "./processing-instruction-attributes.js";

export const hasAttribute = {
  hasAttribute(name) {
    const result = processingInstructionAttributes(this).has(`${name}`);
    traceCall(
      "window.ProcessingInstruction.prototype.hasAttribute",
      "ProcessingInstruction",
      [name],
      result,
    );
    return result;
  },
}.hasAttribute;
registerNativeFunction(hasAttribute, "hasAttribute");
