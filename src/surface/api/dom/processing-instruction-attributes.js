import { requireNode } from "./node-state.js";
import {
  requireProcessingInstruction,
} from "./processing-instruction-constructor.js";

export function processingInstructionAttributes(instruction) {
  requireProcessingInstruction(instruction);
  const data = requireNode(instruction).nodeValue ?? "";
  const attributes = new Map();
  const expression = /([A-Za-z_:][A-Za-z0-9_.:-]*)\s*=\s*(["'])(.*?)\2/gu;
  for (const match of data.matchAll(expression)) {
    attributes.set(match[1], match[3]);
  }
  return attributes;
}

export function setProcessingInstructionAttribute(
  instruction,
  name,
  value,
) {
  const normalized = `${name}`;
  if (!/^[A-Za-z_:][A-Za-z0-9_.:-]*$/u.test(normalized)) {
    throw new DOMException("Invalid attribute name.", "InvalidCharacterError");
  }
  const attributes = processingInstructionAttributes(instruction);
  attributes.set(normalized, `${value}`);
  requireNode(instruction).nodeValue = serialize(attributes);
}

export function removeProcessingInstructionAttribute(instruction, name) {
  const attributes = processingInstructionAttributes(instruction);
  attributes.delete(`${name}`);
  requireNode(instruction).nodeValue = serialize(attributes);
}

function serialize(attributes) {
  return Array.from(
    attributes,
    ([name, value]) => `${name}="${`${value}`.replaceAll("\"", "&quot;")}"`,
  ).join(" ");
}
