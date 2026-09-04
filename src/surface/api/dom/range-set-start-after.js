import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { setBoundaryAfter } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const setStartAfter = {
  setStartAfter(node) {
    setBoundaryAfter(this, node, true);
    traceCall("window.Range.prototype.setStartAfter", "Range", [node], undefined);
  },
}.setStartAfter;
registerNativeFunction(setStartAfter, "setStartAfter");
export function installRangeSetStartAfter() {
  definePrototypeMethod(Range.prototype, "setStartAfter", setStartAfter);
}
