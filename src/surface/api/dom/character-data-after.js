import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { afterAlgorithm } from "./character-data-algorithms.js";
import { CharacterData } from "./character-data-constructor.js";

export const after = {
  after(...values) {
    afterAlgorithm(this, values);
    traceCall("window.CharacterData.prototype.after", "CharacterData", values, undefined);
  },
}.after;
registerNativeFunction(after, "after");
export function installCharacterDataAfter() {
  definePrototypeMethod(CharacterData.prototype, "after", after);
}
