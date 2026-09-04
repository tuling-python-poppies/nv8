import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { CharacterData } from "./character-data-constructor.js";
import {
  initializeNode,
  PROCESSING_INSTRUCTION_NODE,
} from "./node-state.js";

const processingInstructions = new WeakSet();

export function ProcessingInstruction() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(ProcessingInstruction, "ProcessingInstruction");

export function createProcessingInstruction(target, data, ownerDocument) {
  const instruction = Object.create(ProcessingInstruction.prototype);
  initializeNode(
    instruction,
    PROCESSING_INSTRUCTION_NODE,
    `${target}`,
    `${data}`,
    ownerDocument,
  );
  processingInstructions.add(instruction);
  return instruction;
}

export function requireProcessingInstruction(value) {
  if (!processingInstructions.has(value)) {
    throw new TypeError("Illegal invocation");
  }
  return value;
}

export function installProcessingInstructionConstructor() {
  Object.setPrototypeOf(
    ProcessingInstruction.prototype,
    CharacterData.prototype,
  );
  Object.setPrototypeOf(ProcessingInstruction, CharacterData);
  delete ProcessingInstruction.prototype.constructor;
  defineGlobalConstructor(
    "ProcessingInstruction",
    ProcessingInstruction,
  );
}

export function finishProcessingInstructionConstructor() {
  defineConstructorBacklink(
    ProcessingInstruction.prototype,
    ProcessingInstruction,
  );
  defineToStringTag(
    ProcessingInstruction.prototype,
    "ProcessingInstruction",
  );
}
