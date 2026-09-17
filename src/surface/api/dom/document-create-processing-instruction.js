import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import { validateName } from "./element-state.js";
import {
  createProcessingInstruction,
} from "./processing-instruction-constructor.js";

const createProcessingInstructionCallback = {
  createProcessingInstruction(target, data) {
    requireDocument(this);
    const normalizedTarget = `${target}`;
    const normalizedData = `${data}`;
    validateName(normalizedTarget);
    if (normalizedTarget.toLowerCase() === "xml") {
      throw new DOMException(
        "The processing instruction target cannot be XML.",
        "InvalidCharacterError",
      );
    }
    if (normalizedData.includes("?>")) {
      throw new DOMException(
        "Processing instruction data cannot contain '?>'.",
        "InvalidCharacterError",
      );
    }
    const result = createProcessingInstruction(
      normalizedTarget,
      normalizedData,
      this,
    );
    traceCall(
      "window.Document.prototype.createProcessingInstruction",
      "Document",
      [target, data],
      result,
    );
    return result;
  },
}.createProcessingInstruction;
registerNativeFunction(
  createProcessingInstructionCallback,
  "createProcessingInstruction",
);

export function installDocumentCreateProcessingInstruction() {
  definePrototypeMethod(
    Document.prototype,
    "createProcessingInstruction",
    createProcessingInstructionCallback,
  );
}
