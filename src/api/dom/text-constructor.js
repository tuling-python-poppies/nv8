import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { traceConstruct } from "../../trace/trace-function.js";
import { CharacterData } from "./character-data-constructor.js";
import { currentDocument } from "./document-state.js";
import { initializeNode, TEXT_NODE } from "./node-state.js";

export function Text() {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'Text': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  }
  const data = arguments.length === 0 ? "" : `${arguments[0]}`;
  initializeNode(this, TEXT_NODE, "#text", data, currentDocument());
  traceConstruct("window.Text", [data], "Text");
}
registerNativeFunction(Text, "Text");

export function createText(data, ownerDocument) {
  const text = Object.create(Text.prototype);
  initializeNode(text, TEXT_NODE, "#text", `${data}`, ownerDocument);
  return text;
}

export function installTextConstructor() {
  Object.setPrototypeOf(Text.prototype, CharacterData.prototype);
  Object.setPrototypeOf(Text, CharacterData);
  delete Text.prototype.constructor;
  defineGlobalConstructor("Text", Text);
}

export function finishTextConstructor() {
  defineConstructorBacklink(Text.prototype, Text);
  defineToStringTag(Text.prototype, "Text");
}
