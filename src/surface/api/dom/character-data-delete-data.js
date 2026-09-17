import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { deleteDataAlgorithm } from "./character-data-algorithms.js";
import { CharacterData } from "./character-data-constructor.js";

const deleteData = {
  deleteData(offset, count) {
    deleteDataAlgorithm(this, offset, count);
    traceCall("window.CharacterData.prototype.deleteData", "CharacterData", [offset, count], undefined);
  },
}.deleteData;
registerNativeFunction(deleteData, "deleteData");
export function installCharacterDataDeleteData() {
  definePrototypeMethod(CharacterData.prototype, "deleteData", deleteData);
}
