import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { replaceDataAlgorithm } from "./character-data-algorithms.js";
import { CharacterData } from "./character-data-constructor.js";

export const replaceData = {
  replaceData(offset, count, data) {
    replaceDataAlgorithm(this, offset, count, data);
    traceCall(
      "window.CharacterData.prototype.replaceData",
      "CharacterData",
      [offset, count, data],
      undefined,
    );
  },
}.replaceData;
registerNativeFunction(replaceData, "replaceData");
export function installCharacterDataReplaceData() {
  definePrototypeMethod(CharacterData.prototype, "replaceData", replaceData);
}
