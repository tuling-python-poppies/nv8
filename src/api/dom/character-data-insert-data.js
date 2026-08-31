import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { insertDataAlgorithm } from "./character-data-algorithms.js";
import { CharacterData } from "./character-data-constructor.js";

export const insertData = {
  insertData(offset, data) {
    insertDataAlgorithm(this, offset, data);
    traceCall("window.CharacterData.prototype.insertData", "CharacterData", [offset, data], undefined);
  },
}.insertData;
registerNativeFunction(insertData, "insertData");
export function installCharacterDataInsertData() {
  definePrototypeMethod(CharacterData.prototype, "insertData", insertData);
}
