import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { beforeAlgorithm } from "./character-data-algorithms.js";
import { CharacterData } from "./character-data-constructor.js";

export const before = {
  before(...values) {
    beforeAlgorithm(this, values);
    traceCall("window.CharacterData.prototype.before", "CharacterData", values, undefined);
  },
}.before;
registerNativeFunction(before, "before");
export function installCharacterDataBefore() {
  definePrototypeMethod(CharacterData.prototype, "before", before);
}
