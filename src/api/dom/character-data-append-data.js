import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { appendDataAlgorithm } from "./character-data-algorithms.js";
import { CharacterData } from "./character-data-constructor.js";

export const appendData = {
  appendData(data) {
    appendDataAlgorithm(this, data);
    traceCall("window.CharacterData.prototype.appendData", "CharacterData", [data], undefined);
  },
}.appendData;
registerNativeFunction(appendData, "appendData");
export function installCharacterDataAppendData() {
  definePrototypeMethod(CharacterData.prototype, "appendData", appendData);
}
