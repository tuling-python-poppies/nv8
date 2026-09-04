import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  processingInstructionAttributes,
} from "./processing-instruction-attributes.js";

export const getAttribute = {
  getAttribute(name) {
    const result = processingInstructionAttributes(this).get(`${name}`)
      ?? null;
    traceCall(
      "window.ProcessingInstruction.prototype.getAttribute",
      "ProcessingInstruction",
      [name],
      result,
    );
    return result;
  },
}.getAttribute;
registerNativeFunction(getAttribute, "getAttribute");
