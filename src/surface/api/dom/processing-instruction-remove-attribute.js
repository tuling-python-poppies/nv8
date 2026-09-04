import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  removeProcessingInstructionAttribute,
} from "./processing-instruction-attributes.js";

export const removeAttribute = {
  removeAttribute(name) {
    removeProcessingInstructionAttribute(this, name);
    traceCall(
      "window.ProcessingInstruction.prototype.removeAttribute",
      "ProcessingInstruction",
      [name],
      undefined,
    );
  },
}.removeAttribute;
registerNativeFunction(removeAttribute, "removeAttribute");
