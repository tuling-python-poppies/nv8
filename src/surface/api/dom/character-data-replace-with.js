import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { replaceWithAlgorithm } from "./character-data-algorithms.js";
import { CharacterData } from "./character-data-constructor.js";

export const replaceWith = {
  replaceWith(...values) {
    replaceWithAlgorithm(this, values);
    traceCall("window.CharacterData.prototype.replaceWith", "CharacterData", values, undefined);
  },
}.replaceWith;
registerNativeFunction(replaceWith, "replaceWith");
export function installCharacterDataReplaceWith() {
  definePrototypeMethod(CharacterData.prototype, "replaceWith", replaceWith);
}
