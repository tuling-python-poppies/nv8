import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { selectNodeContentsAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const selectNodeContents = {
  selectNodeContents(node) {
    selectNodeContentsAlgorithm(this, node);
    traceCall("window.Range.prototype.selectNodeContents", "Range", [node], undefined);
  },
}.selectNodeContents;
registerNativeFunction(selectNodeContents, "selectNodeContents");
export function installRangeSelectNodeContents() {
  definePrototypeMethod(Range.prototype, "selectNodeContents", selectNodeContents);
}
