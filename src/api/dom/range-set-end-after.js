import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { setBoundaryAfter } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const setEndAfter = {
  setEndAfter(node) {
    setBoundaryAfter(this, node, false);
    traceCall("window.Range.prototype.setEndAfter", "Range", [node], undefined);
  },
}.setEndAfter;
registerNativeFunction(setEndAfter, "setEndAfter");
export function installRangeSetEndAfter() {
  definePrototypeMethod(Range.prototype, "setEndAfter", setEndAfter);
}
