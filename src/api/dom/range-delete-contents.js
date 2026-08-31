import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { deleteContentsAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const deleteContents = {
  deleteContents() {
    deleteContentsAlgorithm(this);
    traceCall("window.Range.prototype.deleteContents", "Range", [], undefined);
  },
}.deleteContents;
registerNativeFunction(deleteContents, "deleteContents");
export function installRangeDeleteContents() {
  definePrototypeMethod(Range.prototype, "deleteContents", deleteContents);
}
