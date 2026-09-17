import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { replaceDataAlgorithm } from "./character-data-algorithms.js";
import { CharacterData } from "./character-data-constructor.js";

const replaceData = {
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
