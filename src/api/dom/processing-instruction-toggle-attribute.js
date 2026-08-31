import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  processingInstructionAttributes,
  removeProcessingInstructionAttribute,
  setProcessingInstructionAttribute,
} from "./processing-instruction-attributes.js";

export const toggleAttribute = {
  toggleAttribute(name) {
    const attributes = processingInstructionAttributes(this);
    const present = attributes.has(`${name}`);
    const forced = arguments.length > 1 ? Boolean(arguments[1]) : undefined;
    let result;
    if (present && forced !== true) {
      removeProcessingInstructionAttribute(this, name);
      result = false;
    } else if (!present && forced !== false) {
      setProcessingInstructionAttribute(this, name, "");
      result = true;
    } else {
      result = present;
    }
    traceCall(
      "window.ProcessingInstruction.prototype.toggleAttribute",
      "ProcessingInstruction",
      [name, arguments[1]],
      result,
    );
    return result;
  },
}.toggleAttribute;
registerNativeFunction(toggleAttribute, "toggleAttribute");
