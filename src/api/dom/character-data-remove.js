import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { removeAlgorithm } from "./character-data-algorithms.js";
import { CharacterData } from "./character-data-constructor.js";

export const remove = {
  remove() {
    removeAlgorithm(this);
    traceCall("window.CharacterData.prototype.remove", "CharacterData", [], undefined);
  },
}.remove;
registerNativeFunction(remove, "remove");
export function installCharacterDataRemove() {
  definePrototypeMethod(CharacterData.prototype, "remove", remove);
}
