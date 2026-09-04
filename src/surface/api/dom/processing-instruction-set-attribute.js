import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  setProcessingInstructionAttribute,
} from "./processing-instruction-attributes.js";

export const setAttribute = {
  setAttribute(name, value) {
    setProcessingInstructionAttribute(this, name, value);
    traceCall(
      "window.ProcessingInstruction.prototype.setAttribute",
      "ProcessingInstruction",
      [name, value],
      undefined,
    );
  },
}.setAttribute;
registerNativeFunction(setAttribute, "setAttribute");
