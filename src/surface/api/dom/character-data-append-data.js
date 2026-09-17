import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { appendDataAlgorithm } from "./character-data-algorithms.js";
import { CharacterData } from "./character-data-constructor.js";

const appendData = {
  appendData(data) {
    appendDataAlgorithm(this, data);
    traceCall("window.CharacterData.prototype.appendData", "CharacterData", [data], undefined);
  },
}.appendData;
registerNativeFunction(appendData, "appendData");
export function installCharacterDataAppendData() {
  definePrototypeMethod(CharacterData.prototype, "appendData", appendData);
}
