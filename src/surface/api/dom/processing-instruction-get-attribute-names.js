import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  processingInstructionAttributes,
} from "./processing-instruction-attributes.js";

export const getAttributeNames = {
  getAttributeNames() {
    const result = Array.from(processingInstructionAttributes(this).keys());
    traceCall(
      "window.ProcessingInstruction.prototype.getAttributeNames",
      "ProcessingInstruction",
      [],
      result,
    );
    return result;
  },
}.getAttributeNames;
registerNativeFunction(getAttributeNames, "getAttributeNames");
