import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { substringDataAlgorithm } from "./character-data-algorithms.js";
import { CharacterData } from "./character-data-constructor.js";

const substringData = {
  substringData(offset, count) {
    const result = substringDataAlgorithm(this, offset, count);
    traceCall(
      "window.CharacterData.prototype.substringData",
      "CharacterData",
      [offset, count],
      result,
    );
    return result;
  },
}.substringData;
registerNativeFunction(substringData, "substringData");
export function installCharacterDataSubstringData() {
  definePrototypeMethod(CharacterData.prototype, "substringData", substringData);
}
